// Author: Charles Jonas (charlie@callaway.cloud)
@isTest
public class ENVTests {

    @isTest static void testString(){
        String key = 'abc';
        String value = '123';
        ENV_Var__mdt var = new ENV_Var__mdt(
            DeveloperName = key,
            Value__c = value
        );

        Env.setCachedVars(new ENV_Var__mdt[]{var});
        String retValue = (String) Env.get(key);

        System.assertEquals(value, retValue, 'Values Should Match');
    }

    @isTest static void testNumbers(){
        String key1 = 'var1';
        Integer value1 = 123;
        ENV_Var__mdt var1 = new ENV_Var__mdt(
            DeveloperName = key1,
            Value__c = String.valueof(value1),
            DataType__c = 'Integer'
        );

        String key2 = 'var2';
        Decimal value2 = 123.99;
        ENV_Var__mdt var2 = new ENV_Var__mdt(
            DeveloperName = key2,
            Value__c = String.valueof(value2),
            DataType__c = 'Decimal'
        );

        Env.setCachedVars(new ENV_Var__mdt[]{var1, var2});

        Integer retValue1 = (Integer) Env.get(key1);
        System.assertEquals(value1, retValue1, 'Values Should Match');

        Decimal retValue2 = (Decimal) Env.get(key2);
        System.assertEquals(value2, retValue2, 'Values Should Match');
    }

    @isTest static void testBoolean(){
        String key = 'abc';
        Boolean value = true;
        ENV_Var__mdt var = new ENV_Var__mdt(
            DeveloperName = key,
            Value__c = String.valueOf(value),
            DataType__c = 'Boolean'
        );

        Env.setCachedVars(new ENV_Var__mdt[]{var});
        Boolean retValue = (Boolean) Env.get(key);

        System.assertEquals(value, retValue, 'Values Should Match');
    }


    @isTest static void testStringArr(){
        String key = 'abc';
        String[] value = new String[] {'1,','2;','[asd]|'};
        ENV_Var__mdt var = new ENV_Var__mdt(
            DeveloperName = key,
            Value__c = JSON.serialize(value),
            DataType__c = 'String[]'
        );

        Env.setCachedVars(new ENV_Var__mdt[]{var});
        String[] retValue = (String[]) Env.get(key);

        System.assertEquals(value, retValue, 'Values Should Match');
    }

    @isTest static void testStringMap(){
        String key = 'abc';
        Map<string,string> value = new Map<string,string> {'123'=>'abc', '456' => 'xyz'};
        ENV_Var__mdt var = new ENV_Var__mdt(
            DeveloperName = key,
            Value__c = JSON.serialize(value),
            DataType__c = 'Map<String,String>'
        );

        Env.setCachedVars(new ENV_Var__mdt[]{var});
        Map<String,String> retValue = (Map<String,String>) Env.get(key);

        System.assertEquals(value, retValue, 'Values Should Match');
    }
}
