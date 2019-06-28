@namespaceAccessible
public class EncryptHelper implements Callable {
    private static final string KEY_NAME = 'AESKEY';
    private static final string ALG = 'AES256';
    private static Blob cryptoKey;
    @namespaceAccessible
    public EncryptHelper(){
        Secret__c keySetting = Secret__c.getInstance(KEY_NAME);
        if(keySetting == null){
            keySetting = new Secret__c(
                Name = KEY_NAME,
                Value__c = EncodingUtil.base64Encode(Crypto.generateAesKey(256))
            );
            insert keySetting;
        }
        cryptoKey = EncodingUtil.base64Decode(keySetting.Value__c);
    }

   // Dispatch actual methods
   @namespaceAccessible
   public Object call(String action, Map<String, Object> args) {
     switch on action {
       when 'encrypt' {
         return this.encrypt((String)args.get('val'));
       }
       when 'decrypt' {
         return this.decrypt((string)args.get('val'));
       }
       when else {
        throw new ExtensionMalformedCallException('Method not implemented');
       }
     }
   }

    private String encrypt(String s){
        Blob data = Blob.valueOf(s);
        Blob encryptedData = Crypto.encryptWithManagedIV(ALG, cryptoKey, data);
        return EncodingUtil.base64Encode(encryptedData);
    }
    
    private string decrypt(string b64Data){
        Blob encryptedData = EncodingUtil.base64Decode(b64Data);
        Blob decryptedData = Crypto.decryptWithManagedIV(ALG, cryptoKey, encryptedData);
        return decryptedData.toString();
    }

    public class ExtensionMalformedCallException extends Exception {}
  }
