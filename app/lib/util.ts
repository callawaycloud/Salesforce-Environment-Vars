import { Validator } from 'jsonschema';
import { message } from 'antd';

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

const jsonValidator = new Validator();

export const validateType = (item: EnvVar): boolean | string[] => {
  const { dataType, value } = item;

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
        const jsonValue = JSON.parse(value);
        if (item.jsonSchema) {
          try {
            const schema = JSON.parse(item.jsonSchema);
            const result = jsonValidator.validate(jsonValue, schema)
            if (!result.valid) {
              return result.errors.map(e => e.toString());
            }
          } catch (e) {
            console.warn('Failed to validate json', e);
          }
        }

        return true;
      } catch (e) {
        return false;
      }
    default:
      return true;
  }
};

export const copy = (text: string, msg: string) => {
  navigator.clipboard.writeText(text);
  message.info(msg);
};

export function isJson(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
