public with sharing class EditEnvVars {
    private Metadata.DeployContainer mdContainer;
    public EditEnvVars() {
        mdContainer = new Metadata.DeployContainer();
    }

    public void addEnvVar(String key, Object val, String dataType){
        // Set up custom metadata to be created in the subscriber org.
        Metadata.CustomMetadata customMetadata =  new Metadata.CustomMetadata();
        customMetadata.fullName = 'ENV_Var.' + key;
        customMetadata.label = key;

        Metadata.CustomMetadataValue valueField = new Metadata.CustomMetadataValue();
        valueField.field = 'Value__c';
        valueField.value = (String) val;
        customMetadata.values.add(valueField);

        Metadata.CustomMetadataValue dataTypeField = new Metadata.CustomMetadataValue();
        dataTypeField.field = 'DataType__c';
        dataTypeField.value = dataType;
        customMetadata.values.add(dataTypeField);

        Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();
        mdContainer.addMetadata(customMetadata);
    }


    // Enqueue custom metadata deployment
    public Id deploy(){
        CustomMetadataCallback callback = new CustomMetadataCallback();
        return Metadata.Operations.enqueueDeployment(mdContainer, callback);
    }

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
}


