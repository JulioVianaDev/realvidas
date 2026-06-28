```
docker run --rm \
  -v certbot_certs:/etc/letsencrypt \
  -v certbot_www:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  -d juliovianadev.com -d www.juliovianadev.com \
  --email your@email.com --agree-tos --no-eff-email
```

```
docker run --rm \
  -v certbot_certs:/etc/letsencrypt \
  -v certbot_www:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  -d realvidas.io -d www.realvidas.io \
  --email your@email.com --agree-tos --no-eff-email
```
