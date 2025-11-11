# ✅ Test d'Approbation - Guide Rapide

## 🚀 Étapes de Test

### 1. Ouvrir la Console
**Avant de commencer :**
- Ouvrir le navigateur
- Appuyer sur **F12**
- Aller sur l'onglet **Console**

### 2. Lancer l'Application
```bash
npm run dev
```

Aller sur : **http://localhost:5173/marketplace**

---

## 📋 Vérification Initiale

### Dans la Console, vous devriez voir :
```
[NFTApproval] NFT Contract: 0xa22ec388764650316b4b70CabB67f9664Caa69F0
[NFTApproval] Marketplace Contract: 0xA53b0E6BB86574E3D06e815C385A84A19B7CB9Ff
```

✅ **Si vous voyez ça = Bon !**  
❌ **Si erreurs = Problème de configuration**

---

## 🔌 Test de Connexion Wallet

### Étape 1 : Connecter MetaMask
1. Cliquer **"🦊 Connecter MetaMask"**
2. Dans MetaMask → **"Suivant"** puis **"Connecter"**
3. Vérifier que votre adresse s'affiche

### Dans la Console :
```
[NFTApproval] Initializing NFT contract...
[NFTApproval] Wallet address: 0x6DC41fD6065084103D683b6D23e4bd785fA542C5
[NFTApproval] Signer available: true
[NFTApproval] Contract test call successful. Current approval: false
[NFTApproval] Contract initialized successfully
```

✅ **Si vous voyez "Contract initialized successfully" = Parfait !**  
❌ **Si "Contract test call failed" = Voir solutions ci-dessous**

---

## 🛡️ Test d'Approbation

### Étape 1 : Cliquer sur "Approve"
Vous devriez voir une **barre jaune** avec :
```
⚠️ Approval Required
🛡️ Approve
```

Cliquer sur **"Approve"**

### Dans la Console :
```
[NFTApproval] Starting approval...
[NFTApproval] User address: 0x...
[NFTApproval] Marketplace address: 0xA53b0E6BB86574E3D06e815C385A84A19B7CB9Ff
[NFTApproval] NFT Contract address: 0xa22ec388764650316b4b70CabB67f9664Caa69F0
[NFTApproval] Gas estimate: 50000
```

### Étape 2 : Confirmer dans MetaMask
MetaMask devrait s'ouvrir avec une transaction

**Cliquer "Confirmer"**

### Dans la Console :
```
[NFTApproval] Transaction sent: 0xabc123def456...
[NFTApproval] Transaction confirmed: {...}
[NFTApproval] ApprovalForAll event: { ... }
```

### Notifications attendues :
```
ℹ️ Requesting approval transaction...
ℹ️ Transaction sent! Hash: 0xabc123...
ℹ️ Waiting for confirmation...
✅ Marketplace approved! You can now list your NFTs.
```

### Barre devient verte :
```
✅ Marketplace Approved
You can list your NFTs
[Revoke]
```

---

## ❌ Erreurs Possibles

### Erreur 1 : "NFT contract not initialized"

**Console :**
```
[NFTApproval] NFT contract not initialized
```

**Solution :**
1. Vérifier que vous êtes sur **Hedera Testnet**
2. Vérifier dans MetaMask :
   - Network : Hedera Testnet
   - Chain ID : 296
   - RPC : https://testnet.hashio.io/api
3. Rafraîchir la page (F5)

---

### Erreur 2 : "No signer available"

**Console :**
```
[NFTApproval] No signer available
```

**Solution :**
1. Déconnecter le wallet
2. Reconnecter
3. Vérifier que l'adresse s'affiche dans l'UI

---

### Erreur 3 : "Gas estimation failed"

**Console :**
```
[NFTApproval] Gas estimation failed: ...
```

**Causes possibles :**
- ❌ Mauvais réseau (pas Hedera Testnet)
- ❌ Contrat pas déployé sur ce réseau
- ❌ Adresse de contrat incorrecte

**Solution :**
```bash
# Vérifier .env.local
cat .env.local

# Devrait afficher :
VITE_MARKETPLACE_CONTRACT_ADDRESS=0xA53b0E6BB86574E3D06e815C385A84A19B7CB9Ff
VITE_NFT_COLLECTION_ADDRESS=0xa22ec388764650316b4b70CabB67f9664Caa69F0
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/

# Si différent, mettre à jour avec ces adresses
```

---

### Erreur 4 : "Insufficient funds for gas"

**Console :**
```
[NFTApproval] Error: insufficient funds
```

**Solution :**
```bash
# Obtenir des HBAR testnet :
# 1. Aller sur https://portal.hedera.com/
# 2. Se connecter
# 3. Aller dans Faucet
# 4. Demander des HBAR gratuits
# 5. Attendre 1-2 minutes
# 6. Réessayer
```

---

### Erreur 5 : "Cannot connect to NFT contract"

**Console :**
```
[NFTApproval] Contract test call failed
Error: Cannot connect to NFT contract
```

**Solution :**
```bash
# Le contrat n'existe pas sur ce réseau
# Redéployer :

cd smartcontracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network hedera_testnet

# Copier les nouvelles adresses
# Mettre à jour .env.local

# Redémarrer le serveur
npm run dev
```

---

## 🎯 Checklist Succès

Cochez chaque étape :

- [ ] Console ouvre sans erreurs
- [ ] Logs "[NFTApproval] NFT Contract:" visible
- [ ] Wallet connecté
- [ ] Logs "Contract initialized successfully"
- [ ] Réseau = Hedera Testnet (296)
- [ ] HBAR disponibles (> 0.01)
- [ ] Barre jaune "Approval Required" visible
- [ ] Cliquer "Approve" → MetaMask s'ouvre
- [ ] Confirmer transaction
- [ ] Notification "✅ Marketplace approved!"
- [ ] Barre devient verte

---

## 🧪 Test Complet Réussi ?

**Si TOUT fonctionne, vous devriez avoir :**

✅ Wallet connecté  
✅ Adresse affichée  
✅ Barre verte "Marketplace Approved"  
✅ Bouton "Revoke" visible  
✅ Pas d'erreurs dans la console  

**Vous pouvez maintenant lister des NFTs ! 🎉**

---

## 📞 Si Problème Persiste

**Copier et envoyer :**

1. **Tous les logs de la console** (copier tout le texte)
2. **Message d'erreur exact**
3. **Résultat de ces commandes :**

```bash
# Dans la console navigateur (F12)
console.log('Network:', await window.ethereum.request({ method: 'eth_chainId' }));
console.log('Account:', await window.ethereum.request({ method: 'eth_accounts' }));
console.log('NFT Address:', '0xa22ec388764650316b4b70CabB67f9664Caa69F0');
console.log('Marketplace Address:', '0xA53b0E6BB86574E3D06e815C385A84A19B7CB9Ff');
```

**Avec ces infos, on pourra identifier exactement le problème ! 🔍**
