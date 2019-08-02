// Author: Charles Jonas (charlie@callaway.cloud)
// v1.0 see: https://github.com/ChuckJonas/Salesforce-Environment-Vars
global class Env {

    global Enum Transform{
        TO_LOWER,
        TO_UPPER
    }

    private static Map<String, ENV__mdt> cachedVars;

    global static Object get(String key){
       return get(key, null);
    }

    global static Object get(String key, Transform trans){
        if(cachedVars == null){
            setCachedVars([SELECT DeveloperName, Datatype__c, Value__c, Secret__c FROM ENV__mdt]);
        }
        
        if(cachedVars.containsKey(key)){
            return parseValue(cachedVars.get(key), trans);
        }
        throw new ENVException('DeveloperName ' + key + ' not found exists in ENV__mdt!');
    }

    @testVisible static void setCachedVars(ENV__mdt[] vars){
        cachedVars = new Map<String, ENV__mdt>();
        for(ENV__mdt var : vars){
            cachedVars.put(var.DeveloperName, var);
        }
    }

    private static Object parseValue(ENV__mdt var, Transform trans){
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
                return JSON.Deserialize(transformString(var.Value__c, trans), List<String>.class);
            }
            when 'Map<String,String>' {
                return JSON.Deserialize(transformString(var.Value__c, trans), Map<String, String>.class);
            }
            when else{
                return transformString(var.Value__c, trans);
            }
        }
    }

    private static String transformString(String val, Transform trans){
        switch on  trans {
            when TO_UPPER{
                return val.toUpperCase();
            }
            when TO_LOWER {
                return val.toLowerCase();
            } 
            when else {
                return val;
            }
        }
    }

    public class ENVException extends Exception {}
}
