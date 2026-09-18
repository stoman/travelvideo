# Infrastructure

## Existing CI/CD — adapt, do not rebuild

### `.github/workflows/test.yml` and `lint.yml`

Both trigger on `pull_request` and pushes to `main`. Node 24, `npm ci` with cache, then
`npm test` / `npm run lint`. **Keep the workflows; repoint the scripts** — see
[testing.md](testing.md).

### `.github/workflows/deploy.yml`

Triggers on push to `main` and manual dispatch. Two jobs:

1. **build** — buildx, log in to `registry.stoman.de`, build and push
   `registry.stoman.de/travel:latest`.
2. **deploy** — `appleboy/ssh-action` into the server, then `cd travel/ && sudo docker compose
   pull && sudo docker compose down && sudo docker compose up -d --remove-orphans`.

It already pushes **only the `latest` tag** — no SHA tags, deliberately, to keep registry disk
use down. Rollback is therefore "revert the commit and let CI rebuild" rather than an image
swap; that tradeoff is accepted.

Secrets already configured: `REGISTRY_USERNAME`, `REGISTRY_PASSWORD`, `SSH_HOST`,
`SSH_USERNAME`, `SSH_KEY`, `SSH_PASSPHRASE`.

Changes needed: `deploy` should gain `needs` on the test job so a failing test blocks a
deploy, and the build job should be guarded to `main` pushes only.

## Registry garbage collection

Overwriting `latest` does **not** free space — the previous image's blobs simply become
untagged. A stock `registry:2` needs `REGISTRY_STORAGE_DELETE_ENABLED=true` and a periodic
`registry garbage-collect --delete-untagged`, or the registry grows indefinitely despite only
ever holding one tag. This matters on a 22 GB disk.

This is server-side work requiring SSH access and is tracked separately from the rewrite.

## Docker

The current `Dockerfile` is already sound — multi-stage, non-root `daemon` user, `.dockerignore`
present. Adapt it:

```dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build          # vite build

FROM httpd:alpine
COPY ./docker-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=builder /app/dist/ /usr/local/apache2/htdocs/
COPY --from=builder /app/dist/.htaccess /usr/local/apache2/htdocs/
RUN chown -R daemon:daemon /usr/local/apache2/htdocs/ \
 && chown daemon:daemon /usr/local/apache2/conf/httpd.conf \
 && chown -R daemon:daemon /usr/local/apache2/logs/
USER daemon
```

The builder base changes from `danlynn/ember-cli` to plain `node:alpine` — one less
third-party image. The explicit `.htaccess` copy is retained because dotfiles are easy to lose
in a `dist/` copy.

## Apache — two real fixes

Both are live defects worth shipping immediately, independently of the rewrite.

### Nothing is compressed

`docker-httpd.conf` is the stock httpd:alpine config with only `AllowOverride All` changed, so
`mod_deflate` (line 121) and `mod_brotli` (line 124) are commented out — production returns no
`Content-Encoding` for any asset. Uncomment the modules and add an `AddOutputFilterByType`
block. For the rewrite this is the difference between a ~60 KB and ~15 KB data payload.

### No cache headers

`mod_expires` (line 135) is also commented out and production returns no `Cache-Control`.
`mod_headers` **is** loaded, so `.htaccess` can do the work:

```apache
FallbackResource /index.html

<FilesMatch "\.(mp4|webm|webp|jpg|png|svg|woff2)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
<FilesMatch "^index\.html$">
  Header set Cache-Control "no-cache"
</FilesMatch>
```

Vite emits content-hashed JS/CSS filenames, so those can be `immutable` too while
`index.html` stays revalidated — repeat visits then download almost nothing but video.

`FallbackResource /index.html` must stay; it is what makes the SPA's URLs work.

### Minor hardening

`Options Indexes` is enabled on the whole document root, so directory listings are publicly
browsable. Turn it off.

## Video file storage — in the repo

Decided: the ~160 MB video archive is **committed to git** at `public/assets/videos/max/`.
Remove `public/assets/videos` from `.gitignore`.

Vite copies `public/` to `dist/` verbatim, and the Dockerfile already copies `dist/` into the
image — so the videos travel with the image and no volume mount, rsync or separate sync step
is needed. The deployed container is fully self-contained.

Two consequences worth planning for:

- **The image grows by ~160 MB.** Layer caching means this only re-pushes when the videos
  actually change (roughly once a year, when a trip is added), so routine code deploys stay
  cheap. First pull on a fresh server will be slower.
- **Committing binaries is irreversible.** Any future re-encode permanently adds its full size
  to history. See [video.md](video.md).

## Analytics

**Keep GA4** (`G-V757JDJL11`), already migrated and working. Replace `ember-metrics` with a
~20-line wrapper: a page view on route change, plus the events the current app sends
(video play/pause/end, trip start/end, map movement).

Note the German GDPR/TTDSG consent obligation that GA4 carries. Stefan accepted this
knowingly; a self-hosted Umami or Plausible would avoid the banner if he reconsiders.

## Dead configuration to remove

`config/environment.js` carries `disqus: { shortname: 'travelstoman' }`. Nothing references
it. Delete it along with the about-page copy that invites comments.
