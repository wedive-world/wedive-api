cp /wedive-secret/db-config.env ./ &&
cp /wedive-secret/s3-config.env ./ &&
cp /wedive-secret/aws-secret.env ./ &&
docker-compose build &&
docker-compose up -d &&
docker image prune -a -f