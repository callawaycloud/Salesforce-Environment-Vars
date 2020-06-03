# Salesforce Environment Variables

A simple library which uses Custom Metadata to manage simple Key/Value Environment variables.  Includes a custom UI to make configuration as easy & error free as possible.

![UI](https://user-images.githubusercontent.com/5217568/82095896-39260600-96bd-11ea-879f-0637d78f1a78.png)

## 📦 Install

**via sfdx-cli**
`sfdx force:package:install --package 04t1C000000lIDuQAM -u your@org.user`

**via url**
login and navigate to [`/packaging/installPackage.apexp?p0=04t1C000000lIDuQAM`](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t1C000000lIDuQAM). Choose `Install for: Admin Only`.

### Upgrading

This project has been updated to a [namespaced unlocked package](https://github.com/ChuckJonas/Salesforce-Environment-Vars/issues/3).  If you installed before the namespace was added, and want to stay up-to-sync with the latest improvements, then please follow the [manual migration process](https://github.com/ChuckJonas/Salesforce-Environment-Vars/blob/master/docs/UPGRADE-FROM-UNPACKAGED.md)!

## 🔨 Usage

1. Open Environment Variables from the app switcher (or "tabs" in classic)
2. Add and Save some env-vars
3. Use in Apex, Formulas or [javascript applications](https://github.com/ChuckJonas/Salesforce-Environment-Vars/tree/master/sf-env-vars-npm).

### Apex

```java
//basic usage
Map<String,String> fieldMap = (Map<String,String>) VARS.ENV.get('MY_MAP');

//with a string transform
Map<String,String> fieldMap = (String[]) VARS.ENV.get('MY_ARRAY', VARS.ENV.Transform.TO_LOWER);

// with ANY json
Foo fieldMap = (Foo) VARS.ENV.get('MY_FOO', Foo.class);

```

### Formula

```
$CustomMetadata.VARS__ENV__mdt.FIELD_MAP.Val__c
```

Note: Only the first 255 characters will be returned in formula!

## ✨Features

### Currently supports the following types:

- `String`
- `Integer`
- `Decimal`
- `Boolean`: Format: `true` or `false`
- `String[]`: Format: `["a","b","c"]`
- `Map<String,String>`: Format: `{"456":"xyz","123":"abc"}`
- `ANY`: Any valid JSON string

### Copy apex/formula code to clipboard
![copy code](https://user-images.githubusercontent.com/5217568/58001336-6636dd00-7a98-11e9-875b-a468d42633cc.png)

### "Type-checking" to prevent user input errors

- Simple type checking on primitive types.
- ability to apply JSON Schema to `ANY` json type!

![type checking](https://user-images.githubusercontent.com/5217568/58004297-2ecc2e80-7aa0-11e9-9ca9-c0e2e5d4a0da.png)

### "Secret" Values Support (Optional)

<img width="1342" alt="Salesforce_-_Unlimited_Edition" src="https://user-images.githubusercontent.com/5217568/60910786-f4c90e80-a23e-11e9-9806-6bf47a2a8f07.png">

In order to enable, [follow these instructions](https://github.com/ChuckJonas/Salesforce-Environment-Vars/blob/master/docs/ENABLE-SECRETS.md).


### Quick Find

Quickly filter VARS based on either key or value string search.

### Auto-formatting of JSON types

Automatically formats JSON after editing

### Ability to group like "VARS" together

<img width="947" alt="https___drive-connect-5888-dev-ed--vars_visualforce_com_apex_env_vars_local_1" src="https://user-images.githubusercontent.com/5217568/77575880-c7d68d80-6e99-11ea-84b4-fbf92231639e.png">


### Ability to add Notes

Add information about how it's used, how to manage it, etc

![notes](
https://user-images.githubusercontent.com/5217568/58004459-7d79c880-7aa0-11e9-9641-5ef774ea603f.png)


## 🤝 Contributing/Modifying

Project Overview:

- `env-vars`: Salesforce metadata for core env-vars functionality
- `app`: React UI for managing env-vars.  Uses [B.A.S.S. Stack](https://github.com/ChuckJonas/bad-ass-salesforce-stack)
- `env-vars-encrypt`: managed package to allow for "secret" vars
- `sf-env-vars-npm`: npm package to make using env-vars easy in js applications


** Powered by ** [Callaway Cloud Consulting](https://www.callawaycloud.com/)
