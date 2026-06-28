# Mailserver — quick reference

Full guide: **[setup.md](./setup.md)**

```bash
cd /app/realvidas/infra/email
docker compose up -d
docker exec -it mailserver setup email add contact@realvidas.io tomate123
docker exec -it mailserver setup config dkim
docker exec -it mailserver cat /tmp/docker-mailserver/opendkim/keys/realvidas.io/mail.txt
```

TLS comes from the nginx certbot volume (`nginx_certbot_certs`). Requires nginx prod running with `mail.realvidas.io` in the certificate.
