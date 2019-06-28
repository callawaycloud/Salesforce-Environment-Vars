# Upgrade from pre-namespaced version

If you installed this package prior to the packaged namedspace releae, you will need to manually upgrade:

1. Install the packaged version
1. Use the script below to migrate your `ENV_Var__mdt` to `VARS__ENV__mdt`
1. Update any refrenences to `Env.get` to `VARS.Env.get`
1. Update any other references to `ENV_Var__mdt` to `VARS__ENV__mdt` (formula, direct queries, rest api, etc)


``` java
//run as anyon apex
public class CustomMetadataCallback implements Metadata.DeployCallback {
    public void handleResult(Metadata.DeployResult result,
                            Metadata.DeployCallbackContext context) {
        if (result.status == Metadata.DeployStatus.Succeeded) {
            System.debug('success: '+ result);
        } else {
            // Deployment was not successful
            System.debug('fail: '+ result);
        }
    }
}   

Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();   
for(ENV_Var__mdt vars : [SELECT 
                          Label, MasterLabel, DeveloperName, 
                          Datatype__c, Group__c,
                          Notes__c, Val__c, Value__c   
                          FROM ENV_Var__mdt]){
    // Set up custom metadata to be created in the subscriber org.
    Metadata.CustomMetadata customMetadata = new Metadata.CustomMetadata();
    customMetadata.fullName = 'VARS__ENV__mdt' + '.' + vars.DeveloperName;
    customMetadata.label = vars.Label;

    Metadata.CustomMetadataValue datatype = new Metadata.CustomMetadataValue();
    datatype.field = 'VARS__Datatype__c';
    datatype.value = vars.Datatype__c;
    customMetadata.values.add(datatype);
    
    Metadata.CustomMetadataValue grp = new Metadata.CustomMetadataValue();
    grp.field = 'VARS__Group__c';
    grp.value = vars.Group__c;
    customMetadata.values.add(grp);
   
    Metadata.CustomMetadataValue notes = new Metadata.CustomMetadataValue();
    notes.field = 'VARS__Notes__c';
    notes.value = vars.Notes__c;
    customMetadata.values.add(notes);
                              
    Metadata.CustomMetadataValue val = new Metadata.CustomMetadataValue();
    val.field = 'VARS__Val__c';
    val.value = vars.Val__c;
    customMetadata.values.add(val);
                              
    Metadata.CustomMetadataValue value = new Metadata.CustomMetadataValue();
    value.field = 'VARS__Value__c';
    value.value = vars.Value__c;
    customMetadata.values.add(value);

    mdContainer.addMetadata(customMetadata);
}


// Setup deploy callback, MyDeployCallback implements
// the Metadata.DeployCallback interface (code for
// this class not shown in this example)
CustomMetadataCallback callback = new CustomMetadataCallback();

// Enqueue custom metadata deployment
// jobId is the deployment ID
Id jobId = Metadata.Operations.enqueueDeployment(mdContainer, callback);
```

