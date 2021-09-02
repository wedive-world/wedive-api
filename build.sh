docker build . -t root/wedive-api &&\
docker stop wedive-api || true &&
docker rm wedive-api || true &&
docker run -p 4001:4000 -d  --name wedive-api --rm root/wedive-api