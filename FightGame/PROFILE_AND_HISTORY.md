# 🎮 Page Profile et Historique des NFTs

## ✅ Ce Qui a Été Créé

### 1️⃣ Page Profile Complète (`/profile`)

Une page profile avec :
- ✅ Affichage de tous les NFTs possédés
- ✅ Historique complet des parties jouées
- ✅ Statistiques du joueur (NFTs, Games, Best Score, Total Kills)
- ✅ Interface pour lister les NFTs sur le Marketplace
- ✅ Liens vers HashScan pour voir les NFTs on-chain

---

## 🎯 Fonctionnalités

### Onglet "My NFTs"

**Affiche tous vos NFTs avec :**
- 🎨 Icône de rareté (🥉 🥈 🏆 💎)
- 📝 Nom du NFT
- ⭐ Rareté (Bronze, Silver, Gold, Platinum, Diamond)
- 📖 Description du NFT
- 🔢 Token ID
- 🛒 Bouton "List on Marketplace"
- 🔗 Bouton pour voir sur HashScan

**Actions disponibles :**
1. **Lister sur le Marketplace**
   - Clic sur "List on Marketplace"
   - Entrer le prix en HBAR
   - Confirmer
   - NFT listé !

2. **Voir on-chain**
   - Clic sur l'icône 🔗
   - S'ouvre sur HashScan
   - Voir toutes les infos blockchain

---

### Onglet "Game History"

**Affiche toutes vos parties avec :**
- 📅 Date et heure de la partie
- 🏆 Score final
- 🎯 Nombre de kills
- 🎲 Accuracy (%)
- 🔥 Max Streak
- 📈 Niveau atteint
- ⏱️ Durée de la partie
- 💎 NFTs gagnés dans cette partie (avec la liste)

**Triée par :**
- Plus récentes en premier
- Garde les 50 dernières parties

---

## 📊 Statistiques Affichées

### Cartes de Stats (en haut)

1. **NFTs Owned**
   - Nombre total de NFTs possédés
   - Icône : 🏆

2. **Games Played**
   - Nombre total de parties
   - Icône : 🎯

3. **Best Score**
   - Meilleur score de toutes les parties
   - Icône : ⭐

4. **Total Kills**
   - Total cumulé de tous les kills
   - Icône : ⚡

---

## 🔄 Comment Ça Marche

### Sauvegarde Automatique

**Quand une partie se termine :**

1. ✅ Les stats sont sauvegardées dans localStorage
   ```javascript
   game_history_${wallet.address}
   ```

2. ✅ L'historique contient :
   - timestamp
   - score
   - kills
   - accuracy
   - maxStreak
   - level
   - duration
   - nftsEarned (nombre)
   - nftsList (liste des NFTs)

3. ✅ Garde les 50 dernières parties

---

### Chargement des Données

**Quand vous ouvrez /profile :**

1. ✅ Charge les NFTs depuis le smart contract
   - Via `useNFTRewards(wallet)`
   - Appelle `getOwnerTokens(address)`
   - Récupère les détails de chaque NFT

2. ✅ Charge l'historique depuis localStorage
   - Clé : `game_history_${wallet.address}`
   - Parse JSON
   - Affiche trié par date

---

## 🎮 Guide d'Utilisation

### 1. Voir Vos NFTs

```
1. Aller sur http://localhost:5173/profile
2. Connexion wallet (si pas déjà fait)
3. Onglet "My NFTs" (par défaut)
4. Voir tous vos NFTs !
```

**Si aucun NFT :**
- Message : "No NFTs Yet"
- Bouton "Play Game" pour en gagner

---

### 2. Voir l'Historique des Parties

```
1. Sur /profile
2. Clic onglet "Game History"
3. Voir toutes vos parties
4. Détails de chaque session
```

**Informations par partie :**
```
┌─────────────────────────────────────┐
│ 🏆 Game Session                     │
│ 10 Nov 2025, 18:45:32               │
├─────────────────────────────────────┤
│ Score: 15,420                       │
│ Kills: 45                           │
│ Accuracy: 67.3%                     │
│ Max Streak: 🔥 x12                  │
│ Level: 7                            │
├─────────────────────────────────────┤
│ 💎 NFTs Earned in this Session:     │
│ - Bronze Fighter (10 kills)        │
│ - Bronze Fighter (20 kills)        │
│ - Silver Hero (50 kills)            │
└─────────────────────────────────────┘
```

---

### 3. Lister un NFT

```
1. Sur /profile → My NFTs
2. Trouver le NFT à vendre
3. Clic "List on Marketplace"
4. Dialog s'ouvre :
   ┌──────────────────────┐
   │ List NFT for Sale    │
   ├──────────────────────┤
   │ 🏆 Gold Master       │
   │ Gold                 │
   ├──────────────────────┤
   │ Price (HBAR): [5.0]  │
   ├──────────────────────┤
   │ [Cancel] [List NFT]  │
   └──────────────────────┘
5. Entrer prix : 5
6. Clic "List NFT"
7. Confirmer dans MetaMask
8. ✅ NFT listé !
```

---

## 📍 Navigation

**Dans la barre de navigation :**
```
GAME | PROFILE | MARKETPLACE | LEADERBOARD | ...
       ↑
  Nouveau lien !
```

**Routes disponibles :**
- `/` - Home
- `/game` - Jeu
- `/profile` - Profile + NFTs + History ← NOUVEAU !
- `/marketplace` - Marketplace
- `/leaderboard` - Classement

---

## 🔍 Détails Techniques

### localStorage Structure

**Clé :** `game_history_${wallet.address}`

**Valeur :** Array de sessions
```json
[
  {
    "timestamp": 1731260732000,
    "score": 15420,
    "kills": 45,
    "accuracy": 67.3,
    "maxStreak": 12,
    "level": 7,
    "duration": 332,
    "nftsEarned": 3,
    "nftsList": [
      "Bronze Fighter (10 kills)",
      "Bronze Fighter (20 kills)",
      "Silver Hero (50 kills)"
    ]
  },
  ...
]
```

---

### Composants Utilisés

**Page :**
- `src/pages/Profile.tsx`

**Hooks :**
- `useWalletConnect()` - Gestion wallet
- `useNFTRewards()` - Chargement NFTs
- `useMarketplace()` - Listing NFTs

**UI :**
- `Card` - Cartes de stats et NFTs
- `Tabs` - Onglets NFTs / History
- `Dialog` - Modal de listing
- `Button` - Actions

---

## 🎯 Exemple d'Utilisation Complète

### Scénario : Voir mes 2 NFTs gagnés

```
1. Jouer au jeu → Gagner 2 NFTs
   - 10 kills → Bronze Fighter
   - 20 kills → Bronze Fighter
   
2. Game Over
   - Historique sauvegardé automatiquement
   - NFTs mintés sur blockchain
   
3. Aller sur /profile
   - Voir "NFTs Owned: 2"
   - Onglet "My NFTs" :
     ┌─────────────────┐
     │ 🥉 Bronze       │
     │ Fighter         │
     │ Token ID: #1    │
     │ [List] [🔗]     │
     └─────────────────┘
     ┌─────────────────┐
     │ 🥉 Bronze       │
     │ Fighter         │
     │ Token ID: #2    │
     │ [List] [🔗]     │
     └─────────────────┘
   
4. Onglet "Game History"
   - Voir la partie récente
   - Score, Kills, Accuracy
   - Liste des NFTs gagnés
   
5. Lister un NFT
   - Clic "List on Marketplace" sur NFT #1
   - Prix: 3 HBAR
   - Confirmer
   - ✅ NFT #1 maintenant sur Marketplace !
```

---

## ✅ Avantages du Système

### Pour le Joueur

1. **Visibilité Complète**
   - Tous les NFTs en un coup d'œil
   - Historique complet des performances
   - Statistiques détaillées

2. **Gestion Facile**
   - Lister les NFTs depuis Profile
   - Voir les NFTs on-chain
   - Suivre la progression

3. **Motivation**
   - Voir les NFTs gagnés par partie
   - Comparer les performances
   - Objectifs clairs (streaks, accuracy, etc.)

---

### Pour le Développeur

1. **localStorage**
   - Pas besoin de base de données
   - Rapide et réactif
   - Données locales sécurisées

2. **Séparation des Données**
   - Historique par wallet
   - Pas de conflit entre comptes
   - Facile à nettoyer

3. **Performance**
   - Chargement instant
   - Pas d'appel API
   - Offline-ready

---

## 🔧 Personnalisation

### Modifier le Nombre de Parties Gardées

**Dans `useGameLogic.ts` :**
```typescript
// Keep only last 50 games
if (history.length > 50) {
  history.pop();
}

// Change 50 to whatever you want:
if (history.length > 100) { // Garde 100 parties
  history.pop();
}
```

---

### Ajouter des Stats

**Dans `Profile.tsx` :**
```typescript
<Card className="glass-card">
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Avg Accuracy</p>
        <p className="text-3xl font-bold text-cyan-400">
          {(gameHistory.reduce((sum, g) => sum + (g.accuracy || 0), 0) / gameHistory.length).toFixed(1)}%
        </p>
      </div>
      <Target className="h-10 w-10 text-cyan-400" />
    </div>
  </CardContent>
</Card>
```

---

## 🎉 Résultat Final

**Vous avez maintenant :**

✅ **Page Profile complète**
✅ **Affichage de tous les NFTs**
✅ **Historique complet des parties**
✅ **Statistiques détaillées**
✅ **Interface de listing NFT**
✅ **Liens HashScan**
✅ **Navigation intégrée**
✅ **Sauvegarde automatique**

**Testez maintenant :**
```
1. Jouer au jeu
2. Gagner des NFTs
3. Aller sur /profile
4. Voir vos NFTs et historique !
```

---

**Tout est prêt pour voir et gérer vos NFTs ! 🎮💎**
