# Salesforce Environment Variables

***WARNING:*** This package will soon be released as an unlocked namespace package.  I've you have already installed and want to stay up-to-sync with the latest improvements, there will be a manual migration process!

A simple library for using Custom Metadata to manage simple Key/Value Environment variables + Admin UI.

![UI](https://user-images.githubusercontent.com/5217568/58003863-f841e400-7a9e-11e9-8e7a-27b710606086.png)


*idea inspired by Ralph Callaway's work*

## Features

### Works in both formulas<sup>1</sup> & apex

Apex:
```java
Map<String,String> fieldMap = (Map<String,String>) ENV.get('FIELD_MAP');
```

Formula:
```
$CustomMetadata.ENV_Var__mdt.FIELD_MAP.Val__c
```

### copy as apex/formula code to clipboard
![copy code](https://user-images.githubusercontent.com/5217568/58001336-6636dd00-7a98-11e9-875b-a468d42633cc.png)

### "typechecking" to prevent user input errors
![copy code](https://user-images.githubusercontent.com/5217568/58004297-2ecc2e80-7aa0-11e9-9ca9-c0e2e5d4a0da.png)

### Quick Find on KEY or VALUE

### auto-formatting of JSON types

### ability to group "VARS"

### ability to add Notes
![notes](
https://user-images.githubusercontent.com/5217568/58004459-7d79c880-7aa0-11e9-9641-5ef774ea603f.png)

### Table of Contents / Glossary Index

<sup>1</sup> When using in formulas, you only can access the first 255 characters

### The following types are currently supported:

- `String`
- `Integer`
- `Decimal`
- `Boolean`: Format: `true` or `false`
- `String[]`: Format: `["a","b","c"]`
- `Map<String,String>`: Format: `{"456":"xyz","123":"abc"}`

## Usage

### Install in org

[Use SFDX to deploy to org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_build_mdapi_deploy.htm)

1. `git clone https://github.com/ChuckJonas/Salesforce-Environment-Vars.git`
1. `cd Salesforce-Environment-Vars`
1. `mkdir deploy`
2. `sfdx force:source:convert -d deploy/`
3. `sfdx force:mdapi:deploy -d deploy/ -u "YOUR_USERNAME_HERE" -l RunSpecifiedTests -r EnvTests`

**NOTE:** This application comes with a custom user interface for easier management of the ENV Vars.  It is HIGHLY RECOMMENED, but not required. If you'd prefer not to use it, delete the following before deploying:

- `force-app/main/default/pages`
- `force-app/main/default/staticresources`

### Create ENV VARS

If UI was installed, navigate to `/apex/env_vars` and setup your Environment Variables.  Otherwise, just manage like any other Custom Metadata (it will be up to you to ensure the types are correct).


### Contributing/Modifying

This project is built off the [B.A.S.S. Stack](https://github.com/ChuckJonas/bad-ass-salesforce-stack).  See Readme for details on how to develop.
