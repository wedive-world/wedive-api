# wedive-api
## How to build and run
```
sudo docker-compose up -d
```

## Docker Install [Link][docker-install-link]
[docker-install-link]: https://subicura.com/2017/01/19/docker-guide-for-beginners-2.html
```
curl -fsSL https://get.docker.com/ | sudo sh
```


## Docker Compose Install (Ubuntu) [Link][docker-compose-install-link]
[docker-compose-install-link]: https://docs.docker.com/compose/install/

1. Run this command to download the current stable release of Docker Compose:
```
 sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

2. Apply executable permissions to the binary:
```
sudo chmod +x /usr/local/bin/docker-compose
```

3.Create soft link to bin
```
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
