#### BASE STAGE
#### Installs moon.

FROM node:24.12.0 AS base
WORKDIR /app

# Install moon binary
RUN curl -fsSL https://moonrepo.dev/install/moon.sh | bash
ENV PATH="/root/.moon/bin:$PATH"

#### SKELETON STAGE
#### Scaffolds repository skeleton structures.

FROM base AS skeleton

# Copy entire repository and scaffold
COPY . .
RUN moon docker scaffold tanstack-start-template

#### BUILD STAGE
#### Builds the project.

FROM base AS build

# Copy toolchain
COPY --from=skeleton /root/.proto /root/.proto

# Copy workspace configs
COPY --from=skeleton /app/.moon/docker/workspace .

# Install dependencies
RUN moon docker setup

# Copy project sources
COPY --from=skeleton /app/.moon/docker/sources .

RUN moon run tanstack-start-template:build && cd .output/server && corepack pnpm install

# Prune extraneous dependencies
RUN moon docker prune

FROM base AS runner

RUN apt-get update && apt-get install -y supervisor caddy

COPY --from=build /app/.output /app/
COPY build/supervisord.conf /etc/supervisor/
COPY build/Caddyfile /etc/caddy/

CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
