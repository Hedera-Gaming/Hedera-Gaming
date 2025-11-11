# 🚀 Test de la Page Profile - MAINTENANT !

## ✅ Ce Qui a Été Ajouté

1. ✅ **Page Profile** (`/profile`)
2. ✅ **Affichage des NFTs possédés**
3. ✅ **Historique complet des parties**
4. ✅ **Sauvegarde automatique de l'historique**
5. ✅ **Interface de listing NFT**

---

## 🎯 Testez en 3 Minutes !

### Étape 1 : Voir Vos NFTs Gagnés

```bash
# 1. Aller sur Profile
http://localhost:5173/profile

# 2. Connecter wallet (si pas déjà fait)

# 3. Onglet "My NFTs"
# Vous devriez voir vos 2 NFTs !
```

**Si vous voyez vos NFTs :**
```
✅ Les NFTs sont visibles !
✅ Vous pouvez les lister !
✅ Tout fonctionne !
```

**Si "No NFTs Yet" :**
```
❌ Les NFTs ne sont pas mintés on-chain
❌ Ou ils sont sur l'ancien contrat
✅ Solution : Jouer pour gagner de nouveaux NFTs
```

---

### Étape 2 : Voir l'Historique

```bash
# 1. Sur /profile
# 2. Clic onglet "Game History"
# 3. Voir vos parties précédentes
```

**Vous devriez voir :**
```
┌─────────────────────────────────┐
│ 🏆 Game Session                 │
│ Date/Heure                      │
├─────────────────────────────────┤
│ Score: XXX                      │
│ Kills: XX                       │
│ Accuracy: XX.X%                 │
│ Max Streak: 🔥 xXX              │
│ Level: X                        │
├─────────────────────────────────┤
│ 💎 NFTs Earned:                 │
│ - Bronze Fighter (10 kills)    │
│ - Bronze Fighter (20 kills)    │
└─────────────────────────────────┘
```

---

### Étape 3 : Tester le Listing

```bash
# 1. Onglet "My NFTs"
# 2. Sur un NFT, clic "List on Marketplace"
# 3. Entrer prix : 5
# 4. Clic "List NFT"
# 5. Confirmer dans MetaMask
# ✅ NFT listé !
```

---

## 📋 Checklist de Vérification

### NFTs

- [ ] ✅ Aller sur `/profile`
- [ ] ✅ Voir "NFTs Owned: 2" (ou votre nombre)
- [ ] ✅ Onglet "My NFTs" affiche les NFTs
- [ ] ✅ Chaque NFT a :
  - [ ] Icône (🥉 🥈 🏆 💎)
  - [ ] Nom
  - [ ] Rareté
  - [ ] Token ID
  - [ ] Bouton "List on Marketplace"
  - [ ] Bouton 🔗 (lien HashScan)

---

### Historique

- [ ] ✅ Onglet "Game History"
- [ ] ✅ Voir vos parties précédentes
- [ ] ✅ Chaque partie affiche :
  - [ ] Date/Heure
  - [ ] Score
  - [ ] Kills
  - [ ] Accuracy
  - [ ] Max Streak
  - [ ] Level
  - [ ] NFTs gagnés dans cette partie

---

### Navigation

- [ ] ✅ Barre de navigation affiche "PROFILE"
- [ ] ✅ Clic "PROFILE" → Va sur `/profile`
- [ ] ✅ URL change bien

---

## ❓ Questions Fréquentes

### Q1 : "Je ne vois pas mes NFTs gagnés"

**Causes possibles :**

1. **NFTs sur ancien contrat**
   ```
   ❌ Ancien : 0xa22ec388764650316b4b70CabB67f9664Caa69F0
   ✅ Nouveau : 0xDaf81a60A0e9415b8486e155B7c83Abe47DB2314
   ```
   **Solution :** Jouer pour gagner de nouveaux NFTs

2. **NFTs pas encore mintés**
   ```
   Les NFTs sont créés lors du Game Over
   ```
   **Solution :** Attendre la fin de partie + confirmation

3. **Mauvais wallet**
   ```
   Les NFTs sont liés au wallet
   ```
   **Solution :** Connecter le bon wallet

---

### Q2 : "L'historique est vide"

**Causes :**

1. **Première fois**
   - Normal si vous n'avez jamais joué
   - Jouer une partie pour créer l'historique

2. **localStorage vide**
   - L'historique est local
   - Changer de navigateur = nouveau historique

**Solution :** Jouer au jeu !

---

### Q3 : "Comment lister un NFT ?"

**Étapes :**
```
1. /profile → My NFTs
2. Clic "List on Marketplace"
3. Entrer prix (ex: 5 HBAR)
4. Clic "List NFT"
5. Confirmer MetaMask
6. ✅ Listé !
```

**Vérifier :**
```
# Aller sur Marketplace
/marketplace

# Votre NFT devrait être visible !
```

---

## 🎮 Test Complet (5 Min)

### Scénario : Du Jeu au Listing

```
1. Jouer au Jeu (2 min)
   - /game
   - Jouer jusqu'à 20+ kills
   - Gagner 2 NFTs
   - Game Over

2. Voir Profile (1 min)
   - /profile
   - Onglet "My NFTs"
   - Voir les 2 NFTs
   - Onglet "Game History"
   - Voir la partie récente

3. Lister un NFT (1 min)
   - Clic "List on Marketplace"
   - Prix: 5 HBAR
   - Confirmer
   - ✅ NFT listé !

4. Vérifier Marketplace (1 min)
   - /marketplace
   - Voir votre NFT listé
   - Prix affiché : 5 HBAR
```

---

## 🔍 Debug

### Si les NFTs ne s'affichent pas

**Ouvrir Console (F12) :**

```javascript
// Vérifier le wallet
const wallet = JSON.parse(localStorage.getItem('wallet'));
console.log('Wallet address:', wallet?.address);

// Vérifier l'historique
const history = localStorage.getItem(`game_history_${wallet?.address}`);
console.log('Game history:', JSON.parse(history));

// Vérifier les contrats
console.log('NFT Contract:', '0xDaf81a60A0e9415b8486e155B7c83Abe47DB2314');
```

---

### Logs Attendus

**Chargement Profile :**
```
Loading NFTs...
[useNFTRewards] Fetching NFTs for: 0x...
[useNFTRewards] Found 2 NFTs
NFTs loaded successfully
```

**Si erreur :**
```
Error fetching NFTs: ...
```
→ Vérifier le wallet et les adresses contrats

---

## 🎉 Ce Que Vous Devriez Voir

### Page Profile Complète

```
┌─────────────────────────────────────────────┐
│ 🎮 Player Profile                           │
│ 0x6DC41fD6...5fA542C5                       │
├─────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ NFTs: 2 │ │Games: 5 │ │ Score: │        │
│ └─────────┘ └─────────┘ └─────────┘        │
├─────────────────────────────────────────────┤
│ [My NFTs (2)] [Game History (5)]           │
├─────────────────────────────────────────────┤
│ My NFTs:                                    │
│ ┌──────────┐ ┌──────────┐                  │
│ │🥉 Bronze │ │🥉 Bronze │                  │
│ │ Fighter  │ │ Fighter  │                  │
│ │ #1       │ │ #2       │                  │
│ │[List][🔗]│ │[List][🔗]│                  │
│ └──────────┘ └──────────┘                  │
└─────────────────────────────────────────────┘
```

---

## 📱 Navigation

**Nouvelle barre :**
```
GAME | PROFILE | MARKETPLACE | ...
       ↑
    NOUVEAU !
```

---

## ✅ Résumé

**Vous pouvez maintenant :**

1. ✅ **Voir tous vos NFTs** - /profile → My NFTs
2. ✅ **Voir l'historique** - /profile → Game History
3. ✅ **Lister des NFTs** - Bouton "List on Marketplace"
4. ✅ **Suivre vos stats** - NFTs, Games, Score, Kills
5. ✅ **Voir NFTs par partie** - Historique détaillé

---

## 🚀 Commencez !

```bash
# 1. Aller sur Profile
http://localhost:5173/profile

# 2. Voir vos NFTs et historique !
```

**Si vos 2 NFTs s'affichent → ✅ TOUT FONCTIONNE !**

**Si pas de NFTs → Jouer pour en gagner de nouveaux sur le nouveau contrat !**

---

**Dites-moi ce que vous voyez sur /profile ! 🎮**
