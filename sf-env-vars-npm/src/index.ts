import {EnvVarRecord} from './generated';

type EnvValType = number | string | boolean | string[] | {[key: string]: string};

export const load = async <T>(varsObject: { new(): T }): Promise<T> => {

  let result = new varsObject();
  const envVars = await EnvVarRecord.retrieve((fields) => (
    {
      select: [...fields.select('datatype', 'developerName', 'value')],
      where: [
        {field: fields.select('developerName'), val: Object.keys(result)}
      ]
    }
  ));

  for (const envVar of envVars) {
    let val: EnvValType;
    switch (envVar.datatype.toLowerCase()) {
      case 'integer':
      val = parseInt(envVar.value);
      break;
      case 'decimal':
      val = parseFloat(envVar.value);
      break;
      case 'boolean':
      val = envVar.value.toLowerCase() === 'true';
      break;
      case 'string[]':
      case 'map<string,string>':
      val = JSON.parse(envVar.value);
      break;
      default:
      val = envVar.value;
    }
    const key = envVar.developerName;
    result[key] = val;
  }
  return result;
}
