# Hygraph Cloudflare Workers - Public Repository

## Notice

This is a public sanitized version of a private project. All sensitive information (API keys, tokens, account IDs, domain names) has been replaced with placeholders. This repository is intended for educational and reference purposes.

## Setup Instructions

Before using this project, you'll need to:

1. **Replace all placeholders** with your actual values:
   - `your-worker-name` in `wrangler.toml`
   - Update the `.env.example` file with your actual values

2. **Configure your Hygraph CMS**:
   - Set up your Hygraph endpoint URL
   - Generate authentication tokens
   - Update the environment variables accordingly

3. **Set up GitHub Secrets** (if using GitHub Actions):
   - `CLOUDFLARE_API_TOKEN`
   - `HYGRAPH_ENDPOINT`
   - `HYGRAPH_TOKEN`

## Original Project Features

A serverless implementation for fetching blog data from Hygraph CMS using Cloudflare Workers, built with TypeScript and following SOLID principles.

## Why Migrate from Azure Functions?

This project represents a cost-optimization migration from Azure Functions to Cloudflare Workers, driven by several key factors:

### Cost Analysis

- **Azure Functions**: While execution is free under 1M requests/month, hidden storage costs emerge:
  - Application Insights storage: ~$1-5/month for log retention
  - Function storage account: Additional charges for diagnostics and telemetry
  - Even minimal logging accumulates storage costs over time

- **Cloudflare Workers**: True zero-cost operation:
  - 100,000 requests/day completely free
  - No storage charges for logs or telemetry
  - No hidden infrastructure costs

### Performance Benefits

- **Global Edge Network**: Deploy to 200+ locations worldwide vs single Azure region
- **0ms Cold Starts**: V8 isolates vs traditional container cold starts (100-1000ms)
- **Lower Latency**: Code runs closer to users globally

### Operational Advantages

- **Simplified Architecture**: No storage account dependencies
- **Better Developer Experience**: Wrangler CLI vs Azure Functions Core Tools
- **Predictable Pricing**: No surprise bills from log aggregation

### Migration Validation

The original Azure Functions implementation was optimized to minimize storage costs by:

```typescript
// Removed success logging to reduce Application Insights charges
// Only log errors to minimize costs - no success logging
return articles;
```

This optimization strategy led to the realization that **Cloudflare Workers eliminates the need for such compromises** entirely.

### Real-World Cost Comparison

| Aspect | Azure Functions | Cloudflare Workers |
|--------|----------------|-------------------|
| **Execution** | Free (1M requests/month) | Free (100K requests/day) |
| **Storage** | ~$1-5/month (logs/telemetry) | $0 |
| **Cold Starts** | 100-1000ms | 0ms |
| **Global Reach** | Single region | 200+ edge locations |
| **Monthly Cost** | $1-5+ | $0 |

**Migration Result**: Eliminated monthly storage costs while improving performance and global reach.

## Features

- **Clean Architecture**: Implements SOLID principles with clear separation of concerns
- **TypeScript**: Full type safety with strict configuration
- **Cloudflare Workers**: Serverless edge computing with global distribution
- **Hygraph Integration**: Seamless CMS data fetching via GraphQL
- **CI/CD Ready**: GitHub Actions for automated deployment

## Architecture

```
src/
├── domain/           # Business models and interfaces
├── application/      # Use cases and business logic
├── infrastructure/   # External service implementations
├── shared/          # Common utilities and helpers
└── index.ts         # Worker entry point
```

## API Endpoints

- `GET /articles` - Fetch all articles
- `GET /articles/{slug}` - Fetch article by slug
- `GET /recent` - Fetch recent articles

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy

# Run tests
npm test

# Lint code
npm run lint
```

## Environment Setup

Authenticate Wrangler with your Cloudflare account (required for secret management and deployment):

```bash
wrangler login
```

Configure these secrets using Wrangler:

```bash
wrangler secret put HYGRAPH_ENDPOINT
wrangler secret put HYGRAPH_TOKEN
```

### Cloudflare Secret Length Issue & Solution

**Problem:**
When trying to set the Hygraph token as a secret using `wrangler secret put HYGRAPH_TOKEN`, Cloudflare CLI returned an error about the secret being too long. This is a common issue when using long JWTs or API keys as secrets in Cloudflare Workers.

**Resolution & Commands Used:**

1. Standard Wrangler secret command (in any shell):

  ```powershell
  wrangler secret put HYGRAPH_TOKEN
  ```

2. If you get a length error, try these steps:

- **PowerShell:**

    ```powershell
    wrangler secret put HYGRAPH_TOKEN
    # Paste the token directly, press Enter, then Ctrl+Z and Enter to end input
    ```

- **Git Bash or Command Prompt:**

    ```bash
    wrangler secret put HYGRAPH_TOKEN
    # Paste the token, press Enter, then Ctrl+D (Git Bash) or Ctrl+Z (Cmd) to end input
    ```

3. If the error persists, check for hidden characters or try a different terminal.

4. (Optional) Debug by logging the secret length in your Worker:

  ```typescript
  // For debugging only, remove after verifying
  console.log("HYGRAPH_TOKEN length:", env.HYGRAPH_TOKEN.length);
  ```

**Tip:**
If you hit a length error, always check for hidden characters, try a different terminal, and ensure you're not exceeding the 4 KB limit. For very large secrets, consider splitting or rotating tokens if possible.

After resolving, the secret was successfully set and the Worker could authenticate with Hygraph.

## Migration from Azure Functions

This project is a direct migration from Azure Functions, maintaining the same:

- API endpoints and contracts
- Business logic and use cases
- Domain models and validation
- Error handling patterns

## License

MIT
