# Deploy diaspora on DigitalOcean App Platform

This is its own DO App — a separate deploy from POL263, under the same DO
account/API token, so both are manageable with the same `doctl` access. See
`docs/POL263-INTEGRATION.md` for how this site talks to POL263 at runtime (it
runs on local fallback content if the POL263 env vars are left unset, so it's
safe to deploy before the DFS tenant is fully provisioned there).

## Prerequisites

- The repo pushed to GitHub (`codeguru2025/diaspora`, already the case)
- A DigitalOcean account with billing enabled
- `doctl` installed and authenticated, if deploying via the API/CLI rather
  than the dashboard: <https://docs.digitalocean.com/reference/doctl/how-to/install/>
  ```bash
  doctl auth init   # paste your DO API token when prompted
  ```

## 1. Create the app

**Via the API/CLI** (uses `.do/app.yaml` in this repo):

```bash
doctl apps create --spec .do/app.yaml
```

**Via the dashboard**, if you'd rather click through it:

1. DigitalOcean → **Apps** → **Create App**
2. Source: **GitHub** → select `codeguru2025/diaspora`, branch `main`
3. Resource type: **Web Service**
4. Build Command: `npm ci --include=dev && npm run build`
5. Run Command: `npm start`
6. HTTP Port: `3000`

Either way, DigitalOcean auto-detects Next.js via the Node.js buildpack — no
Dockerfile needed.

## 2. Environment variables

Set these in **Settings → App-Level Environment Variables** (the committed
`.do/app.yaml` has them as placeholders — never put real values in the repo):

| Variable | Required now? | Notes |
|---|---|---|
| `NODE_ENV` | Yes | `production` |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://diasporafunerals.com` — used for canonical URLs, sitemap, JSON-LD |
| `POL263_API_BASE_URL` | No | Leave unset until the DFS tenant is provisioned in POL263 — site runs on local fallback content until then |
| `POL263_ORG_ID` | No | Same as above |
| `POL263_PUBLIC_REF` | No | Same as above — required once you connect the live quote engine |
| `POL263_API_TOKEN` | No | If POL263 provisions a server-to-server token |
| `NEXT_PUBLIC_POL263_PORTAL_URL` | No | The `/client` portal URL on the DFS domain, once known |
| `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Consent-gated analytics — leave both blank for no analytics banner at all |

## 3. Custom domain — diasporafunerals.com

1. App → **Settings** → **Domains** → add `diasporafunerals.com` (and
   `www.diasporafunerals.com` if you want both to resolve — already declared
   in `.do/app.yaml`)
2. DigitalOcean shows the DNS records to add at your registrar/DNS provider:
   - If DO manages the DNS zone: it configures the records automatically once
     you point the domain's nameservers at DO
   - If DNS stays elsewhere (e.g. the registrar, Cloudflare): add the **A**
     record(s) DO shows you for the apex domain, and a **CNAME** for `www` →
     the app's `*.ondigitalocean.app` hostname
3. DO issues a free TLS certificate automatically once the DNS record resolves
   — this can take a few minutes to a few hours depending on DNS propagation
4. Once the domain is live, update `NEXT_PUBLIC_SITE_URL` to match exactly
   (`https://diasporafunerals.com`, no trailing slash) and redeploy — this
   affects the sitemap and canonical URLs, so it's worth getting right before
   the first real crawl

## 4. Updates

Since `deploy_on_push: true` is set in `.do/app.yaml`, every push to `main`
triggers a new build/deploy automatically. No separate release branch or CI
step is needed here (unlike POL263, which regenerates its lockfile on a
`deploy` branch — this repo's dependency tree doesn't have that problem today,
see the gotcha below if that changes).

## Known gotchas (hit on POL263, worth knowing before they bite here too)

- **`npm ci` skipping devDependencies.** If App Platform's install step ever
  runs in a production-only mode, `typescript` and `@tailwindcss/postcss`
  (both devDependencies, both required for `next build`) won't install and
  the build fails with a module-not-found error. The build command above
  already uses `npm ci --include=dev` to force this — don't drop that flag.
- **Lockfile platform mismatches.** `package-lock.json` in this repo was
  generated on Windows. npm's lockfile format is platform-agnostic (it
  records every optional-dependency platform variant and `npm ci` filters at
  install time), so this *should* be fine on DO's Linux build image — but if
  a build ever fails with something like "Missing: @next/swc-linux-x64-gnu
  from lock file", regenerate `package-lock.json` on Linux (a throwaway
  GitHub Actions step, or WSL) and commit it, the same fix POL263 uses via
  its `deploy` branch.
