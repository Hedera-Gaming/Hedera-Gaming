# Base image avec Node.js 20 et TypeScript préinstallé
FROM mcr.microsoft.com/devcontainers/typescript-node:20-bullseye

# Configure retry pour apt
RUN echo 'Acquire::Retries "3";' > /etc/apt/apt.conf.d/80-retries

# Mise à jour et installation des dépendances système
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    pkg-config \
    build-essential \
    python3 \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libgl1-mesa-dev \
    libxi-dev \
    libnss3 \
    libatk-bridge2.0-0 \
    libxcomposite1 \
    libxrandr2 \
    libasound2 \
    libxdamage1 \
    libxkbcommon0 \
    libgbm-dev \
    && rm -rf /var/lib/apt/lists/*

# ------------------------------------------------------------
# 🧰 Installation des outils Node/JS utiles
# ------------------------------------------------------------
RUN npm install -g \
    pnpm \
    yarn \
    typescript \
    ts-node \
    nodemon \
    @nestjs/cli \
    eslint \
    prettier \
    serve \
    concurrently

# ------------------------------------------------------------
# 🧩 Installation des dépendances globales de ton projet
# ------------------------------------------------------------
# (tu pourras les ajuster selon ton package.json)
RUN npm install -g \
    @hashgraph/sdk \
    phaser \
    canvas \
    jsdom \
    @napi-rs/canvas \
    cross-env

# ------------------------------------------------------------
# 📁 Configuration du répertoire de travail
# ------------------------------------------------------------
WORKDIR /workspace

# Copie des fichiers du projet (facultatif ici si tu montes un volume devcontainer)
# COPY . .

# ------------------------------------------------------------
# 🔧 Variables d’environnement utiles
# ------------------------------------------------------------
ENV NODE_ENV=development
ENV TZ=Europe/Paris
ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8

# ------------------------------------------------------------
# 🚀 Commande par défaut
# ------------------------------------------------------------
CMD ["bash"]
