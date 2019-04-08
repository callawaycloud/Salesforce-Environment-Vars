import { ENVVarmdtFields } from "./generated";

interface System {
  import<T = any>(module: string): Promise<T>
}
declare var System: System;

//allow importing of files with file-loader
declare module '*.png'
declare module '*.jpg'

interface MetadataResult {
  success: boolean;
  errors: { message: string };
}

type DataType = 'String' | 'Integer' | 'Decimal' | 'Boolean' | 'String[]';

interface EnvVar {
  key?: string;
  dataType: 'String' | 'Integer' | 'Decimal' | 'Boolean' | 'String[]';
  value?: string
  group?: string;
  hasChanges?: boolean;
  localOnly?: boolean;
  dmlError?: boolean;
  keyError?: boolean;
  typeError?: boolean;
}
