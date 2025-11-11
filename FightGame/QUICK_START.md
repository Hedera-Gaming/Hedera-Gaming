# 🚀 Quick Start - Space Fighters Marketplace

## ⚡ Lancement Rapide (5 minutes)

### 1. Vérifier que le serveur tourne

Le serveur de développement devrait déjà être lancé. Sinon :

```bash
npm run dev
```

Accéder à : http://localhost:5173

---

## 🦊 Test avec MetaMask

### Installation (1 minute)

1. **Installer MetaMask**
   - [Chrome/Brave](https://metamask.io/download/)
   - Créer un wallet (sauvegarder la phrase de 12 mots !)

2. **Ajouter Hedera Testnet**
   ```
   Network Name: Hedera Testnet
   RPC URL: https://testnet.hashio.io/api
   Chain ID: 296
   Currency: HBAR
   Explorer: https://hashscan.io/testnet
   ```

### Test de Connexion (30 secondes)

1. Aller sur le Marketplace : http://localhost:5173/marketplace
2. Cliquer **"🦊 Connecter MetaMask"**
3. Dans MetaMask → **"Suivant"** puis **"Connecter"**
4. ✅ Vous devriez voir votre adresse : `0xAbCd...1234`

### Test d'Approbation (1 minute)

1. Sur le Marketplace, voir la barre **"⚠️ Approval Required"**
2. Cliquer **"🛡️ Approve"**
3. Dans MetaMask → **"Confirmer"** la transaction
4. Attendre 2-3 secondes
5. ✅ La barre devient verte : **"✅ Marketplace Approved"**

### Test de Listing (Si vous avez un NFT)

1. Cliquer sur un NFT que vous possédez
2. Cliquer **"List NFT"**
3. Entrer un prix : `10` HBAR
4. Cliquer **"List NFT"**
5. Confirmer dans MetaMask
6. ✅ Le NFT apparaît dans les listings

---

## 📦 Test avec HashPack

### Installation (1 minute)

1. **Installer HashPack**
   - [Extension Chrome](https://www.hashpack.app/)
   - Créer un wallet Hedera

### Test de Connexion (1 minute)

1. Aller sur le Marketplace
2. Cliquer **"📦 Connecter HashPack"**
3. Dans l'extension HashPack → **"Pair"**
4. ✅ Vous devriez voir votre Hedera ID : `0.0.12345`

---

## 🎮 Pages à Tester

### 1. Home Page
- URL : http://localhost:5173/
- ✅ Background 3D avec astéroïdes et vaisseaux
- ✅ Logo "SPACE FIGHTERS" avec effet néon
- ✅ Boutons de navigation

### 2. Game Page
- URL : http://localhost:5173/game
- ⚠️ Nécessite une connexion wallet
- ✅ Affiche le jeu

### 3. Marketplace
- URL : http://localhost:5173/marketplace
- ✅ Liste des NFTs
- ✅ Barre d'approbation si connecté
- ✅ Filtres et recherche
- ✅ Acheter/Vendre des NFTs

### 4. Leaderboard
- URL : http://localhost:5173/leaderboard
- ✅ Classement des joueurs

### 5. Community
- URL : http://localhost:5173/community
- ✅ Communauté

---

## 🔍 Vérifications Importantes

### ✅ Connexion Wallet

**Tester :**
```
1. Connecter MetaMask ✅
2. Déconnecter ✅
3. Rafraîchir la page → Devrait se reconnecter automatiquement ✅
4. Changer de compte dans MetaMask → Devrait détecter le changement ✅
```

### ✅ Approbation NFT

**Vérifier dans la console (F12) :**
```javascript
// Après approbation, ceci devrait retourner true
isApprovedForAll(userAddress, marketplaceAddress)
```

**États possibles :**
- 🔴 **Pas connecté** : Pas de barre d'approbation
- ⚠️ **Connecté + Pas approuvé** : Barre jaune "Approval Required"
- ✅ **Connecté + Approuvé** : Barre verte "Marketplace Approved"

### ✅ Listing de NFT

**Scénario complet :**
```
1. Avoir un NFT (demander à l'admin d'en mint un)
2. Wallet connecté ✅
3. Marketplace approuvé ✅
4. Cliquer "List NFT"
5. Entrer prix
6. Confirmer
7. ✅ NFT listé
```

---

## ⚠️ Dépannage Rapide

### Problème : "MetaMask n'est pas installé"
**Solution :** Installer MetaMask depuis [metamask.io](https://metamask.io)

### Problème : "Wrong network"
**Solution :** Ajouter Hedera Testnet (voir config ci-dessus)

### Problème : "Transaction failed"
**Solution :** 
1. Vérifier que vous avez des HBAR (testnet)
2. Aller sur [portal.hedera.com](https://portal.hedera.com/) pour obtenir des HBAR testnet

### Problème : "Not authorized to transfer"
**Solution :** Approuver le Marketplace d'abord !

### Problème : L'animation 3D ne s'affiche pas
**Solution :** 
1. Vérifier la console (F12) pour les erreurs
2. Rafraîchir la page
3. Vérifier que WebGL est activé dans le navigateur

---

## 📊 Points de Vérification

### Backend / Smart Contracts

- [ ] NFTCollection déployé sur Hedera Testnet
- [ ] Marketplace déployé sur Hedera Testnet
- [ ] Adresses dans `.env.local` correctes
- [ ] Supabase configuré et accessible

### Frontend

- [ ] Serveur de dev lancé (port 5173)
- [ ] Background 3D fonctionne (astéroïdes + vaisseaux)
- [ ] Logo Space Fighters s'affiche avec effet néon
- [ ] Navigation fonctionne

### Connexion Wallet

- [ ] MetaMask se connecte correctement
- [ ] Provider et signer créés
- [ ] Adresse affichée dans l'UI
- [ ] Reconnexion automatique fonctionne

### Approbation

- [ ] Barre d'approbation s'affiche
- [ ] Clic sur "Approve" ouvre MetaMask
- [ ] Transaction confirmée
- [ ] Statut passe à "Approved"
- [ ] Statut persiste après rafraîchissement

### Marketplace

- [ ] Listings s'affichent
- [ ] Filtres fonctionnent
- [ ] Recherche fonctionne
- [ ] Acheter un NFT fonctionne
- [ ] Lister un NFT fonctionne (si approuvé)

---

## 🎯 Checklist Finale

Avant de dire que tout fonctionne :

- [ ] ✅ Animation 3D du background
- [ ] ✅ Logo Space Fighters avec effet néon
- [ ] ✅ Connexion MetaMask
- [ ] ✅ Connexion HashPack
- [ ] ✅ Approbation Marketplace
- [ ] ✅ Listing d'un NFT
- [ ] ✅ Achat d'un NFT
- [ ] ✅ Navigation entre les pages
- [ ] ✅ Responsive (mobile/desktop)

---

## 📞 Besoin d'Aide ?

### Logs à vérifier :

1. **Console navigateur (F12)**
   - Erreurs JavaScript
   - Logs de connexion wallet
   - Transactions blockchain

2. **Terminal serveur**
   - Erreurs de compilation
   - Warnings Vite

3. **MetaMask**
   - Historique des transactions
   - Erreurs de réseau

### Commandes utiles :

```bash
# Relancer le serveur
npm run dev

# Nettoyer et relancer
rm -rf node_modules dist
npm install
npm run dev

# Voir les logs
# Dans la console (F12)
localStorage.getItem('wallet')  # Voir le wallet sauvegardé
```

---

## 🎉 Tout Fonctionne ?

Si tous les tests passent, félicitations ! 🚀

Le système est prêt pour :
- 🎮 Jouer et gagner des NFTs
- 💰 Lister et vendre des NFTs
- 🛒 Acheter des NFTs
- 🏆 Participer au leaderboard

**Bon jeu ! 🚀🎮**
