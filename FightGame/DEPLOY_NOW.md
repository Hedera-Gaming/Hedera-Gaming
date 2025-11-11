# 🚀 Guide de Redéploiement - Étape par Étape

## ✅ Étape 1 : Obtenir votre Clé Privée Hedera

### Option A : Depuis HashPack (Si vous avez HashPack)
1. Ouvrir l'extension HashPack
2. Cliquer sur **Settings** (⚙️)
3. Cliquer sur **Show Private Key**
4. Entrer votre mot de passe
5. **Copier la clé privée** (64 caractères hexadécimaux)

### Option B : Depuis le Portail Hedera
1. Aller sur https://portal.hedera.com/
2. Se connecter avec votre compte
3. Aller dans **Testnet Account**
4. Cliquer sur **Show Private Key**
5. **Copier la clé**

### Option C : Créer un Nouveau Compte Testnet
1. Aller sur https://portal.hedera.com/register
2. Créer un compte gratuit
3. Aller dans **Testnet** → **Create Account**
4. **Copier la clé privée** ET l'**Account ID**
5. Aller dans **Faucet** → Demander des HBAR testnet

---

## ✅ Étape 2 : Créer le fichier `.env`

**Ouvrir un terminal dans le dossier `smartcontracts/` :**

### Sur Windows (PowerShell) :
```powershell
cd smartcontracts
New-Item .env -ItemType File
notepad .env
```

### Ou ouvrir manuellement :
1. Aller dans le dossier `smartcontracts/`
2. Créer un nouveau fichier nommé `.env`
3. Ouvrir avec un éditeur de texte

**Ajouter ce contenu dans le fichier `.env` :**

```env
HEDERA_PRIVATE_KEY=VOTRE_CLÉ_PRIVÉE_ICI
HEDERA_ACCOUNT_ID=0.0.XXXXX
```

**Exemple :**
```env
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420abc123def456789...
HEDERA_ACCOUNT_ID=0.0.12345
```

⚠️ **IMPORTANT :**
- La clé doit être au format hexadécimal (64 caractères)
- **NE JAMAIS** partager cette clé
- **NE JAMAIS** commit ce fichier sur Git

---

## ✅ Étape 3 : Vérifier les HBAR Testnet

Vous avez besoin d'environ **0.5 HBAR** pour déployer les 4 contrats.

**Pour vérifier votre solde :**
1. Aller sur https://hashscan.io/testnet
2. Chercher votre Account ID (0.0.xxxxx)
3. Vérifier le solde

**Si vous n'avez pas de HBAR :**
1. Aller sur https://portal.hedera.com/
2. Se connecter
3. Aller dans **Testnet** → **Faucet**
4. Cliquer **Request HBAR**
5. Attendre 1-2 minutes

---

## ✅ Étape 4 : Compiler les Contrats

**Ouvrir un terminal dans le dossier `smartcontracts/` :**

```bash
npx hardhat compile
```

**Attendu :**
```
Compiled 4 Solidity files successfully
```

**Si erreur :**
- Vérifier que vous êtes bien dans le dossier `smartcontracts/`
- Vérifier que `node_modules/` existe (sinon : `npm install`)

---

## ✅ Étape 5 : Déployer les Contrats

**Dans le terminal (toujours dans `smartcontracts/`) :**

```bash
npx hardhat run scripts/deploy.js --network hedera_testnet
```

**Ce qui va se passer :**
```
🚀 Déploiement des Smart Contracts sur Hedera Testnet...

📝 Déploiement avec le compte: 0x6DC41fD6065084103D683b6D23e4bd785fA542C5

1️⃣ Déploiement du NFTCollection...
✅ NFTCollection déployé à: 0xABC123...

2️⃣ Déploiement du Marketplace...
✅ Marketplace déployé à: 0xDEF456...

3️⃣ Déploiement du Leaderboard...
✅ Leaderboard déployé à: 0xGHI789...

4️⃣ Déploiement du AchievementVerifier...
✅ AchievementVerifier déployé à: 0xJKL012...

✅ Toutes les adresses sauvegardées dans deployed-contracts.json

📋 Résumé des déploiements:
════════════════════════════════════════
NFTCollection    : 0xABC123...
Marketplace      : 0xDEF456...
Leaderboard      : 0xGHI789...
Verifier         : 0xJKL012...
════════════════════════════════════════
```

⏱️ **Durée estimée : 2-3 minutes**

---

## ✅ Étape 6 : Mettre à Jour `.env.local`

**Les nouvelles adresses seront sauvegardées dans :**
```
smartcontracts/deployed-contracts.json
```

**Copier les adresses dans `.env.local` (à la racine du projet) :**

```env
VITE_NFT_COLLECTION_ADDRESS=0xABC123...
VITE_MARKETPLACE_CONTRACT_ADDRESS=0xDEF456...
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

**Ou utiliser ces variables si le script les affiche :**
```env
VITE_NFT_CONTRACT_ADDRESS=0xABC123...
VITE_MARKETPLACE_CONTRACT_ADDRESS=0xDEF456...
VITE_LEADERBOARD_CONTRACT_ADDRESS=0xGHI789...
VITE_VERIFIER_CONTRACT_ADDRESS=0xJKL012...
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

---

## ✅ Étape 7 : Relancer le Serveur

**Arrêter le serveur (Ctrl+C) puis :**

```bash
npm run dev
```

---

## ✅ Étape 8 : Tester l'Approbation

1. Aller sur http://localhost:5173/marketplace
2. Ouvrir la console (F12)
3. Connecter votre wallet
4. Vérifier les logs :
   ```
   [NFTApproval] NFT Contract: 0xNOUVELLE_ADRESSE
   [NFTApproval] Contract initialized successfully
   ```
5. Cliquer **"Approve"**
6. Confirmer dans MetaMask
7. ✅ Devrait fonctionner !

---

## 🐛 Dépannage

### Erreur : "private key too long"

**Votre clé privée doit être exactement 64 caractères.**

Si elle est plus longue, essayez de ne prendre que les **64 derniers caractères** :

```env
# Si votre clé est : 302e020100300506032b657004220420abc123def456...
# Prenez uniquement : abc123def456... (64 caractères)
HEDERA_PRIVATE_KEY=abc123def456...
```

### Erreur : "insufficient funds"

**Vous n'avez pas assez de HBAR.**

1. Aller sur https://portal.hedera.com/
2. Faucet → Request HBAR
3. Attendre 2 minutes
4. Réessayer

### Erreur : "network error" ou "timeout"

**Problème de connexion à Hedera.**

1. Vérifier votre connexion internet
2. Réessayer dans quelques minutes
3. Ou changer le RPC dans `hardhat.config.js` :
   ```javascript
   url: "https://testnet.hashio.io/api"
   // Ou essayer :
   url: "https://pool.arkhia.io/hedera/testnet/json-rpc/v1"
   ```

---

## 📋 Checklist Complète

- [ ] ✅ Obtenu la clé privée Hedera
- [ ] ✅ Créé le fichier `.env` dans `smartcontracts/`
- [ ] ✅ Ajouté `HEDERA_PRIVATE_KEY` dans `.env`
- [ ] ✅ Vérifié avoir des HBAR testnet (>0.5)
- [ ] ✅ Compilé : `npx hardhat compile`
- [ ] ✅ Déployé : `npx hardhat run scripts/deploy.js --network hedera_testnet`
- [ ] ✅ Copié les nouvelles adresses
- [ ] ✅ Mis à jour `.env.local`
- [ ] ✅ Relancé le serveur : `npm run dev`
- [ ] ✅ Testé l'approbation

---

## 🎉 Après le Redéploiement

Une fois les contrats redéployés :

1. ✅ **L'approbation fonctionnera** - Plus d'erreur "execution reverted"
2. ✅ **Le Marketplace sera sécurisé** - Approbation ERC-721 standard
3. ✅ **Vous pourrez lister des NFTs** - Avec approbation préalable
4. ✅ **Les achats fonctionneront** - Transfer sécurisé

---

**Dites-moi quand vous êtes prêt et je vous aide à chaque étape ! 🚀**
