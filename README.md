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


### to test the first party sets use the below command to open chrome with specific flags set 

```
 open -a "Google chrome" --args --enable-features="FirstPartySets:FirstPartySetsClearSiteDataOnChangedSets/1,StorageAccessAPI,StorageAccessAPIForOriginExtension,PageInfoCookiesSubpage,PrivacySandboxFirstPartySetsUI" \ --use-first-party-set="{\"primary\": \"https://www.site11.com\", \"associatedSites\": [\"https://www.site22.com\", \"https://www.connect11.com\"]}" https://www.site11.com:2001
```

