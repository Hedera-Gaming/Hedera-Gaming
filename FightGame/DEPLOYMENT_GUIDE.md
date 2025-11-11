# 🚀 Guide de Déploiement - Système d'Approbation NFT

## ⚠️ Important

Le contrat `NFTCollection.sol` a été modifié pour ajouter le système d'approbation ERC-721. 
**Vous devez redéployer le contrat pour que le système fonctionne.**

## 📋 Étapes de redéploiement

### 1. Préparation

```bash
cd smartcontracts
```

Vérifier que votre `.env` contient :
```env
PRIVATE_KEY=votre_private_key
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.xxxxx
```

### 2. Compilation

```bash
npx hardhat compile
```

Vérifier qu'il n'y a pas d'erreurs de compilation.

### 3. Déploiement sur Hedera Testnet

```bash
npx hardhat run scripts/deploy.js --network hedera_testnet
```

### 4. Mise à jour des adresses

Après le déploiement, mettez à jour le fichier `.env` dans le dossier racine :

```env
VITE_NFT_CONTRACT_ADDRESS=NOUVELLE_ADRESSE_NFT
VITE_MARKETPLACE_CONTRACT_ADDRESS=NOUVELLE_ADRESSE_MARKETPLACE
```

### 5. Redémarrage du serveur

```bash
npm run dev
```

---

## 🔄 Alternative : Migration sans redéploiement complet

Si vous ne voulez pas perdre les NFTs existants, vous pouvez :

### Option A : Upgrade Pattern (Recommandé pour production)

1. Déployer un nouveau contrat NFTCollection avec les fonctions d'approbation
2. Créer un script de migration pour transférer les NFTs
3. Mettre à jour l'adresse dans le Marketplace

### Option B : Wrapper Contract

1. Créer un contrat wrapper qui ajoute les fonctions d'approbation
2. Pointer le Marketplace vers le wrapper
3. Le wrapper appelle l'ancien contrat

---

## 📝 Modifications du contrat NFTCollection.sol

### Nouvelles variables d'état :
```solidity
mapping(uint256 => address) private tokenApprovals;
mapping(address => mapping(address => bool)) private operatorApprovals;
```

### Nouveaux événements :
```solidity
event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
```

### Nouvelles fonctions :
```solidity
function approve(address to, uint256 tokenId) external
function setApprovalForAll(address operator, bool approved) external
function getApproved(uint256 tokenId) external view returns (address)
function isApprovedForAll(address owner, address operator) external view returns (bool)
```

### Fonction modifiée :
```solidity
function transferNFT(uint256 tokenId, address to) external
// Maintenant vérifie les approbations avant le transfert
```

---

## ✅ Vérification post-déploiement

### 1. Test d'approbation

Dans la console Hardhat :

```javascript
const NFTCollection = await ethers.getContractAt("NFTCollection", "ADRESSE");
const Marketplace = await ethers.getContractAt("Marketplace", "ADRESSE_MARKETPLACE");

// Approuver le marketplace
await NFTCollection.setApprovalForAll(Marketplace.address, true);

// Vérifier l'approbation
const isApproved = await NFTCollection.isApprovedForAll(
  await ethers.getSigner().getAddress(),
  Marketplace.address
);
console.log("Approved:", isApproved); // Devrait afficher: true
```

### 2. Test de listing

1. Connecter votre wallet sur l'interface
2. Voir la barre d'approbation en haut de la page Marketplace
3. Cliquer sur "Approve Marketplace"
4. Signer la transaction
5. Le statut devrait passer à "Marketplace Approved"

### 3. Test de listing d'un NFT

1. Essayer de lister un NFT
2. Le dialogue devrait permettre d'entrer le prix directement (si approuvé)
3. Confirmer le listing
4. Le NFT devrait apparaître dans le Marketplace

---

## 🐛 Dépannage

### Erreur : "Not authorized to transfer"

**Cause :** Le Marketplace n'a pas l'approbation

**Solution :**
1. Vérifier que `setApprovalForAll` a été appelé
2. Vérifier que l'adresse du Marketplace est correcte
3. Vérifier dans la console : `isApprovedForAll(userAddress, marketplaceAddress)`

### Erreur : "NFT does not exist"

**Cause :** Le tokenId n'existe pas dans le nouveau contrat

**Solution :**
1. Vérifier que les NFTs ont été migrés
2. Ou mint de nouveaux NFTs de test

### Le bouton "Approve" ne fait rien

**Cause :** Problème de connexion wallet ou adresse de contrat incorrecte

**Solution :**
1. Vérifier que le wallet est connecté
2. Vérifier `.env` : `VITE_NFT_CONTRACT_ADDRESS`
3. Vérifier la console pour les erreurs

---

## 📊 Coûts estimés (Hedera Testnet)

| Action | Gas estimé | Coût HBAR (testnet) |
|--------|-----------|---------------------|
| Déploiement NFTCollection | ~2M gas | ~0.5 HBAR |
| Déploiement Marketplace | ~1M gas | ~0.25 HBAR |
| setApprovalForAll | ~50k gas | ~0.01 HBAR |
| createListing | ~100k gas | ~0.02 HBAR |
| buyNFT | ~150k gas | ~0.03 HBAR |

---

## 🎯 Checklist de déploiement

- [ ] Compiler les contrats sans erreur
- [ ] Déployer NFTCollection sur testnet
- [ ] Déployer Marketplace sur testnet
- [ ] Mettre à jour `.env` avec les nouvelles adresses
- [ ] Redémarrer le serveur de développement
- [ ] Tester l'approbation dans l'UI
- [ ] Tester un listing complet
- [ ] Tester un achat
- [ ] Vérifier les événements sur Hedera Explorer

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifier les logs de la console navigateur
2. Vérifier les logs du terminal Hardhat
3. Consulter `NFT_APPROVAL_SYSTEM.md` pour la documentation complète
4. Vérifier que toutes les variables d'environnement sont correctes

---

**Bon déploiement ! 🚀**
