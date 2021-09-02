docker build . -t root/wedive-api &&\
docker run -p 4001:4000 -d root/wedive-api