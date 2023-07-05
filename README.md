# 3pCookieTests
3p Cookie Test 

## Get started 

```
npm install & npm start
```

Access the sites via localhost:2001, localhost:2002, localhost:2003 


### to use different domain names locally 

`sudo vim /etc/hosts`

Paste the below entries 

```
127.0.0.1 www.site11.com

127.0.0.1 www.site22.com

127.0.0.1 www.connect11.com

```

### Now you can access the sites via 

www.site11.com:2001

www.site22.com:2002

www.connect11.com:2003

### For certs 

install homebrew 

`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

and then run the below commands 

```
brew install mkcert
mkcert -install
mkcert  www.site11.com www.site22.com www.connect11.com
```


### Testing Message channel 


Once you open the popup with the SSO URL, let the flow complete and the inspect the element and post the following 


```
 var ports;

window.addEventListener("message", (data)=>{

     if(data.origin !== "https://www.connect11.com:2003"){return false}; 
    
     ports = data.ports[0];
     ports?.postMessage({type: "handshake"});

     fetch("/connect/auth/authorize", {credential: "include"}).then(data => data.json()).then(data => ports.postMessage({type:"token", response: data}))
 });

```


### Testing token based + PKCE

- As soon as you start the server you will see please login alert and this would show up LOgin link on the parent window 

- Click on the same to get logged in
- Notice that there are auth code requets triggering from the embedded connect11.com website along  with code challenge being set

#### PkCE

- simplest method to mitigate the CSRF, replay attacks 
- You generate a hash of some random string and you send the hash first and later request the Auth token by passing the random string you used to create the hash. Backend does the same hashning on the input and compares the original hash. if match then responds back with the data and removes the entry from DB 


### to test the first party sets use the below command to open chrome with specific flags set 

```
 open -a "Google chrome" --args --enable-features="FirstPartySets:FirstPartySetsClearSiteDataOnChangedSets/1,StorageAccessAPI,StorageAccessAPIForOriginExtension,PageInfoCookiesSubpage,PrivacySandboxFirstPartySetsUI" \ --use-first-party-set="{\"primary\": \"https://www.site11.com\", \"associatedSites\": [\"https://www.site22.com\", \"https://www.connect11.com\"]}" https://www.site11.com:2001
```

