docker build . -t root/wedive-api &&\
docker run -p 23212:4000 -d root/wedive-api