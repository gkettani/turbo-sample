This is a sample app built using tRPC, hono + bun, vite, react, tanstack router etc...

- Command to build the server image:
docker build -t turbo-sample-server -f ./apps/server/Dockerfile .

- Command to deploy the server to fly.io:
flyctl deploy --config apps/server/fly.toml --dockerfile  apps/server/Dockerfile --remote-only --wait-timeout=500

- Start the server:
docker run -p 3000:3000 -d -e NODE_ENV="production" turbo-sample-server

- Add handling for observability (very minimalistic + support for better stack)
- Add handling of posthog, how to use it and why use it 
- Add handling of Auth.js + frontend
- Add handling of a proper UI library with fully designed and reusable components 
- Proper structure of the API (protected routes etc...)
- Proper frontend structure using tanstack router/query/tables etc...

## References
- [Biome usage](https://biomejs.dev/guides/getting-started/#usage)
