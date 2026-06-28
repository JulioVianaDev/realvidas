# 1. First time setup — start HTTP only

docker compose -f docker-compose.setup.yaml up -d nginx

# 2. Issue certs

docker compose -f docker-compose.setup.yaml run --rm certbot \
 certonly --webroot -w /var/www/certbot \
 -d juliovianadev.com -d www.juliovianadev.com -d webhook.juliovianadev.com \
 --email your@email.com --agree-tos --non-interactive

docker compose -f docker-compose.setup.yaml run --rm certbot \
 certonly --webroot -w /var/www/certbot \
 -d realvidas.io -d www.realvidas.io \
 --email your@email.com --agree-tos --non-interactive

# 3. Tear down setup

docker compose -f docker-compose.setup.yaml down

# 4. Start production (uses same volumes, certs are already there)

docker compose -f docker-compose.prod.yaml up -d
