# Use Node.js 22 LTS as base image
FROM node:22-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    bash \
    curl \
    wget \
    vim \
    nano \
    htop \
    tree \
    jq \
    yq \
    docker-cli \
    docker-compose \
    make \
    gcc \
    g++ \
    python3 \
    py3-pip \
    openssh-client \
    rsync \
    unzip \
    zip \
    && rm -rf /var/cache/apk/*

# Install pnpm globally
RUN npm install -g pnpm@latest

# Install global development tools
RUN npm install -g \
    @nx/cli@21.0.3 \
    typescript \
    eslint \
    prettier \
    nodemon \
    ts-node \
    @swc/cli \
    @swc/core

# Create a non-root user
RUN addgroup -g 1000 developer && \
    adduser -D -s /bin/bash -u 1000 -G developer developer

# Set working directory to user's home
WORKDIR /home/developer

# Switch to non-root user
USER developer

# Set environment variables
ENV NODE_ENV=development
ENV PATH="/home/developer/.local/bin:$PATH"

# Create common directories
RUN mkdir -p /home/developer/.ssh && \
    mkdir -p /home/developer/.config && \
    mkdir -p /home/developer/.cache

# Set shell to bash
SHELL ["/bin/bash", "-c"]

# Expose common ports
EXPOSE 3000 3001 4200 5000 8000 9000

# Default command
CMD ["/bin/bash"]
