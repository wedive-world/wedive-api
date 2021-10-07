cp /wedive-secret/db-config.env ./wedive-secret/ &&
cp /wedive-secret/s3-config.env ./wedive-secret/ &&
cp /wedive-secret/aws-secret.env ./wedive-secret/ &&
docker-compose build &&
docker-compose up -d &&
docker image prune -a -f