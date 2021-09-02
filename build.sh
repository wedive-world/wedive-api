docker build . -t root/wedive-api &&\
docker stop wedive-api || true &&
docker rm wedive-api || true &&
docker run -p 4001:4000 -d root/wedive-api