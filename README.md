This is a sample app built using tRPC, hono + bun, vite, react, tanstack router etc...

- Command to build the server image:
docker build -t turbo-sample-server -f ./apps/server/Dockerfile .

- Command to deploy the server to fly.io:
flyctl deploy --config apps/server/fly.toml --dockerfile  apps/server/Dockerfile --remote-only --wait-timeout=500

- Start the server:
docker run -p 3000:3000 -d -e NODE_ENV="production" turbo-sample-server