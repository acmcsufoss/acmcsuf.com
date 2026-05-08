# Cloudflare Workers Configuration

## Overview

This site is deployed using [Cloudflare Workers](https://workers.cloudflare.com/), a serverless environment that runs on Cloudflare's edge network. This is both cost effective (free!) and performant for our needs.

We're building with the official [@sveltejs/adapter-cloudflare](https://github.com/sveltejs/kit/tree/main/packages/adapter-cloudflare) adapter.

### Build Process

Using `vite build` generates the following build directory:

```
.svelte-kit/cloudflare/
└── _worker.js          # Worker entry point
```

Using `npm run preview` will use this file and run the site on the workers runtime (locally).

## Configuration

`wrangler.toml`: The main configuration file. Read the comments in that file as well as [the official docs](https://developers.cloudflare.com/workers/wrangler/configuration/) for more information.

`svelte.config.js`: This is where SvelteKit is configured to use the Cloudflare adapter.

## Deployment

The site is automatically re-deployed when PR's are merged into main, but you can also manually deploy the site or generate preview deployments with `wrangler`.

### Automatic Deployments on PR

- Creates a preview deployment (updates on new commits)
- Updates production deployment on PR merge

### Manual Deployments

#### Production

First, make sure you have:

- `.env.production` file with correct variables
- Sufficient permissions in Cloudflare account

You can then use `npm run deploy` to deploy to prod. While this is possible and works as expected, prefer auto-deployments via GitHub.

#### Previews

Since the local dev environment uses node + vite but the site runs on the workers runtime, it's important to use one or both of these after making changes. If you've created a PR, the GitHub action will create the live preview for you.

```bash
npm run preview      # runs locally on your computer
npm run preview:live # creates live preview deployment (requires correct permissions/variables)
```

View available versions (also viewable in Cloudflare dash):

```bash
wrangler versions list -e production
```

Cloudflare lets us roll back to any of these listed versions at any point.

## Environment Management

The project uses different environment files for different contexts:

- **`.env`**: Local development
- **`.env.production`**: Production values

```bash
DEBUG_FLAG_ENABLED=0             # should be 0 in production
CLOUDFLARE_ACCOUNT_ID="asdf123"  # set if you have access to multiple Cloudflare accounts
```

### Creating Additional Environments

You can create additional environments (e.g., staging) like:

1. Update `wrangler.toml`:

   ```toml
   [env.staging]
   routes = [
     { pattern = "staging.acmcsuf.com", custom_domain = true }
   ]
   workers_dev = true
   ```

2. Create `.env.staging` file with staging-specific values

3. Make sure to specify env when building/deploying:
   ```bash
   vite build --mode staging
   wrangler deploy -e staging
   ```

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [SvelteKit Cloudflare Adapter](https://kit.svelte.dev/docs/adapter-cloudflare)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Deployment Guide](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/)
