# Mailserver setup — realvidas.io

Production mailserver for `contact@realvidas.io` using docker-mailserver + Let's Encrypt (shared with nginx).

Quick reference: [readme.md](./readme.md)

---

## Overview

```
Step 1  Prerequisites (nginx, DNS A record, ports)
   ↓
Step 2  Expand nginx certificate (mail.realvidas.io)
   ↓
Step 3  Start mailserver
   ↓
Step 4  Create mailbox + DKIM
   ↓
Step 5  DNS records (MX, SPF, DKIM, DMARC)
   ↓
Step 6  Verify TLS and sending
```

TLS is provided by the **nginx certbot volume** (`nginx_certbot_certs`) — no separate cert generation for mail.

---

## Step 1 — Prerequisites

### Server

- Docker + Docker Compose on Ubuntu
- Repo at `/app/realvidas`
- **nginx prod running** (`infra/nginx/docker-compose.prod.yaml`)
- Firewall allows ports **25**, **587**, **993**

### DNS (minimum before start)

| Type | Name (panel) | Value            |
| ---- | ------------ | ---------------- |
| A    | `mail`       | `YOUR_SERVER_IP` |

```bash
dig A mail.realvidas.io +short
```

### Working directory

```bash
cd /app/realvidas/infra/email
```

---

## Step 2 — Expand nginx certificate

Mail uses the same Let's Encrypt volume as nginx. The cert must include `mail.realvidas.io`.

**Do not** run `certbot --standalone` — port 80 is used by nginx.

### 2.1 — Ensure nginx serves ACME for mail.realvidas.io

`infra/nginx/nginx.conf` port-80 `server_name` must include `mail.realvidas.io` (already in repo).

```bash
cd /app/realvidas/infra/nginx
docker compose -f docker-compose.prod.yaml up -d
docker exec nginx nginx -t && docker exec nginx nginx -s reload
```

### 2.2 — Expand the realvidas.io certificate

```bash
docker exec certbot certbot certonly --webroot -w /var/www/certbot \
  --cert-name realvidas.io \
  --expand \
  -d realvidas.io -d www.realvidas.io -d mail.realvidas.io
```

### 2.3 — Verify SAN includes mail.realvidas.io

```bash
docker run --rm -v nginx_certbot_certs:/etc/letsencrypt:ro alpine \
  sh -c "apk add -q openssl && openssl x509 -in /etc/letsencrypt/live/realvidas.io/fullchain.pem -noout -text | grep -A1 'Subject Alternative Name'"
```

Reload nginx:

```bash
docker exec nginx nginx -s reload
```

> **Alternative:** separate cert for mail only:
> `docker exec certbot certbot certonly --webroot -w /var/www/certbot -d mail.realvidas.io`

---

## Step 3 — Start mailserver

```bash
cd /app/realvidas/infra/email
docker compose up -d
docker logs -f mailserver
```

Uses:

- `docker-compose.yaml`
- `mailserver.env` → `SSL_TYPE=letsencrypt`
- Volume `nginx_certbot_certs` → `/etc/letsencrypt` in the container

Logs must **not** show:

```
Cannot find a valid DOMAIN for '/etc/letsencrypt/live/<DOMAIN>/'
```

If you see that error, complete Step 2 first.

---

## Step 4 — Create mailbox and DKIM

On **first boot**, the container waits up to 120s for an account. Open a second terminal while logs show the countdown:

```bash
docker exec -it mailserver setup email add contact@realvidas.io YOUR_PASSWORD
```

Within ~10s startup should finish. If the container shut down, restart and add the account:

```bash
docker compose up -d
docker exec -it mailserver setup email add contact@realvidas.io YOUR_PASSWORD
```

Verify account (after full startup):

```bash
docker exec -it mailserver setup email list
```

Generate DKIM:

```bash
docker exec -it mailserver setup config dkim
docker exec -it mailserver cat /tmp/docker-mailserver/opendkim/keys/realvidas.io/mail.txt
```

Save the output — you will paste part of it into DNS in Step 5.

---

## Step 5 — DNS records

Add in your DNS panel (zone: `realvidas.io`):

| Type | Name (panel)      | Value                                               |
| ---- | ----------------- | --------------------------------------------------- |
| A    | `mail`            | `YOUR_SERVER_IP`                                    |
| MX   | `@`               | `mail.realvidas.io` (priority **10**)               |
| TXT  | `@`               | `v=spf1 mx ~all`                                    |
| TXT  | `mail._domainkey` | _(from Step 4 — see §5.1 below)_                    |
| TXT  | `_dmarc`          | `v=DMARC1; p=none; rua=mailto:contact@realvidas.io` |

### 5.1 — How to paste the DKIM record (example)

### Resumindo tirar os espaços e aspas e por tudo em duas linhas a primeira sendo v=DKIM1; h=sha256; k=rsa; e a segunda sendo o valor resto do hash

After running the `cat .../mail.txt` command, you get output like this:

```
mail._domainkey IN      TXT     ( "v=DKIM1; h=sha256; k=rsa; "
          "p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzwNWY1fGgnuRykV3theR90OPE7h10vHXYqng0nOi0MEbvNLsus4NbJNbsQDeDPAtroRqiO4EYfKd+9kI7zJw9p0lxFily6o8KMCHZof5Sj21zYsa2L86qh4BOEXItQ7gz6eUIXWQQFwKmqq7eN4NtpwJsfxmRUF4Ogliz9p7g9Gpx+KDOIDVyFhlwdXabYPR0jAeQG1+jV7FfJ"
          "kNtAM9bwYa5G6aXx1xsVDoOzHSrOTlWi8Irrz0dPx7wj+1oHev2LfZIxWB120M+GzdIJHKfGzn++hGmBDIv4D2P+B36Ty1YWr9+nJFL/sDh/3yCmpoOImfeh29InhQDpxbchteIwIDAQAB" )  ; ----- DKIM key mail for realvidas.io
```

**What each part is:**

| Part in output        | Goes in DNS panel? | Where                                   |
| --------------------- | ------------------ | --------------------------------------- |
| `mail._domainkey`     | Yes                | **Name** field → type `mail._domainkey` |
| `IN TXT`              | No                 | DNS format noise — ignore               |
| `( "..." "..." )`     | Partially          | **Value** field — see rule below        |
| `; ----- DKIM key...` | No                 | Comment — ignore                        |

**Rule for the Value field:** copy everything inside the `" "` quotes and **join into one single line** with no spaces between the parts.

From the example above, paste this as **Value**:

```
v=DKIM1; h=sha256; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzwNWY1fGgnuRykV3theR90OPE7h10vHXYqng0nOi0MEbvNLsus4NbJNbsQDeDPAtroRqiO4EYfKd+9kI7zJw9p0lxFily6o8KMCHZof5Sj21zYsa2L86qh4BOEXItQ7gz6eUIXWQQFwKmqq7eN4NtpwJsfxmRUF4Ogliz9p7g9Gpx+KDOIDVyFhlwdXabYPR0jAeQG1+jV7FfJkNtAM9bwYa5G6aXx1xsVDoOzHSrOTlWi8Irrz0dPx7wj+1oHev2LfZIxWB120M+GzdIJHKfGzn++hGmBDIv4D2P+B36Ty1YWr9+nJFL/sDh/3yCmpoOImfeh29InhQDpxbchteIwIDAQAB
```

**Step by step to build the Value from your own output:**

1. Find the line starting with `"v=DKIM1;` — copy from `v=DKIM1` through the end of that quote (before the closing `"`).
2. Find each following line that starts with `"p=` or continues the key — copy the content **inside** the quotes only.
3. Remove all `"` characters and line breaks — you must end up with **one continuous line**.
4. The line always starts with `v=DKIM1; h=sha256; k=rsa; p=` and ends with `IDAQAB` (your key will differ — use **your** output, not this example).

**Do NOT paste into Value:**

- `mail._domainkey IN TXT`
- Parentheses `( )`
- The comment `; ----- DKIM key mail for realvidas.io`

**DNS panel summary for DKIM:**

| Field | What to enter                                            |
| ----- | -------------------------------------------------------- |
| Type  | `TXT`                                                    |
| Name  | `mail._domainkey`                                        |
| Value | One line starting with `v=DKIM1; h=sha256; k=rsa; p=...` |

> Your key is unique — always use the output from **your** `mail.txt` command. The example above is only to show the format.

### 5.2 — Verify DNS propagation

```bash
dig MX realvidas.io +short
dig TXT realvidas.io +short
dig TXT mail._domainkey.realvidas.io +short
dig TXT _dmarc.realvidas.io +short
```

---

## Step 6 — Verify and test

### TLS (IMAP port 993)

```bash
openssl s_client -connect mail.realvidas.io:993 -servername mail.realvidas.io </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -dates
```

### Send test

```bash
docker exec -it mailserver postfix flush
```

Mail client settings:

| Setting | Value                              |
| ------- | ---------------------------------- |
| SMTP    | `mail.realvidas.io:587` (STARTTLS) |
| IMAP    | `mail.realvidas.io:993` (SSL/TLS)  |
| User    | `contact@realvidas.io`             |

Check headers for `spf=pass`, `dkim=pass`, `dmarc=pass`.

---

## Certificate renewals

Handled automatically by the nginx certbot sidecar (`certbot renew --webroot` every 12h).
No extra mail configuration needed.

---

## Files

| File                     | Purpose                              |
| ------------------------ | ------------------------------------ |
| `docker-compose.yaml`    | Mailserver stack                     |
| `mailserver.env`         | Environment (`SSL_TYPE=letsencrypt`) |
| `mailserver.env.example` | Template                             |

---

## Troubleshooting

### `Cannot find a valid DOMAIN for '/etc/letsencrypt/live/<DOMAIN>/'`

- Cert missing `mail.realvidas.io` → complete Step 2.
- Volume not found → `docker volume ls | grep certbot` (expect `nginx_certbot_certs`).
- Update `certbot_certs.name` in `docker-compose.yaml` if volume name differs.
- Start nginx prod at least once before mail.

### `You need at least one mail account to start Dovecot`

Add account during 120s countdown (Step 4) or restart — account persists in volume.

### `auth-userdb ... No such file or directory`

Dovecot not up yet during first-boot window — wait for full startup, retry.

### `volume not found`

```bash
docker volume ls | grep certbot
```

Ensure nginx prod created `nginx_certbot_certs`.

### Emails go to spam

- [ ] MX → `mail.realvidas.io`
- [ ] SPF on `@`
- [ ] DKIM on `mail._domainkey`
- [ ] DMARC on `_dmarc`
- [ ] PTR/reverse DNS matches `mail.realvidas.io` (ask VPS provider)

---

## Checklist

```
[ ] nginx prod running
[ ] mail.realvidas.io A record
[ ] realvidas.io cert expanded with mail.realvidas.io
[ ] docker compose up -d (no letsencrypt error in logs)
[ ] contact@realvidas.io account created
[ ] DKIM generated + DNS records added
[ ] TLS check on port 993 passes
[ ] test email delivered
```
