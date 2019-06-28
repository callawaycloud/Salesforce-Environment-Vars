# sf-env-vars

A simple npm package for accessing [Salesforce-Env-Vars](https://github.com/ChuckJonas/Salesforce-Environment-Vars).

## Usage

1. Install

`npm install sf-env-vars`

2. Define an ENV Class.  The property names should match the ENV_VAR `DeveloperName` and must be assigned to null:

``` typescript
    export class Env {
        public FOO: string = null; 
        public BAR: number = null;
    }
```

3. Load & Use
``` typescript
    import {load} from 'sf-env-vars';
    const vars = await load(Env);
    console.log(vars.FOO, vars.BAR);
```

Note: Currently uses ts-force as a peer dependency to connect & query salesforce.  Will likely refactor in the future to accept a connection (and use more lightwieght client like axios).
