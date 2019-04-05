# Salesforce Environment Variables

A simple library for using Custom Metadata to manage simple Key/Value Environment variables

![Setting up a env var](https://user-images.githubusercontent.com/5217568/55655324-213d3c80-57b1-11e9-8b90-4ff6ef7684ff.png)

## Usage

### install in org

[Use SFDX to deploy to org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_build_mdapi_deploy.htm)

1. `git clone https://github.com/ChuckJonas/Salesforce-Environment-Vars.git`
1. `cd Salesforce-Environment-Vars`
1. `mkdir deploy`
1. `sfdx force:source:convert -d deploy/ --packagename package_name`
1. `sfdx force:mdapi:deploy -d deploy/ -u "YOUR_USERNAME_HERE" -l RunSpecifiedTests -r EnvTests`

### Setup

- Add new ENV vars @ Custom Metadata Types -> ENV Var -> Manage ENV Vars

#### Notes

The following types are currently supported:

- `String`
- `Integer`
- `Decimal`
- `Boolean`
- `String[]`

For collection types (currently just `String[]`), use the format from `JSON.serialize()`:

```java
//example how to create `Value__c` from in developer console
System.debug(JSON.serialize(
    new String[] {
        '1,',
        '2;',
        '3'
    }
));
```

### Access in apex

Use `Env.get()` to access by passing in the `DeveloperName`:

``` java
// cast to datatype
Integer retries = (Integer) Env.get('Account_Sync_Retries');
```