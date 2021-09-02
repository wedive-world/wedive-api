docker build . -t root/wedive-api &&\
docker stop root/wedive-api || true &&
docker rm root/wedive-api || true &&
docker run -p 4001:4000 -d root/wedive-api