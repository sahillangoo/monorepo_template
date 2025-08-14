# E-commerce Monorepo

This is a full-stack e-commerce application built with Turborepo, featuring a Next.js frontend and Express.js backend.

## Project Structure

This monorepo contains:

- **`apps/client`**: Next.js frontend application (runs on port 3000)
- **`apps/server`**: Express.js backend API (runs on port 3001)
- **`packages/ui`**: Shared React components
- **`packages/eslint-config`**: Shared ESLint configuration
- **`packages/typescript-config`**: Shared TypeScript configuration

## Getting Started

### Prerequisites

- Node.js 18+
- Bun package manager
- PostgreSQL database

### Installation

```bash
# Install dependencies
bun install

# Start both client and server in development mode
bun run dev

# Or start them individually:
bun run dev:client  # Frontend on port 3000
bun run dev:server  # Backend on port 3001
```

### Available Commands

#### Root Level Commands
```bash
# Development
bun run dev              # Start both client and server
bun run dev:client       # Start only client
bun run dev:server       # Start only server

# Building
bun run build            # Build all packages and apps
bun run check-types      # Type check all packages

# Code Quality
bun run lint             # Lint all code
bun run format           # Format all code with Prettier

# Database (Server)
bun run db:generate      # Generate Prisma client
bun run db:push          # Push schema to database
bun run db:migrate       # Run database migrations
bun run db:studio        # Open Prisma Studio

# Utilities
bun run clean            # Clean all build artifacts
bun run setup            # Fresh install and build
```

#### Client App Commands
```bash
cd apps/client

bun run dev              # Start Next.js dev server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Lint code
bun run check-types      # Type check
bun run clean            # Clean build artifacts
bun run tailwind:build   # Build Tailwind CSS
```

#### Server App Commands
```bash
cd apps/server

bun run dev              # Start Hono dev server
bun run start            # Start production server
bun run lint             # Lint code
bun run db:generate      # Generate Prisma client
bun run db:push          # Push schema to database
bun run db:migrate       # Run migrations
bun run db:studio        # Open Prisma Studio
bun run db:reset         # Reset database
bun run db:seed          # Seed database with sample data
bun run clean            # Clean build artifacts
```

## Using this example

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `client`: a [Next.js](https://nextjs.org/) frontend application
- `server`: an [Express.js](https://expressjs.com/) backend API
- `@repo/ui`: a React component library shared by the client application
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
