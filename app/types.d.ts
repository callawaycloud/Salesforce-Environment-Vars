interface System {
  import<T = any>(module: string): Promise<T>
}
declare var System: System;


//allow importing of files with file-loader
declare module '*.png'
declare module '*.jpg'
declare module 'json-schema-generator'

interface MetadataResult {
  success: boolean;
  errors: { message: string };
}

type DataType = 'String' | 'Integer' | 'Decimal' | 'Boolean' | 'String[]' | 'Map<String,String>' | 'ANY';

interface EnvVar {
  key?: string;
  dataType: DataType;
  value?: string
  group?: string;
  notes?: string;
  secret: boolean;
  localOnly?: boolean;
  dmlError?: boolean;
  keyError?: boolean;
  typeError?: boolean;
  jsonSchema?: string;
}
