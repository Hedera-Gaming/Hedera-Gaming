# 🎮 Guide de Test - Nouveau Système de Jeu

## 🚀 Lancer le Test

```bash
npm run dev
```

Puis aller sur : **http://localhost:5173/game**

---

## ✅ Ce que Vous Verrez Maintenant

### 🎯 HUD Gauche (Nouveau !)

```
┌─────────────────────────┐
│ 🏆 SCORE: 5,420        │
│ 🔥 STREAK: x8 🔥       │  ← NOUVEAU !
│ 🎯 ACCURACY: 67.3%     │  ← NOUVEAU !
│    Hits: 134/200       │  ← NOUVEAU !
│    KILLS: 45 (8)       │
│ ⏱️  TIME: 5:32         │
├─────────────────────────┤
│    AMMO: 87            │
│    FUEL: 64%           │
└─────────────────────────┘
```

### 🏆 HUD Droit (Nouveau !)

```
┌────────────┐
│   LEVEL    │
│     12     │
└────────────┘

┌──────────────────────────┐
│ NFTs EARNED              │  ← NOUVEAU !
│ ⚡ Gold Master (75)      │
│ ⚡ Silver Hero (50)      │
│ ⚡ Bronze Fighter (30)   │
│ +2 more...               │
└──────────────────────────┘

┌────────────┐
│ BEST STREAK│  ← NOUVEAU !
│  🔥 x16    │
└────────────┘
```

---

## 🎮 Testez Ces Fonctionnalités

### 1️⃣ Kill Streak (Combo)

**Comment :**
- Tuez des ennemis sans vous faire toucher

**Attendu :**
- Compteur **STREAK** augmente : x1, x2, x3...
- À **x5+** : 🔥 apparaît + couleur orange
- À **x10+** : GÉANT au centre de l'écran "x10 COMBO!"
- **Bonus de points** augmente (+10 points/kill à x5)

**Notifications :**
```
+180 points! 🔥 Streak x8
```

**Si touché :**
```
-10 HP! 💥 Streak Reset
```

---

### 2️⃣ Accuracy en Temps Réel

**Comment :**
- Tirez (Espace)
- Regardez le HUD gauche

**Attendu :**
- **ACCURACY** se met à jour EN DIRECT
- **Hits/Shots** compte chaque tir
- **Couleur change** selon performance :
  - 🟢 Vert si > 70%
  - 🟡 Jaune si 50-69%
  - 🟠 Orange si 30-49%
  - 🔴 Rouge si < 30%

**Exemple temps réel :**
```
Tir 1 (raté): 0/1 = 0%
Tir 2 (touché): 1/2 = 50%
Tir 3 (touché): 2/3 = 66.7%
Tir 4 (raté): 2/4 = 50%
```

---

### 3️⃣ Rewards NFT Progressifs

**Comment :**
- Connectez votre wallet d'abord
- Tuez 10 ennemis

**Attendu :**
- À **10 kills** : Toast notification
  ```
  🎉 NFT Earned: Bronze Fighter 🥉!
  10 enemies eliminated with 55.2% accuracy!
  ```
- NFT ajouté dans HUD droit immédiatement
- Transaction blockchain envoyée en background

**Paliers à tester :**
```
10 kills  → 🥉 Bronze Fighter
20 kills  → 🥉 Bronze Fighter
30 kills  → 🥉 Bronze Fighter
50 kills  → ⭐ Silver Hero
75 kills  → 👑 Gold Master
100 kills → 🏆 Platinum Elite
```

**NFT List (HUD droit) :**
```
NFTs EARNED
⚡ Gold Master (75 kills)
⚡ Silver Hero (50 kills)
⚡ Bronze Fighter (30 kills)
```

---

### 4️⃣ Difficulté Progressive

**Comment :**
- Jouez plusieurs minutes
- Atteignez Level 5+

**Attendu :**

**Level 1 :**
- 3-5 ennemis max
- Spawn toutes les 3s
- Ennemis lents
- 100 HP

**Level 5 :**
- 13 ennemis max
- Spawn toutes les 1.75s
- Ennemis plus rapides
- 180 HP
- Tirent plus vite

**Level 10 :**
- 23 ennemis max 😱
- Spawn toutes les 0.55s
- TRÈS rapides
- 280 HP
- Tirent beaucoup plus vite

**Notification passage de niveau :**
```
🎉 Level 6! +110 Ammo +20 Fuel
```

---

### 5️⃣ Game Over - Nouvelles Stats

**Comment :**
- Mourir (HP = 0 ou Fuel = 0)

**Attendu - Écran Game Over :**
```
┌─────────────────────────────┐
│      GAME OVER              │
│                             │
│ Final Score: 15,420         │
│ Level Reached: 7            │
│ Enemies Killed: 65          │
│ Accuracy: 67.3%        ← NOUVEAU !
│ Max Streak: 🔥 x12     ← NOUVEAU !
│ NFTs Earned: 5         ← NOUVEAU !
│ Time Survived: 5:32         │
└─────────────────────────────┘
```

---

## 🎯 Scénario de Test Complet

### Test Rapide (3 min)

1. **Lancer le jeu**
2. **Connecter wallet** (MetaMask ou HashPack)
3. **Jouer 30 secondes**
   - Vérifier accuracy se met à jour
   - Faire un streak de 5+ kills
   - Voir le "COMBO!" au centre
4. **Atteindre 10 kills**
   - Toast NFT apparaît
   - NFT dans HUD droit
5. **Game Over**
   - Voir toutes les nouvelles stats

### Test Complet (10 min)

1. **Connecter wallet**
2. **Viser 75+ kills** pour gagner Gold Master
3. **Maintenir 65%+ accuracy**
4. **Faire un streak de 15+**
5. **Atteindre Level 7+**
6. **Gagner 5+ NFTs**
7. **Game Over et vérifier stats**

---

## 📊 Métriques à Vérifier

### ✅ Temps Réel
- [ ] Accuracy s'actualise à chaque tir
- [ ] Kill streak augmente sans délai
- [ ] NFT apparaît dès le palier atteint
- [ ] Score augmente avec bonus

### ✅ Notifications
- [ ] Toast "+X points!" à chaque kill
- [ ] Toast "🔥 Streak xN" si combo
- [ ] Toast "🎉 NFT Earned!" aux paliers
- [ ] Toast "💥 Streak Reset" si touché

### ✅ Progression
- [ ] Ennemis plus nombreux à Level 5+
- [ ] Ennemis spawns plus vite
- [ ] Ennemis tirent plus vite
- [ ] Bonus ammo/fuel au level up

### ✅ UI
- [ ] HUD lisible et clair
- [ ] Couleurs accuracy correctes
- [ ] Streak visible au centre si x10+
- [ ] NFTs listés dans panneau droit

---

## 🐛 Bugs Potentiels à Signaler

### Si vous voyez :
- ❌ Accuracy ne change pas
- ❌ Streak ne reset pas quand touché
- ❌ NFT notification en double
- ❌ Level ne monte pas
- ❌ Score ne compte pas le bonus

### Actions :
1. Ouvrir Console (F12)
2. Copier les erreurs
3. Signaler avec détails

---

## 🎮 Commandes

| Touche | Action |
|--------|--------|
| **WASD / Flèches** | Déplacer |
| **Espace** | Tirer |
| **P** | Pause |

---

## 🎯 Objectifs de Perf

| Métrique | Débutant | Intermédiaire | Expert |
|----------|----------|---------------|--------|
| **Score** | 5,000+ | 15,000+ | 40,000+ |
| **Accuracy** | 40%+ | 60%+ | 75%+ |
| **Max Streak** | x5+ | x15+ | x30+ |
| **Kills** | 25+ | 75+ | 150+ |
| **Level** | 3+ | 7+ | 12+ |
| **NFTs** | 2+ | 5+ | 9+ |

---

## 🚀 C'est Parti !

Lancez le jeu et testez toutes ces nouvelles fonctionnalités !

**Le système de rewards NFT devrait vous motiver à continuer de jouer ! 🎮💎**
