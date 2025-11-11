# 🎯 Comment Lister vos NFTs sur le Marketplace

## ✅ Prérequis

Avant de pouvoir lister des NFTs, vous devez :

1. ✅ **Wallet connecté** - MetaMask ou HashPack
2. ✅ **Marketplace approuvé** - "✅ Marketplace Approved" (Déjà fait ! 🎉)
3. ✅ **Avoir des NFTs** - Sur le NOUVEAU contrat

---

## 🎮 Étape 1 : Obtenir des NFTs

### IMPORTANT : Nouveau Contrat NFT

Puisque nous venons de redéployer les contrats :
```
❌ Ancien contrat : 0xa22ec388764650316b4b70CabB67f9664Caa69F0
✅ Nouveau contrat : 0xDaf81a60A0e9415b8486e155B7c83Abe47DB2314
```

**Les NFTs de l'ancien contrat ne fonctionneront PAS !**

### Comment Obtenir des NFTs ?

#### Option A : Jouer au Jeu 🎮

**C'est la façon la plus simple !**

1. **Aller sur** http://localhost:5173/game

2. **Connecter votre wallet** (même wallet que pour le Marketplace)

3. **Jouer et tuer des ennemis** 🎯
   - 10 kills → 🥉 Bronze Fighter NFT
   - 20 kills → 🥉 Bronze Fighter NFT
   - 30 kills → 🥉 Bronze Fighter NFT
   - 50 kills → ⭐ Silver Hero NFT
   - 75 kills → 👑 Gold Master NFT
   - 100 kills → 🏆 Platinum Elite NFT
   - 150 kills → 💎 Diamond Ace NFT

4. **Chaque NFT est automatiquement minté** sur le nouveau contrat !

5. **Voir vos NFTs** :
   - Console : Vous verrez "🎉 NFT Earned: Bronze Fighter!"
   - HUD du jeu : Section "NFTs EARNED"

#### Option B : Vérifier Si Vous Avez des NFTs

**Aller sur la page Profile :**

```
http://localhost:5173/profile
```

Section **"My NFTs"** → Si vide, vous devez jouer pour en gagner !

---

## 🛒 Étape 2 : Lister un NFT

### Sur la Page Profile

1. **Aller sur** http://localhost:5173/profile

2. **Chercher la section "My NFTs"**

3. **Trouver un NFT que vous voulez vendre**

4. **Cliquer sur le bouton "List on Marketplace"** ou "Sell"

5. **Entrer le prix en HBAR**
   - Exemple : `10` pour 10 HBAR
   - Exemple : `0.5` pour 0.5 HBAR

6. **Cliquer "List NFT"**

7. **Confirmer la transaction dans MetaMask**

8. ✅ **Votre NFT est maintenant listé !**

---

### Alternative : Depuis le Marketplace (Si Interface Disponible)

1. **Aller sur** http://localhost:5173/marketplace

2. **Vérifier que vous voyez** :
   ```
   ✅ Marketplace Approved
   You can list your NFTs
   ```

3. **Chercher un bouton "List NFT" ou "Sell NFT"**

4. **Sélectionner le NFT dans la liste**

5. **Entrer le prix**

6. **Confirmer**

---

## 📋 Processus Complet de Listing

### Étape par Étape

```
1. Obtenir NFT (Jouer au jeu → 10+ kills)
   ↓
2. Vérifier que le NFT est dans votre wallet
   ↓
3. Marketplace déjà approuvé ✅
   ↓
4. Aller sur Profile ou Marketplace
   ↓
5. Cliquer "List" sur le NFT
   ↓
6. Entrer le prix (ex: 5 HBAR)
   ↓
7. Confirmer dans MetaMask
   ↓
8. ✅ NFT listé sur le Marketplace !
   ↓
9. Autre joueurs peuvent l'acheter
```

---

## 🎯 Guide de Test Complet

### Test 1 : Gagner un NFT

```bash
# 1. Lancer le jeu
http://localhost:5173/game

# 2. Connecter wallet

# 3. Jouer jusqu'à 10 kills

# 4. Voir la notification
"🎉 NFT Earned: Bronze Fighter!"

# 5. Vérifier le HUD
NFTs EARNED: 1
⚡ Bronze Fighter (10)
```

### Test 2 : Vérifier les NFTs

```bash
# 1. Aller sur Profile
http://localhost:5173/profile

# 2. Section "My NFTs"
# Devrait montrer :
🎮 Bronze Fighter
Rarity: Bronze
Token ID: #1
[List on Marketplace]
```

### Test 3 : Lister le NFT

```bash
# 1. Cliquer "List on Marketplace"

# 2. Dialog s'ouvre
"List NFT for Sale"

# 3. Entrer prix
Price: 5 HBAR

# 4. Cliquer "List"

# 5. MetaMask s'ouvre
→ Confirmer

# 6. Attendre 3-5 secondes

# 7. ✅ "NFT listed successfully!"
```

### Test 4 : Voir sur le Marketplace

```bash
# 1. Aller sur Marketplace
http://localhost:5173/marketplace

# 2. Votre NFT devrait apparaître
🎮 Bronze Fighter
Price: 5 HBAR
[Cancel] (si c'est votre NFT)
```

---

## 💡 Conseils de Prix

### Prix Recommandés par Rareté

| Rareté | Prix Suggéré |
|--------|--------------|
| 🥉 Bronze | 1-5 HBAR |
| ⭐ Silver | 5-15 HBAR |
| 👑 Gold | 15-30 HBAR |
| 🏆 Platinum | 30-60 HBAR |
| 💎 Diamond | 60-100+ HBAR |

### Facteurs de Prix

- **Rareté** : Plus rare = Plus cher
- **Kills nécessaires** : Plus difficile à obtenir = Plus cher
- **Statistiques du jeu** : Accuracy, streak, etc.
- **Demande du marché** : Voir le "Floor Price"

---

## ❌ Problèmes Possibles

### Erreur : "No NFTs to list"

**Cause :** Vous n'avez pas de NFTs sur le nouveau contrat

**Solution :**
1. Jouer au jeu
2. Gagner au moins 10 kills
3. Attendre le mint du NFT
4. Réessayer

---

### Erreur : "Please approve marketplace first"

**Cause :** Le marketplace n'est pas approuvé

**Solution :**
1. Aller sur Marketplace
2. Voir la barre jaune
3. Cliquer "Approve"
4. Confirmer dans MetaMask
5. Attendre l'approbation
6. Réessayer de lister

---

### Erreur : "NFT not found" ou "Invalid token"

**Cause :** Le NFT est sur l'ancien contrat

**Solution :**
```
❌ Les anciens NFTs ne fonctionnent pas
✅ Jouer pour gagner de nouveaux NFTs
```

---

## 🎮 Guide Rapide : Du Jeu au Marketplace

### En 5 Minutes

```
1. Jouer → 10 kills → NFT gagné       (2 min)
   ↓
2. Profile → Vérifier NFT             (30 sec)
   ↓
3. Marketplace → Approuver            (30 sec)
   ↓
4. Profile → List NFT → Prix          (1 min)
   ↓
5. Marketplace → NFT visible          (30 sec)
```

---

## 📊 Statistiques de Listing

### Ce qui se passe quand vous listez

1. ✅ **NFT transféré** - Du joueur au Marketplace
2. ✅ **Listing créé** - Visible sur le Marketplace
3. ✅ **Prix fixé** - En HBAR
4. ✅ **Achetable** - Par d'autres joueurs
5. ✅ **Annulable** - Par vous (bouton "Cancel")

### Frais

- **Listing** : Gratuit (juste gas)
- **Vente** : Royalties + Platform Fee (configuré dans le contrat)
- **Annulation** : Gratuit (juste gas)

---

## 🎉 Après le Listing

### Que pouvez-vous faire ?

1. **Attendre l'achat** - Autres joueurs peuvent acheter
2. **Annuler** - Si vous changez d'avis
3. **Lister d'autres NFTs** - Gagnez plus, vendez plus !
4. **Voir les statistiques** - Floor Price, Volume, etc.

### Recevoir le Paiement

Quand quelqu'un achète votre NFT :
- ✅ **HBAR reçus automatiquement** dans votre wallet
- ✅ **Notification de vente**
- ✅ **Le NFT transféré à l'acheteur**

---

## 🚀 Résumé

**Pour lister vos NFTs :**

1. ✅ **Jouer au jeu** → Gagner des NFTs
2. ✅ **Approuver le Marketplace** (Déjà fait !)
3. ✅ **Aller sur Profile** → My NFTs
4. ✅ **Cliquer "List"** → Entrer prix → Confirmer
5. ✅ **Votre NFT est en vente !**

**Commencez par jouer pour gagner votre premier NFT ! 🎮**
