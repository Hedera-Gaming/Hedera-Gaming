# 🚀 Redéploiement des Contrats - URGENT

## ❌ Problème Actuel

Les contrats déployés actuellement **N'ONT PAS** les fonctions d'approbation ERC-721 !

**Erreur :**
```
Gas estimation failed: execution reverted
```

**Cause :**
Le contrat NFTCollection à l'adresse `0xa22ec388764650316b4b70CabB67f9664Caa69F0` ne contient **PAS** la fonction `setApprovalForAll()` que nous avons ajoutée.

---

## ✅ Solution : Redéployer les Contrats

### Option 1 : Redéploiement Complet (RECOMMANDÉ)

#### Étape 1 : Créer le fichier `.env` dans smartcontracts

```bash
cd smartcontracts
```

Créer un fichier `.env` avec ce contenu :

```env
HEDERA_PRIVATE_KEY=votre_clé_privée_hedera_ici
HEDERA_ACCOUNT_ID=0.0.xxxxx
```

**⚠️ IMPORTANT :**
- La clé privée doit être au format hexadécimal (64 caractères)
- Exemple : `302e020100300506032b657004220420abc123...`
- **NE PAS** partager cette clé !

#### Étape 2 : Compiler les Contrats

```bash
npx hardhat compile
```

Devrait afficher :
```
Compiled 4 Solidity files successfully
```

#### Étape 3 : Déployer sur Hedera Testnet

```bash
npx hardhat run scripts/deploy.js --network hedera_testnet
```

**Attendu :**
```
Deploying contracts with account: 0x...
NFTCollection deployed to: 0xNOUVELLE_ADRESSE_1
Marketplace deployed to: 0xNOUVELLE_ADRESSE_2
...
```

#### Étape 4 : Mettre à Jour `.env.local`

Copier les nouvelles adresses dans `.env.local` (racine du projet) :

```env
VITE_NFT_COLLECTION_ADDRESS=0xNOUVELLE_ADRESSE_1
VITE_MARKETPLACE_CONTRACT_ADDRESS=0xNOUVELLE_ADRESSE_2
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

#### Étape 5 : Relancer le Serveur

```bash
npm run dev
```

#### Étape 6 : Tester

1. Rafraîchir la page (F5)
2. Connecter wallet
3. Cliquer "Approve"
4. ✅ Devrait fonctionner !

---

### Option 2 : Solution Temporaire (Si pas de clé privée)

**Si vous ne pouvez pas redéployer immédiatement**, je peux :

1. **Désactiver temporairement** l'approbation
2. **Modifier le Marketplace** pour fonctionner sans approbation
3. **Permettre les listings** directement

**Voulez-vous cette solution temporaire ?**

---

## 🔑 Obtenir une Clé Privée Hedera

### Méthode 1 : HashPack

1. Ouvrir HashPack
2. Aller dans Settings
3. Export Private Key
4. Copier la clé

### Méthode 2 : Hedera Portal

1. Aller sur https://portal.hedera.com/
2. Se connecter
3. Créer un compte testnet
4. Obtenir la clé privée

### Méthode 3 : Générer Nouvelle Clé

```bash
# Installer hedera-sdk
npm install @hashgraph/sdk

# Script pour générer une clé
node -e "const { PrivateKey } = require('@hashgraph/sdk'); const key = PrivateKey.generate(); console.log('Private Key:', key.toString()); console.log('Public Key:', key.publicKey.toString());"
```

---

## 📋 Checklist de Redéploiement

- [ ] Créer `.env` dans `smartcontracts/`
- [ ] Ajouter `HEDERA_PRIVATE_KEY`
- [ ] Compiler : `npx hardhat compile`
- [ ] Déployer : `npx hardhat run scripts/deploy.js --network hedera_testnet`
- [ ] Copier nouvelles adresses
- [ ] Mettre à jour `.env.local`
- [ ] Relancer serveur
- [ ] Tester approbation

---

## 🐛 Dépannage Déploiement

### Erreur : "private key too long"

**Solution :**
```bash
# La clé doit être 64 caractères (32 bytes en hex)
# Format correct : 302e020100300506032b657004220420...
# Si trop longue, prendre uniquement les 64 derniers caractères
```

### Erreur : "insufficient funds"

**Solution :**
```bash
# Obtenir HBAR testnet :
# https://portal.hedera.com/
# Aller dans Faucet
# Demander HBAR gratuits
```

### Erreur : "network error"

**Solution :**
```bash
# Vérifier hardhat.config.js
# URL doit être : https://testnet.hashio.io/api
# Chain ID doit être : 296
```

---

## 💡 Alternative : Contrats Déjà Déployés

Si vous voulez éviter de redéployer, vous pouvez utiliser mes contrats de test :

```env
# .env.local
VITE_NFT_COLLECTION_ADDRESS=0xVOTRE_ADRESSE_ICI
VITE_MARKETPLACE_CONTRACT_ADDRESS=0xVOTRE_ADRESSE_ICI
```

**Mais il faudra quand même redéployer pour avoir les fonctions d'approbation !**

---

## 🎯 Quelle Option Choisir ?

### ✅ Redéployer (Recommandé)
**Si vous avez :**
- Une clé privée Hedera
- Des HBAR testnet
- 10 minutes

→ **Suivre Option 1 ci-dessus**

### ⚠️ Solution Temporaire
**Si vous voulez tester rapidement :**
- Pas de clé privée maintenant
- Voulez tester le reste du système
- Redéploierez plus tard

→ **Dites-moi et je désactive l'approbation temporairement**

---

## ❓ Quelle Option Voulez-vous ?

**Répondez avec :**
1. **"Redéployer"** - Je vais vous guider étape par étape
2. **"Temporaire"** - Je désactive l'approbation pour que ça fonctionne maintenant
3. **"J'ai besoin d'aide"** - Je vous aide à obtenir une clé privée

---

**En attendant, l'erreur est normale car le contrat déployé n'a pas les fonctions d'approbation ! 🔧**
