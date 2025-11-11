# 🔧 Guide de Dépannage - Approbation Marketplace

## 🐛 Erreur : "Failed to approve marketplace"

### ✅ Corrections Appliquées

1. **Variable d'environnement corrigée**
   - Ajout de fallback pour `VITE_NFT_COLLECTION_ADDRESS`
   - Logs des adresses au démarrage

2. **Validation améliorée**
   - Vérification du signer avant approbation
   - Vérification de l'adresse wallet
   - Test de connexion au contrat

3. **Gestion d'erreur détaillée**
   - Estimation de gas avant transaction
   - Messages d'erreur spécifiques
   - Logs console détaillés

---

## 🔍 Comment Diagnostiquer

### 1. Ouvrir la Console (F12)

Vous devriez voir ces logs au démarrage :

```
[NFTApproval] NFT Contract: 0xa22ec388764650316b4b70CabB67f9664Caa69F0
[NFTApproval] Marketplace Contract: 0xA53b0E6BB86574E3D06e815C385A84A19B7CB9Ff
```

### 2. Après Connexion Wallet

```
[NFTApproval] Initializing NFT contract...
[NFTApproval] Wallet address: 0x...
[NFTApproval] Signer available: true
[NFTApproval] Contract test call successful. Current approval: false
[NFTApproval] Contract initialized successfully
```

### 3. Cliquer sur "Approve"

```
[NFTApproval] Starting approval...
[NFTApproval] User address: 0x...
[NFTApproval] Marketplace address: 0xA53b0E6BB86574E3D06e815C385A84A19B7CB9Ff
[NFTApproval] NFT Contract address: 0xa22ec388764650316b4b70CabB67f9664Caa69F0
[NFTApproval] Gas estimate: 50000
[NFTApproval] Transaction sent: 0x...
[NFTApproval] Transaction confirmed: {...}
```

---

## ❌ Erreurs Possibles et Solutions

### Erreur 1 : "NFT contract not initialized"

**Cause :** Le contrat n'a pas pu se connecter

**Solution :**
```bash
# 1. Vérifier que le contrat est déployé
# Ouvrir deployed-contracts.json
# Vérifier que NFTCollection existe

# 2. Vérifier le réseau
# MetaMask doit être sur Hedera Testnet
# Chain ID: 296
# RPC: https://testnet.hashio.io/api

# 3. Rafraîchir la page
```

### Erreur 2 : "No signer available"

**Cause :** Wallet non connecté ou signer non créé

**Solution :**
```bash
# 1. Déconnecter wallet
# 2. Reconnecter wallet
# 3. Vérifier dans console :
#    wallet.signer !== null
```

### Erreur 3 : "Gas estimation failed"

**Cause :** 
- Contrat non déployé sur le réseau actuel
- Mauvaise adresse de contrat
- Problème de réseau

**Solution :**
```bash
# 1. Vérifier le réseau (doit être Hedera Testnet)
# 2. Vérifier les adresses dans .env.local
VITE_NFT_COLLECTION_ADDRESS=0xa22ec388764650316b4b70CabB67f9664Caa69F0
VITE_MARKETPLACE_CONTRACT_ADDRESS=0xA53b0E6BB86574E3D06e815C385A84A19B7CB9Ff

# 3. Vérifier que le contrat a la fonction setApprovalForAll
```

### Erreur 4 : "Insufficient funds for gas"

**Cause :** Pas assez de HBAR pour payer le gas

**Solution :**
```bash
# Obtenir des HBAR testnet:
# https://portal.hedera.com/
# Faucet : demander des HBAR gratuits
```

### Erreur 5 : "Transaction rejected by user"

**Cause :** Utilisateur a cliqué "Reject" dans MetaMask

**Solution :**
```bash
# Cliquer à nouveau sur "Approve"
# et "Confirm" dans MetaMask
```

### Erreur 6 : "Cannot connect to NFT contract"

**Cause :** Le contrat n'existe pas à cette adresse sur ce réseau

**Solution :**
```bash
# 1. Vérifier le réseau (Hedera Testnet)
# 2. Redéployer les contrats si nécessaire:
cd smartcontracts
npx hardhat run scripts/deploy.js --network hedera_testnet

# 3. Mettre à jour .env.local avec les nouvelles adresses
```

---

## 🔧 Commandes de Test

### Test 1 : Vérifier l'adresse du contrat

```javascript
// Dans la console (F12)
console.log(import.meta.env.VITE_NFT_COLLECTION_ADDRESS);
// Devrait afficher: 0xa22ec388764650316b4b70CabB67f9664Caa69F0
```

### Test 2 : Vérifier le signer

```javascript
// Dans la console après connexion
const wallet = JSON.parse(localStorage.getItem('wallet'));
console.log('Wallet:', wallet);
console.log('Has signer:', !!wallet?.signer);
```

### Test 3 : Test manuel d'approbation

```javascript
// Dans la console
const { ethers } = await import('ethers');
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const nftContract = new ethers.Contract(
  '0xa22ec388764650316b4b70CabB67f9664Caa69F0',
  ['function setApprovalForAll(address operator, bool approved)'],
  signer
);
const tx = await nftContract.setApprovalForAll(
  '0xA53b0E6BB86574E3D06e815C385A84A19B7CB9Ff',
  true
);
console.log('TX:', tx.hash);
await tx.wait();
console.log('Confirmed!');
```

---

## ✅ Checklist de Vérification

Avant de cliquer sur "Approve", vérifiez :

- [ ] ✅ Wallet connecté (MetaMask ou HashPack)
- [ ] ✅ Réseau = Hedera Testnet (Chain ID 296)
- [ ] ✅ Adresse wallet visible dans l'UI
- [ ] ✅ Console sans erreurs rouges
- [ ] ✅ Logs "[NFTApproval] Contract initialized successfully"
- [ ] ✅ HBAR disponibles pour gas (~0.01 HBAR)

---

## 🚀 Processus Complet

### Étape 1 : Connexion
```
1. Ouvrir Marketplace
2. Cliquer "Connect Wallet"
3. Choisir MetaMask/HashPack
4. Approuver la connexion
5. Voir son adresse affichée
```

### Étape 2 : Approbation
```
1. Voir barre jaune "⚠️ Approval Required"
2. Cliquer "🛡️ Approve"
3. Voir notification "Requesting approval transaction..."
4. Dans MetaMask : Cliquer "Confirm"
5. Attendre ~3-5 secondes
6. Voir notification "✅ Marketplace approved!"
7. Barre devient verte "✅ Marketplace Approved"
```

### Étape 3 : Vérification
```
Console devrait afficher :
[NFTApproval] Transaction confirmed: {...}
[NFTApproval] ApprovalForAll event: {...}
```

---

## 📊 Logs Attendus (Succès)

```
[NFTApproval] NFT Contract: 0xa22ec388764650316b4b70CabB67f9664Caa69F0
[NFTApproval] Marketplace Contract: 0xA53b0E6BB86574E3D06e815C385A84A19B7CB9Ff
[NFTApproval] Initializing NFT contract...
[NFTApproval] Wallet address: 0x6DC41fD6065084103D683b6D23e4bd785fA542C5
[NFTApproval] Signer available: true
[NFTApproval] Contract test call successful. Current approval: false
[NFTApproval] Contract initialized successfully
[NFTApproval] Starting approval...
[NFTApproval] User address: 0x6DC41fD6065084103D683b6D23e4bd785fA542C5
[NFTApproval] Marketplace address: 0xA53b0E6BB86574E3D06e815C385A84A19B7CB9Ff
[NFTApproval] NFT Contract address: 0xa22ec388764650316b4b70CabB67f9664Caa69F0
[NFTApproval] Gas estimate: 50000
[NFTApproval] Transaction sent: 0xabc123...
[NFTApproval] Transaction confirmed: { ... }
[NFTApproval] ApprovalForAll event: { owner: '0x...', operator: '0x...', approved: true }
✅ Marketplace approved! You can now list your NFTs.
```

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

1. **Copier tous les logs de la console**
2. **Noter le message d'erreur exact**
3. **Vérifier :**
   - Réseau actuel dans MetaMask
   - Adresse du contrat NFT
   - Adresse du Marketplace
   - Solde HBAR

4. **Essayer de redéployer les contrats** (en dernier recours)

---

**Les logs détaillés devraient maintenant vous dire exactement où est le problème ! 🔍**
