// Author: Charles Jonas (charlie@callaway.cloud)
// v1.0 see: https://github.com/ChuckJonas/Salesforce-Environment-Vars
global class Env {
  global enum Transform {
    TO_LOWER,
    TO_UPPER,
    NONE
  }

  private static Map<String, ENV__mdt> cachedVars;

  global static Object get(String key, Type classType) {
    return JSON.deserialize(retrieveVar(key).Value__c, classType);
  }

  global static Object get(String key) {
    return get(key, Transform.NONE);
  }

  global static Object get(String key, Transform trans) {
    return parseValue(retrieveVar(key), trans);
  }

  private static ENV__mdt retrieveVar(String key) {
    if (cachedVars == null) {
      setCachedVars([SELECT DeveloperName, Datatype__c, Value__c, Secret__c FROM ENV__mdt]);
    }

    if (cachedVars.containsKey(key)) {
      return cachedVars.get(key);
    }
    throw new ENVException('DeveloperName ' + key + ' not found exists in ENV__mdt!');
  }

  @testVisible
  static void setCachedVars(ENV__mdt[] vars) {
    cachedVars = new Map<String, ENV__mdt>();
    addCachedVars(vars);
  }

  @testVisible
  static void addCachedVar(ENV__mdt var) {
    addCachedVars(new List<ENV__mdt>{var});
  }

  @testVisible
  static void addCachedVars(ENV__mdt[] vars) {
    if (cachedVars == null) {
      cachedVars = new Map<String, ENV__mdt>();
    }
    for (ENV__mdt var : vars) {
      cachedVars.put(var.DeveloperName, var);
    }
  }

  private static Object parseValue(ENV__mdt var, Transform trans) {
    String value = var.Value__c;

    //decrypt
    if (var.Secret__c && Secrets.enabled()) {
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
        return JSON.deserialize(transformString(value, trans), List<String>.class);
      }
      when 'Map<String,String>' {
        return JSON.deserialize(transformString(value, trans), Map<String, String>.class);
      }
      when 'ANY' {
        return JSON.deserializeUntyped(transformString(value, trans));
      }
      when else {
        return transformString(value, trans);
      }
    }
  }

  private static String transformString(String val, Transform trans) {
    switch on trans {
      when TO_UPPER {
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

  public class ENVException extends Exception {
  }
}
