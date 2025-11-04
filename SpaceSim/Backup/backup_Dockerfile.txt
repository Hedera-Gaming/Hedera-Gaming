FROM mcr.microsoft.com/devcontainers/typescript-node:20-bullseye

# Configure retry for apt
RUN echo 'Acquire::Retries "3";' > /etc/apt/apt.conf.d/80-retries

# Install basic dependencies only (without canvas dependencies)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    build-essential \
    python3 && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js global packages if needed
# RUN npm install -g typescript

# # Image officielle Node.js avec TypeScript
# FROM mcr.microsoft.com/devcontainers/typescript-node:22-bullseye

# # Installer les dépendances système pour canvas et autres outils
# RUN echo 'Acquire::Retries "3";' > /etc/apt/apt.conf.d/80-retries    

# RUN sed -i 's|deb.debian.org|mirrors.kernel.org/debian|g' /etc/apt/sources.list && \
#     apt-get update && \
#     apt-get install -y --no-install-recommends \
#     git \
#     curl \
#     ca-certificates \
#     pkg-config \
#     libcairo2-dev \
#     libpango1.0-dev \
#     libjpeg-dev \
#     libgif-dev \
#     librsvg2-dev \
#     build-essential \
#     python3 && \
#     rm -rf /var/lib/apt/lists/*


# # Installer PM2 pour gérer les processus Node
# RUN npm install -g pm2

# # Installer nodemon pour le hot reload
# RUN npm install -g nodemon

# # Le dossier de travail sera monté par devcontainer
# WORKDIR /workspace/SpaceSim

# # Exposer les ports du client et du serveur
# EXPOSE 4500 8081

# # La commande par défaut sera gérée par PM2 via ecosystem.config.js
# CMD ["pm2-runtime", "ecosystem.config.js"]


# # Image officielle Node.js avec TypeScript
# FROM mcr.microsoft.com/devcontainers/typescript-node:16-bullseye

# # Installer Git et outils utiles avec retry pour gérer les problèmes réseau
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends \
#     git \
#     curl \
#     ca-certificates && \
#     rm -rf /var/lib/apt/lists/*

# # Installer PM2 pour gérer les processus Node et hot reload
# RUN npm install -g pm2

# # Installer nodemon pour watch du serveur
# RUN npm install -g nodemon

# # Créer le dossier de travail
# WORKDIR /workspace/SpaceSim

# # Copier uniquement les fichiers package pour accélérer l'installation
# COPY ./package.json ./package-lock.json* ./

# # Installer toutes les dépendances de tous les workspaces
# RUN npm install --workspaces

# # Exposer les ports du client et du serveur
# EXPOSE 4500 8081

# # Commande par défaut : démarrer le serveur et le client avec hot reload
# CMD ["pm2-runtime", "ecosystem.config.js"]