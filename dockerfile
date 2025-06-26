# Étape 1 : Build de l'application
FROM node:20 AS builder

# Dossier de travail
WORKDIR /app

# Copie des fichiers nécessaires à l'installation
COPY package*.json ./

# Installation des dépendances
RUN npm install --legacy-peer-deps

# Copie du reste du projet
COPY . .

# Build de l'application Next.js
RUN npm run build

# Étape 2 : Conteneur de production (plus léger)
FROM node:20-slim

WORKDIR /app

# Copie uniquement ce qui est nécessaire depuis l'étape de build
COPY --from=builder /app ./

# Expose le port utilisé par Next.js
EXPOSE 3000

# Commande de démarrage en production
CMD ["npm", "start"]
