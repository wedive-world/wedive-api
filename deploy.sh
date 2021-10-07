cp /wedive-secret/api-config.env ./wedive-secret/ &&
cp /wedive-secret/api-secret.env ./wedive-secret/ &&
docker-compose build &&
docker-compose up -d &&
docker image prune -a -f