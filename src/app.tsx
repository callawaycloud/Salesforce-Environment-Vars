import { Card, Button, message } from 'antd';
import { hot } from 'react-hot-loader'; // needs to be before react!
import * as React from 'react';
import { ENVVarmdt, ENVVarmdtFields } from '@src/generated';
import * as jsforce from 'jsforce';
import { DEFAULT_CONFIG } from 'ts-force/build/auth/baseConfig';
import { EnvVar, EnvVarItem } from './components/EnvItem';

const ENV_PREFIX = ENVVarmdt.API_NAME.replace('__mdt', '');

interface MetadataResult {
  success: boolean;
  errors: { message: string };
}

interface AppState {
  vars: EnvVar[];
}

class App extends React.Component<{}, AppState> {
  private mdapi: jsforce.Metadata;
  constructor(props: any) {
    super(props);
    this.state = {
      vars: [],
    };
  }

  // RETRIEVE METADATA
  public async componentDidMount() {
    const conn = new jsforce.Connection({
      accessToken: DEFAULT_CONFIG.accessToken,
    });
    this.mdapi = conn.metadata;
    const vars = await ENVVarmdt.retrieve((fields) => {
      return {
        select: fields.select('id', 'developerName', 'datatype', 'value', 'qualifiedApiName'),
        limit: 100,
      };
    });
    if (vars.length > 0) {
      this.setState({ vars });
    }
  }

  // local changes handlers
  private updateVar = (index: number, field: keyof ENVVarmdtFields, val: string) => {
    const vars = [...this.state.vars];
    vars[index] = { ...vars[index], ...{ [field]: val, hasChanges: true } };
    this.setState({ vars });
  }

  private addNew = () => {
    const vars = [...this.state.vars];
    vars.push({
      datatype: 'String',
      localOnly: true,
    });
    this.setState({ vars });
  }

  // DML Handlers
  private saveVar = async (index: number) => {

    const itemToSave = this.state.vars[index];

    // tslint:disable-next-line: no-object-literal-type-assertion
    const payload = {
      fullName: `${ENV_PREFIX}.${itemToSave.developerName}`,
      label: itemToSave.developerName,
      values: [
        { field: ENVVarmdt.FIELDS['value'].apiName, value: itemToSave.value },
        { field: ENVVarmdt.FIELDS['datatype'].apiName, value: itemToSave.datatype },

      ],
    } as jsforce.MetadataInfo;

    let result: MetadataResult;
    if (itemToSave.localOnly) {
      result = await this.mdapi.create('CustomMetadata', payload) as any as MetadataResult;
    } else {
      result = await this.mdapi.update('CustomMetadata', payload) as any as MetadataResult;
    }
    let newVar: Partial<EnvVar>;
    if (result.success) {
      newVar = { hasChanges: false, localOnly: false, dmlError: false };
    } else {
      newVar = { dmlError: true };
      message.error(result.errors.message);
    }

    const vars = [...this.state.vars];
    vars[index] = { ...vars[index], ...newVar };
    this.setState({ vars });
  }

  private removeVar = async (index: number) => {

    const itemToDelete = this.state.vars[index];

    if (!itemToDelete.localOnly) {
      const result = await this.mdapi.delete(
        'CustomMetadata',
        `${ENV_PREFIX}.${itemToDelete.developerName}`,
      ) as any as MetadataResult;

      if (!result.success) {
        message.error(result.errors.message);
        return;
      }
    }
    const vars = this.state.vars.filter((_, i) => i !== index);
    this.setState({ vars });
  }

  public render() {
    const vars = this.state.vars.map((v, i) => {
      return (
        <EnvVarItem
          key={i}
          index={i}
          item={v}
          onRemove={this.removeVar}
          onSave={this.saveVar}
          onUpdate={this.updateVar}
        />
      );
    });
    return (
      <Card title='Env Vars Management'>
        {vars}
        <Button style={{ marginTop: 15 }} type='primary' icon='plus' onClick={this.addNew}>Add</Button>
      </Card>
    );
  }

}

export default hot(module)(App);
