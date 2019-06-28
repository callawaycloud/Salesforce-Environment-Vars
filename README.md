# Salesforce Environment Variables

***WARNING:*** This package will soon be released as an [namespaced unlocked package](https://github.com/ChuckJonas/Salesforce-Environment-Vars/issues/3).  I've you have already installed and want to stay up-to-sync with the latest improvements, there will be a manual migration process!

A simple library for using Custom Metadata to manage simple Key/Value Environment variables + Admin UI.

![UI](https://user-images.githubusercontent.com/5217568/58003863-f841e400-7a9e-11e9-8e7a-27b710606086.png)

*idea inspired by Ralph Callaway's work*

## Install

### via sfdx-cli
`sfdx force:package:install --package xyz -u your@org.user`

### via url
login and navigate to [`/packaging/installPackage.apexp?p0=04t1C000000tfGMQAY`](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t1C000000tfGMQAY). Choose `Install for: Admin Only`.

## Usage

1. Open Environment Variables from the app switcher (or "tabs" in classic)
2. Setup vars
3. Use in Apex or Formulas<sup>1</sup>

Apex:
```java
Map<String,String> fieldMap = (Map<String,String>) ENV.get('FIELD_MAP');
```

Formula:
```
$CustomMetadata.ENV_Var__mdt.FIELD_MAP.Val__c
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


### Contributing/Modifying

This project is built off the [B.A.S.S. Stack](https://github.com/ChuckJonas/bad-ass-salesforce-stack).  See Readme for details on how to develop.

** Powered by [Callaway Cloud Consulting](http://www.callawaycloud.com/) ** 
