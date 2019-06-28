import { Rest } from 'ts-force';
import { ApexClass } from '@src/generated';

export const getSecretsEnabled = async () => {
  const results = await ApexClass.retrieve(f => ({
    select: ['id'],
    where: [
      { field: f.select('namespacePrefix'), val: 'VARS' },
      { field: f.select('name'), val: 'EncryptHelper' }
    ]
  }));
  return results.length > 0;
}

export const createSecret = async (secret: string) => {
  let rest = new Rest();
  return (await rest.invokeAction<string>('VARS__Secrets', [{ secrets: secret }]))[0].outputValues.output;
}
