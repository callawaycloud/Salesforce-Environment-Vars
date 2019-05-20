import { DEFAULT_CONFIG } from 'ts-force/build/auth/baseConfig';
import { EnvVarRecord } from '@src/generated';
import { EnvVar, DataType, MetadataResult } from '@src/types';
import * as jsforce from 'jsforce';

const ENV_PREFIX = EnvVarRecord.API_NAME.replace('__mdt', '');
const CUSTOM_METADATA = 'CustomMetadata';

export class MetadataService {
  private mdapi: jsforce.Metadata;
  constructor() {
    const conn = new jsforce.Connection({
      accessToken: DEFAULT_CONFIG.accessToken,
    });
    this.mdapi = conn.metadata;
  }

  public retrieveEnvVars = async (): Promise<EnvVar[]> => {
    const varsRecords = await EnvVarRecord.retrieve((fields) => {
      return {
        select: fields.select('id', 'developerName', 'datatype', 'value', 'group', 'notes'),
      };
    });
    if (varsRecords.length > 0) {
      const vars = varsRecords.map<EnvVar>((vRec) => {
        const { developerName: key, value, datatype, group, notes } = vRec;
        const dataType = datatype as DataType;
        return {
          key,
          value,
          dataType,
          group: group || '',
          notes: notes || '',
        };
      });

      return vars;
    }
    return [];
  }

  public updateGroup = async (items: EnvVar[], newGroup: string) => {
    for (const v of items) {
      const payload = {
        fullName: `${ENV_PREFIX}.${v.key}`,
        label: v.key,
        values: [
          { field: EnvVarRecord.FIELDS['group'].apiName, value: newGroup },
        ],
      } as jsforce.MetadataInfo;
      const result = await this.mdapi.update(CUSTOM_METADATA, payload) as any as MetadataResult;
      if (!result.success) {
        console.log('Failed to change group', v, newGroup);
      }
    }
  }

  public saveEnvVars = async (item: EnvVar) => {
    // tslint:disable-next-line: no-object-literal-type-assertion
    const val = item.value.slice(0, Math.min(255, item.value.length));
    const payload: jsforce.MetadataInfo = {
      fullName: `${ENV_PREFIX}.${item.key}`,
      label: item.key,
      values: [
        { field: EnvVarRecord.FIELDS['value'].apiName, value: item.value },
        { field: EnvVarRecord.FIELDS['val'].apiName, value: val },
        { field: EnvVarRecord.FIELDS['datatype'].apiName, value: item.dataType },
        { field: EnvVarRecord.FIELDS['group'].apiName, value: item.group },
        { field: EnvVarRecord.FIELDS['notes'].apiName, value: item.notes },
      ],
    } as jsforce.MetadataInfo;

    let result: MetadataResult;
    if (item.localOnly) {
      result = await this.mdapi.create(CUSTOM_METADATA, payload) as any as MetadataResult;
    } else {
      result = await this.mdapi.update(CUSTOM_METADATA, payload) as any as MetadataResult;
    }
    if (!result.success) {
      throw new Error(result.errors.message);
    }
  }

  public deleteEnvVar = async (item: EnvVar) => {
    const result = await this.mdapi.delete(
      CUSTOM_METADATA,
      `${ENV_PREFIX}.${item.key}`,
    ) as any as MetadataResult;

    if (!result.success) {
      throw new Error(result.errors.message);
    }
  }
}
