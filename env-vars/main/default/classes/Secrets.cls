@RestResource(urlMapping='/secrets')
global class Secrets {
    private static String ENCRYPTION_CLASS = 'EncryptHelper';
    private static String ENCRYPT_METHOD = 'encrypt';
    private static String DECRYPT_METHOD = 'decrypt';
    private static String PARAM = 'val';

    @InvocableMethod(label='Create' description='Encrpyts a string')
    global static string[] invoke(string[] secrets) {
        String[] out = new List<String>{};
        for (String secret : secrets) {
            out.add(create(secret));
        }
        return out;
    }

    public static boolean enabled() {
        return Type.forName(ENCRYPTION_CLASS) != null;
    }

    global static String create(String secret) {
        Callable extension = (Callable) Type.forName(ENCRYPTION_CLASS).newInstance();
        return (String) extension.call(ENCRYPT_METHOD, new Map<String, Object>{ PARAM => secret });
    }

    public static String read(String secret) {
        Callable extension = (Callable) Type.forName(ENCRYPTION_CLASS).newInstance();
        return (String) extension.call(DECRYPT_METHOD, new Map<String, Object>{ PARAM => secret });
    }
}
