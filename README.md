# 3pCookieTests
3p Cookie Test 

## Get started 

```
npm install & npm start
```

Access the sites via localhost:2001, localhost:2002, localhost:2003 


### to use diffent domain names locally 

`sudo vim /etc/hosts`

```
127.0.0.1 www.site11.com

127.0.0.1 www.site22.com

127.0.0.1 www.connect11.com

```

##@ Now you can access the sites via 

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

