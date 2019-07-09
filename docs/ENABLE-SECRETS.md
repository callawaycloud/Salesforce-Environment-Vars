# Enabling "Secret" Value support

*WARNING: While these values are stored encrypted, anyone with the ability to execute APEX will be able to retrieve and view them. Be careful not to leak them in logs!*

## Install

To enable secrets, we just need to install the `vars-encrypt` managed package.

- `sfdx force:package:install --package 04t1C000000tfE1QAI -u your@org.user`

Once installed, you'll notice that the UI now shows "Secrets Enabled"

<img width="1650" alt="Salesforce_-_Unlimited_Edition" src="https://user-images.githubusercontent.com/5217568/60910274-8fc0e900-a23d-11e9-9133-edaf050e33ef.png">

## Usage

When creating a new env-var, you can mark it as secret BEFORE you save. 

<img width="1342" alt="Salesforce_-_Unlimited_Edition" src="https://user-images.githubusercontent.com/5217568/60910786-f4c90e80-a23e-11e9-9806-6bf47a2a8f07.png">

### Considerations

- Secret vars values cannot be changed.  To change the secret you must delete and readd the var
- A Var cannot be made secret after it is created
- Secret vars can only be read by Apex.  They will not work in formulas, or via the API.


## How it works

This package works by creating private AES key and storing it in a "Managed Protected Custom Settings" (as outlined by [salesforce best practices](https://trailhead.salesforce.com/content/learn/modules/secure-secret-storage/learn-about-platform-secret-protection)).  When a "env-var" is saved as "secreted", we encrypt it using this key before we store it. It will then be decrypted automatically to `VARS.Env.get()`.  


