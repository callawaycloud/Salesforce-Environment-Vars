# Salesforce Environment Variables

A simple library which uses Custom Metadata to manage simple Key/Value Environment variables.  Includes a custom UI to make configuration as easy & error free as possible.

![UI](https://user-images.githubusercontent.com/5217568/58003863-f841e400-7a9e-11e9-8e7a-27b710606086.png)

***NOTE:*** This project has been updated to a [namespaced unlocked package](https://github.com/ChuckJonas/Salesforce-Environment-Vars/issues/3).  If you have already installed and want to stay up-to-sync with the latest improvements, then please follow the [manual migration process](https://github.com/ChuckJonas/Salesforce-Environment-Vars/blob/master/docs/UPGRADE-FROM-UNPACKAGED.md)!

## Install

**via sfdx-cli**
`sfdx force:package:install --package 04t1C000000ODZJQA4 -u your@org.user`

**via url**
login and navigate to [`/packaging/installPackage.apexp?p0=04t1C000000ODZJQA4`](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t1C000000ODZJQA4). Choose `Install for: Admin Only`.


## Usage

1. Open Environment Variables from the app switcher (or "tabs" in classic)
2. Add and Save some  env-vars
3. Use in Apex or Formulas<sup>1</sup>

Apex:
```java
Map<String,String> fieldMap = (Map<String,String>) VARS.ENV.get('FIELD_MAP');
```

Formula:
```
$CustomMetadata.VARS__ENV__mdt.FIELD_MAP.Val__c
```
<sup>1</sup>only the first 255 characters will be returned in formula!

## Features

### Currently supports the following types:

- `String`
- `Integer`
- `Decimal`
- `Boolean`: Format: `true` or `false`
- `String[]`: Format: `["a","b","c"]`
- `Map<String,String>`: Format: `{"456":"xyz","123":"abc"}`

### copy apex/formula code to clipboard
![copy code](https://user-images.githubusercontent.com/5217568/58001336-6636dd00-7a98-11e9-875b-a468d42633cc.png)

### "type-checking" to prevent user input errors
![copy code](https://user-images.githubusercontent.com/5217568/58004297-2ecc2e80-7aa0-11e9-9ca9-c0e2e5d4a0da.png)

### "secret" Values Support (Optional)

<img width="1342" alt="Salesforce_-_Unlimited_Edition" src="https://user-images.githubusercontent.com/5217568/60910786-f4c90e80-a23e-11e9-9806-6bf47a2a8f07.png">

In order to enable, [follow these instructions](https://github.com/ChuckJonas/Salesforce-Environment-Vars/blob/master/docs/ENABLE-SECRETS.md).


### Quick Find on KEY or VALUE

### auto-formatting of JSON types

### ability to group like "VARS" together

### ability to add Notes
![notes](
https://user-images.githubusercontent.com/5217568/58004459-7d79c880-7aa0-11e9-9641-5ef774ea603f.png)

### Table of Contents / Glossary Index


## Contributing/Modifying

Project Overview:

- `env-vars`: Salesforce metadata for core env-vars functionality
- `app`: React UI for managing env-vars.  Uses [B.A.S.S. Stack](https://github.com/ChuckJonas/bad-ass-salesforce-stack)
- `env-vars-encrypt`: managed package to allow for "secret" vars
- `sf-env-vars-npm`: npm package to make using env-vars easy in js applications


** Powered by ** [Callaway Cloud Consulting](https://www.callawaycloud.com/)
