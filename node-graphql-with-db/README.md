# `node-graphql-with-db`

NodeJS Server with

- GraphQL server with subscriptions
- ExpressJS for basic Rest/JSON endpoints
- DrizzleORM for ORM
- Type safe environment config with zod
- E2E test suite with real server, db and fetch + graphql client
- Biome for linting
- Prettier for formatting

## Usage

### Scripts

- `pnpm dev` to run server in dev mode
- `pnpm gen:graphql` to generate graphql code
- `pnpm gen:migration` to generate db migrations
- `pnpm gen` to run all code generators
- `pnpm test` to run tests in watch mode
- `pnpm check` to run linter, formatter, type & test checks
- plus many more, see package.json

### GraphQL GUI

Start the dev server with `pnpm dev` and visit http://localhost:4000/api/v2/graphql

### DB GUI

Run `pnpm studio` and follow the terminal instructions
