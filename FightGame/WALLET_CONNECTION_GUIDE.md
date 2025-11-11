# 👛 Guide de Connexion Wallet - Space Fighters

## Vue d'ensemble

Le système de connexion wallet supporte **MetaMask** et **HashPack** pour permettre aux joueurs de se connecter et d'interagir avec le jeu sur Hedera.

---

## 🦊 MetaMask

### Installation

1. **Télécharger MetaMask**
   - Chrome/Brave: [chrome.google.com/webstore](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
   - Firefox: [addons.mozilla.org/firefox](https://addons.mozilla.org/firefox/addon/ether-metamask/)
   - Edge: Disponible sur Microsoft Edge Add-ons

2. **Créer un wallet**
   - Ouvrir l'extension MetaMask
   - Cliquer sur "Créer un portefeuille"
   - Sauvegarder la phrase de récupération (12 mots) en lieu sûr
   - Créer un mot de passe

### Configuration Hedera Testnet

MetaMask doit être configuré pour se connecter à Hedera Testnet :

```javascript
// Paramètres du réseau Hedera Testnet
Network Name: Hedera Testnet
RPC URL: https://testnet.hashio.io/api
Chain ID: 296
Currency Symbol: HBAR
Block Explorer: https://hashscan.io/testnet
```

**Ajout manuel dans MetaMask :**
1. Cliquer sur le réseau actuel (en haut)
2. "Ajouter un réseau"
3. "Ajouter un réseau manuellement"
4. Entrer les paramètres ci-dessus
5. Sauvegarder

**Ajout automatique (via le site) :**
Le bouton "Se connecter avec MetaMask" propose automatiquement d'ajouter le réseau si nécessaire.

### Connexion au jeu

1. Cliquer sur "🦊 Connecter MetaMask"
2. MetaMask s'ouvre → Cliquer sur "Suivant" puis "Connecter"
3. ✅ Connexion réussie - L'adresse s'affiche : `0xAbCd...1234`

### Fonctionnalités avec MetaMask

- ✅ Mint de NFTs d'achievements
- ✅ Listing de NFTs sur le Marketplace
- ✅ Achat de NFTs
- ✅ Transfert de NFTs
- ✅ Approbation du Marketplace
- ✅ Transactions en HBAR

---

## 📦 HashPack

### Installation

1. **Télécharger HashPack**
   - Extension Chrome: [chrome.google.com/webstore](https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk)
   - Site officiel: [hashpack.app](https://www.hashpack.app/)

2. **Créer un wallet**
   - Ouvrir l'extension HashPack
   - "Create New Wallet"
   - Sauvegarder la phrase de récupération (24 mots)
   - Créer un PIN de sécurité

3. **Obtenir un Hedera Account ID**
   - HashPack crée automatiquement un Hedera Account ID (format : `0.0.xxxxx`)
   - Cet ID est utilisé pour toutes les transactions Hedera

### Connexion au jeu

1. Cliquer sur "📦 Connecter HashPack"
2. HashPack s'ouvre avec un QR code ou une fenêtre de pairing
3. **Sur desktop** : Accepter la connexion dans l'extension
4. **Sur mobile** : Scanner le QR code avec l'app HashPack mobile
5. ✅ Connexion réussie - Le Hedera ID s'affiche : `0.0.12345`

### Fonctionnalités avec HashPack

- ✅ Transactions natives Hedera (via HTS)
- ✅ Gestion des NFTs Hedera
- ✅ Support des royalties natives
- ✅ Transactions en HBAR
- ⚠️ Compatibilité partielle avec les smart contracts EVM

### Différences avec MetaMask

| Fonctionnalité | MetaMask | HashPack |
|----------------|----------|----------|
| Format adresse | 0x... (EVM) | 0.0.xxx (Hedera) |
| Standard | ERC-721 | HTS Native |
| Réseau | EVM-compatible | Hedera natif |
| Gas fees | Oui | Non (frais Hedera) |
| Royalties | On-chain | Natives HTS |

---

## 🔄 Flux de connexion complet

### 1. Première connexion

```
Joueur arrive sur le site
    ↓
Cliquer "Jouer" ou "Marketplace"
    ↓
Modal de connexion s'affiche
    ↓
Choisir MetaMask OU HashPack
    ↓
Autoriser la connexion dans l'extension
    ↓
✅ Wallet connecté
    ↓
Profil créé automatiquement dans la DB
    ↓
Redirection vers la page demandée
```

### 2. Reconnexion automatique

```
Joueur revient sur le site
    ↓
useWalletConnect vérifie localStorage
    ↓
Si wallet trouvé → Reconnexion automatique
    ↓
✅ Wallet connecté sans interaction
```

### 3. Déconnexion

```
Cliquer sur l'icône du wallet (en haut à droite)
    ↓
"Déconnexion"
    ↓
localStorage nettoyé
    ↓
❌ Wallet déconnecté
```

---

## 🛡️ Étape d'approbation NFT

### Pourquoi l'approbation est nécessaire ?

Le Marketplace ne peut pas transférer vos NFTs sans votre autorisation. C'est une mesure de sécurité standard.

### Processus d'approbation

```
1️⃣ Joueur connecté avec MetaMask/HashPack
    ↓
2️⃣ Joueur va sur Marketplace
    ↓
3️⃣ Barre jaune "⚠️ Approval Required" s'affiche
    ↓
4️⃣ Cliquer "🛡️ Approve Marketplace"
    ↓
5️⃣ Signer la transaction dans le wallet
    ↓
6️⃣ ✅ "Marketplace Approved" s'affiche en vert
    ↓
7️⃣ Maintenant vous pouvez lister vos NFTs !
```

### Vérification automatique

Le système vérifie automatiquement si vous êtes approuvé :

```typescript
// Au chargement du Marketplace
useEffect(() => {
  if (wallet?.address) {
    // Vérifie isApprovedForAll(userAddress, marketplaceAddress)
    checkApprovalStatus();
  }
}, [wallet?.address]);
```

### Listing d'un NFT (avec approbation)

```
Joueur clique "List NFT"
    ↓
Système vérifie l'approbation
    ↓
SI approuvé → Affiche formulaire de prix
    ↓
SI non approuvé → Affiche le bouton "Approve Marketplace"
    ↓
Après approbation → Formulaire de prix s'affiche
    ↓
Entrer le prix → "List NFT"
    ↓
✅ NFT listé sur le Marketplace
```

---

## 🔐 Sécurité

### Ce que l'approbation permet

- ✅ Le Marketplace peut transférer vos NFTs **uniquement quand vous les listez**
- ✅ Le transfert ne se fait **que lors d'une vente confirmée**
- ✅ Vous restez propriétaire jusqu'à la vente effective

### Ce que l'approbation NE permet PAS

- ❌ Le Marketplace ne peut pas transférer vos NFTs sans votre action
- ❌ Le Marketplace n'a pas accès à vos fonds HBAR
- ❌ Le Marketplace ne peut pas lister vos NFTs automatiquement
- ❌ L'approbation ne donne pas accès à d'autres tokens

### Révocation de l'approbation

Vous pouvez révoquer l'approbation à tout moment :

1. Barre verte "✅ Marketplace Approved"
2. Cliquer sur "Revoke"
3. Signer la transaction
4. ❌ Approbation révoquée

**Conséquence :** Vous ne pourrez plus lister de NFTs jusqu'à réapprouver.

---

## 🎮 Cas d'usage pratiques

### Cas 1 : Nouveau joueur

```
1. Installer MetaMask
2. Configurer Hedera Testnet
3. Se connecter au jeu
4. Jouer et gagner des NFTs
5. Approuver le Marketplace (une fois)
6. Lister et vendre des NFTs
```

### Cas 2 : Joueur avec HashPack

```
1. Installer HashPack
2. Créer un compte Hedera
3. Se connecter au jeu avec HashPack
4. Recevoir des NFTs HTS natifs
5. Trader directement sur Hedera
```

### Cas 3 : Basculer entre wallets

```
1. Déconnexion du wallet actuel
2. Connexion avec un autre wallet
3. Profil séparé créé automatiquement
4. NFTs spécifiques à chaque wallet
```

---

## 🐛 Dépannage

### MetaMask ne se connecte pas

**Problème :** "MetaMask n'est pas installé"
- **Solution :** Installer l'extension MetaMask

**Problème :** "Wrong network"
- **Solution :** Ajouter Hedera Testnet manuellement (voir config ci-dessus)

**Problème :** "Connection rejected"
- **Solution :** Cliquer sur "Connecter" dans la popup MetaMask

### HashPack ne se connecte pas

**Problème :** "Connection timeout"
- **Solution :** Vérifier que HashPack est déverrouillé

**Problème :** "No account connected"
- **Solution :** Accepter le pairing dans HashPack

### Approbation échoue

**Problème :** "Transaction failed"
- **Solution :** Vérifier que vous avez assez d'HBAR pour le gas

**Problème :** "Not authorized"
- **Solution :** Vous n'êtes pas le propriétaire du NFT

---

## 📊 Résumé des actions wallet

| Action | Nécessite signature | Gas/Frais |
|--------|---------------------|-----------|
| **Connexion** | ✅ Oui | ❌ Gratuit |
| **Approbation Marketplace** | ✅ Oui | ~0.01 HBAR |
| **Listing NFT** | ✅ Oui | ~0.02 HBAR |
| **Achat NFT** | ✅ Oui | Prix + ~0.03 HBAR |
| **Cancel Listing** | ✅ Oui | ~0.01 HBAR |
| **Mint NFT** | ⚠️ Admin uniquement | ~0.05 HBAR |
| **Transfer NFT** | ✅ Oui | ~0.01 HBAR |

---

## 🎯 Checklist pour le joueur

Avant de commencer à jouer :

- [ ] Installer MetaMask **OU** HashPack
- [ ] Créer un wallet et sauvegarder la phrase de récupération
- [ ] Configurer Hedera Testnet (MetaMask uniquement)
- [ ] Se connecter au jeu
- [ ] Profil créé automatiquement ✅
- [ ] Jouer et gagner des NFTs
- [ ] **Approuver le Marketplace** (avant de vendre)
- [ ] Lister et trader des NFTs

---

**🎮 Bon jeu et bonnes transactions ! 🚀**
