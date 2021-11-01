// Author: Charles Jonas (charlie@callaway.cloud)
@isTest
global class ENVTests {
    
    global static void setCachedVars(ENV__mdt[] vars) {
        Env.setCachedVars(vars);
    }

    global static void addCachedVar(ENV__mdt var) {
        Env.addCachedVar(var);
    }

    global static void addCachedVars(ENV__mdt[] vars) {
        Env.addCachedVars(vars);
    }
    
    @isTest
    static void testString() {
        String key = 'abc';
        String value = '123';
        ENV__mdt var = new ENV__mdt(DeveloperName = key, Value__c = value);

        Env.setCachedVars(new List<ENV__mdt>{ var });
        String retValue = (String) Env.get(key);

        System.assertEquals(value, retValue, 'Values Should Match');
    }

    @isTest
    static void testStringTransform() {
        String key = 'abc';
        String value = 'XYZ';
        ENV__mdt var = new ENV__mdt(DeveloperName = key, Value__c = value);

        Env.setCachedVars(new List<ENV__mdt>{ var });
        String retValue = (String) Env.get(key, Env.Transform.TO_LOWER);

        System.assertEquals(value.toLowerCase(), retValue, 'Values Should Match');
    }

    @isTest
    static void testNumbers() {
        String key1 = 'var1';
        Integer value1 = 123;
        ENV__mdt var1 = new ENV__mdt(DeveloperName = key1, Value__c = String.valueof(value1), DataType__c = 'Integer');

        String key2 = 'var2';
        Decimal value2 = 123.99;
        ENV__mdt var2 = new ENV__mdt(DeveloperName = key2, Value__c = String.valueof(value2), DataType__c = 'Decimal');

        Env.setCachedVars(new List<ENV__mdt>{ var1, var2 });

        Integer retValue1 = (Integer) Env.get(key1);
        System.assertEquals(value1, retValue1, 'Values Should Match');

        Decimal retValue2 = (Decimal) Env.get(key2);
        System.assertEquals(value2, retValue2, 'Values Should Match');
    }

    @isTest
    static void testBoolean() {
        String key = 'abc';
        Boolean value = true;
        ENV__mdt var = new ENV__mdt(DeveloperName = key, Value__c = String.valueOf(value), DataType__c = 'Boolean');

        Env.setCachedVars(new List<ENV__mdt>{ var });
        Boolean retValue = (Boolean) Env.get(key);

        System.assertEquals(value, retValue, 'Values Should Match');
    }

    @isTest
    static void testStringArr() {
        String key = 'abc';
        String[] value = new List<String>{ '1,', '2;', '[asd]|' };
        ENV__mdt var = new ENV__mdt(DeveloperName = key, Value__c = JSON.serialize(value), DataType__c = 'String[]');

        Env.setCachedVars(new List<ENV__mdt>{ var });
        String[] retValue = (String[]) Env.get(key);

        System.assertEquals(value, retValue, 'Values Should Match');
    }

    @isTest
    static void testStringArrTransform() {
        String key = 'abc';
        String[] value = new List<String>{ 'a' };
        ENV__mdt var = new ENV__mdt(DeveloperName = key, Value__c = JSON.serialize(value), DataType__c = 'String[]');

        Env.setCachedVars(new List<ENV__mdt>{ var });
        String[] retValue = (String[]) Env.get(key, Env.Transform.TO_UPPER);

        System.assertEquals('A', retValue[0], 'Values Should Match');
    }

    @isTest
    static void testStringMap() {
        String key = 'abc';
        Map<string, string> value = new Map<string, string>{ '123' => 'abc', '456' => 'xyz' };
        ENV__mdt var = new ENV__mdt(
            DeveloperName = key,
            Value__c = JSON.serialize(value),
            DataType__c = 'Map<String,String>'
        );

        Env.setCachedVars(new List<ENV__mdt>{ var });
        Map<String, String> retValue = (Map<String, String>) Env.get(key);

        System.assertEquals(value, retValue, 'Values Should Match');
    }

    @isTest
    static void testAnyJson() {
        String key = 'abc';
        Foo value = new Foo();
        value.bar = 1;
        value.foo = 'abc123';

        ENV__mdt var = new ENV__mdt(
            DeveloperName = key,
            Value__c = JSON.serialize(value),
            DataType__c = 'ANY'
        );

        Env.setCachedVars(new List<ENV__mdt>{ var });
        
        Map<String, Object> retMapValue = (Map<String, Object>) Env.get(key);
        System.assertEquals(value.foo, retMapValue.get('foo'), 'Values Should Match');

        Foo foo =  (Foo) ENV.get(key, Foo.class);
        System.assertEquals(value.bar, foo.bar, 'Values Should Match');
    }

    private class Foo {
        public Decimal bar;
        public String foo;
    }
}
