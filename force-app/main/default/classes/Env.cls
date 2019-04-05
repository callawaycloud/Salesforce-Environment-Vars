public class Env {
    private static Map<String, ENV_Var__mdt> cachedVars;

    public static Object get(String key){
        if(cachedVars == null){
            setCachedVars([SELECT DeveloperName, Datatype__c, Value__c FROM ENV_Var__mdt]);
        }
        if(cachedVars.containsKey(key)){
            return parseValue(cachedVars.get(key));
        }
        throw new ENVException('DeveloperName ' + key + ' not found exists in ENV_Var__mdt!');
    }

    @testVisible static void setCachedVars(ENV_Var__mdt[] vars){
        cachedVars = new Map<String, ENV_Var__mdt>();
        for(ENV_Var__mdt var : vars){
            cachedVars.put(var.DeveloperName, var);
        }
    }

    private static Object parseValue(ENV_Var__mdt var){
        switch on var.Datatype__c {
            when 'Integer' {
                return Integer.valueOf(var.Value__c);
            }
            when 'Decimal' {
                return Decimal.valueOf(var.Value__c);
            }
            when 'Boolean' {
                return Boolean.valueOf(var.Value__c);
            }
            when else{
                return var.Value__c;
            }
        }
    }

    public class ENVException extends Exception {}
}
