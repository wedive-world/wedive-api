cp ../wedive-secret/api-config.env ./ &&
cp ../wedive-secret/api-secret.env ./ &&
docker-compose build &&
docker-compose up -d &&
docker image prune -a -f