# Install dependencies only when needed
FROM node:20-alpine AS deps
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable # Enable corepack to manage pnpm versions
RUN corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the app with cache dependencies
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable # Enable corepack to manage pnpm versions
RUN corepack prepare pnpm@latest --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build


# Production image, copy all the files and run next
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /usr/src/app
RUN corepack enable # Enable corepack to manage pnpm versions
RUN corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# EXPOSE 3000

CMD [ "node","dist/main" ]