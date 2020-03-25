import { DataType, EnvVar } from '@src/types';

export const getApex = (item: EnvVar) => {
  let dataType: string = item.dataType;
  if (dataType === 'ANY') {
    dataType = 'Map<String, Object>';
  }
  return `(${dataType}) VARS.ENV.get('${item.key}');`;
};

export const getFormula = (item: EnvVar) => {
  return `$CustomMetadata.VARS__ENV__mdt.${item.key}.Val__c`;
};

export const validateType = (dataType: DataType, value: string): boolean => {
  if (!value) {
    return true;
  }
  switch (dataType) {
    case 'Integer':
      return Number.isInteger(parseInt(value));
    case 'Decimal':
      return !Number.isNaN(parseFloat(value));
    case 'Boolean':
      const b = value.toLowerCase();
      return b === 'true' || b === 'false';
    case 'String[]':
      try {
        const arr = JSON.parse(value);
        return Array.isArray(arr);
      } catch (e) {
        return false;
      }
    case 'Map<String,String>':
      try {
        const map = JSON.parse(value);
        // tslint:disable-next-line: forin
        for (const key of Object.keys(map)) {
          if (typeof key !== 'string') {
            return false;
          }
          if (typeof map[key] !== 'string') {
            return false;
          }
        }
        return true;
      } catch (e) {
        return false;
      }
    case 'ANY':
      try {
        JSON.parse(value);
        return true;
      } catch (e) {
        return false;
      }
    default:
      return true;
  }
};

export const isJson = (str: string) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
};
