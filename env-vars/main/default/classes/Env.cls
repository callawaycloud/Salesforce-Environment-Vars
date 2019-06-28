// Author: Charles Jonas (charlie@callaway.cloud)
// v1.0 see: https://github.com/ChuckJonas/Salesforce-Environment-Vars
global class Env {
    private static Map<String, ENV__mdt> cachedVars;

    global static Object get(String key){
        if(cachedVars == null){
            setCachedVars([SELECT DeveloperName, Datatype__c, Value__c, Secret__c FROM ENV__mdt]);
        }
        
        if(cachedVars.containsKey(key)){
            return parseValue(cachedVars.get(key));
        }
        throw new ENVException('DeveloperName ' + key + ' not found exists in ENV__mdt!');
    }

    @testVisible static void setCachedVars(ENV__mdt[] vars){
        cachedVars = new Map<String, ENV__mdt>();
        for(ENV__mdt var : vars){
            cachedVars.put(var.DeveloperName, var);
        }
    }

    private static Object parseValue(ENV__mdt var){
        String value = var.Value__c;

        //decrypt
        if(var.Secret__c && Secrets.enabled()){
            value = Secrets.read(value);
        }

        switch on var.Datatype__c {
            when 'Integer' {
                return Integer.valueOf(value);
            }
            when 'Decimal' {
                return Decimal.valueOf(value);
            }
            when 'Boolean' {
                return Boolean.valueOf(value);
            }
            when 'String[]' {
                return JSON.Deserialize(value, List<String>.class);
            }
            when 'Map<String,String>' {
                return JSON.Deserialize(value, Map<String, String>.class);
            }
            when else{
                return value;
            }
        }
    }

    public class ENVException extends Exception {}
}
