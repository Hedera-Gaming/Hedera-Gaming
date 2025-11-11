# 💸 Gestion des Royalties sur Hedera

## Vue d'ensemble

Votre Marketplace gère actuellement les royalties **on-chain** (dans le smart contract). Hedera propose une alternative plus efficace avec les **royalties natives** via Hedera Token Service (HTS).

---

## 🔄 Comparaison des approches

### Option 1 : Royalties On-Chain (Implémentation actuelle)

**Comment ça fonctionne :**
```solidity
// Dans Marketplace.sol - fonction buyNFT()
uint256 royalty = INFTCollection(nftContract).royaltyPercentage();
uint256 royaltyAmount = (listing.price * royalty) / 100;
uint256 platformFeeAmount = (listing.price * platformFee) / 100;
uint256 sellerAmount = listing.price - royaltyAmount - platformFeeAmount;

// Transferts manuels
payable(listing.seller).transfer(sellerAmount);
payable(admin).transfer(royaltyAmount + platformFeeAmount);
```

**Avantages ✅ :**
- Contrôle total sur la logique des royalties
- Flexibilité pour changer les pourcentages
- Compatible avec n'importe quel réseau EVM
- Transparence complète dans le smart contract

**Inconvénients ❌ :**
- Coûte plus de gas (3 transferts d'HBAR)
- Plus de transactions = plus de frais
- Risque d'erreur dans les calculs manuels
- Complexité accrue du contrat

---

### Option 2 : Royalties Natives HTS (Recommandé pour Hedera)

**Comment ça fonctionne :**
```javascript
// Lors de la création de la collection NFT sur Hedera
const customRoyaltyFee = new CustomRoyaltyFee()
  .setNumerator(5) // 5%
  .setDenominator(100)
  .setFeeCollectorAccountId(royaltyReceiverAccountId)
  .setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(1)));

const nftCreateTx = await new TokenCreateTransaction()
  .setTokenName("Space Fighters NFT")
  .setTokenSymbol("SPFNFT")
  .setTokenType(TokenType.NonFungibleUnique)
  .setCustomFees([customRoyaltyFee]) // ✅ Royalties natives
  // ... autres paramètres
  .execute(client);
```

**Avantages ✅ :**
- **Automatique** - Le réseau Hedera gère les royalties
- **Immuable** - Impossible de contourner les frais
- **Efficace** - Moins de gas et de transactions
- **Fiable** - Pas d'erreurs de calcul
- **Standard** - Conforme aux meilleures pratiques Hedera
- **Coût très faible** - Hedera a des frais de transaction minimaux

**Inconvénients ❌ :**
- Moins de flexibilité (royalties fixées à la création)
- Nécessite l'utilisation du Hedera Token Service (HTS)
- Spécifique à Hedera (pas portable sur autres réseaux)

---

## 🏗️ Implémentation recommandée

### Architecture hybride (Meilleure des deux mondes)

**1. Créer la collection NFT avec HTS et royalties natives**

```javascript
import {
  TokenCreateTransaction,
  TokenType,
  CustomRoyaltyFee,
  CustomFixedFee,
  Hbar
} from "@hashgraph/sdk";

// Configuration des royalties
const royaltyFee = new CustomRoyaltyFee()
  .setNumerator(5) // 5% royalty
  .setDenominator(100)
  .setFeeCollectorAccountId("0.0.YOUR_ACCOUNT") // Compte receveur
  .setFallbackFee(
    new CustomFixedFee().setHbarAmount(new Hbar(1)) // Frais fixe si pas de vente secondaire
  );

// Création du token NFT avec royalties natives
const tokenCreateTx = await new TokenCreateTransaction()
  .setTokenName("Space Fighters Achievement NFT")
  .setTokenSymbol("SFANFT")
  .setTokenType(TokenType.NonFungibleUnique)
  .setDecimals(0)
  .setInitialSupply(0)
  .setTreasuryAccountId(treasuryAccount)
  .setSupplyType(TokenSupplyType.Infinite)
  .setSupplyKey(supplyKey)
  .setCustomFees([royaltyFee]) // ✅ Royalties natives !
  .setMaxTransactionFee(new Hbar(30))
  .freezeWith(client);

const tokenCreateSign = await tokenCreateTx.sign(treasuryKey);
const tokenCreateSubmit = await tokenCreateSign.execute(client);
const tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
const tokenId = tokenCreateRx.tokenId;

console.log(`NFT Collection created with ID: ${tokenId}`);
console.log(`Native royalties: 5% to ${royaltyFeeCollector}`);
```

**2. Simplifier le smart contract Marketplace**

```solidity
// Marketplace.sol simplifié - Pas de calcul de royalties
function buyNFT(uint256 listingId) external payable {
    Listing storage listing = listings[listingId];
    require(listing.active, "Listing not active");
    require(msg.value >= listing.price, "Insufficient payment");

    listing.active = false;
    tokenToListing[listing.tokenId] = 0;

    // Seulement les frais de plateforme (2%)
    uint256 platformFeeAmount = (listing.price * platformFee) / 100;
    uint256 sellerAmount = listing.price - platformFeeAmount;

    // Transferts simplifiés (seulement 2 au lieu de 3)
    payable(listing.seller).transfer(sellerAmount);
    payable(admin).transfer(platformFeeAmount);

    // Le transfert NFT déclenche AUTOMATIQUEMENT les royalties natives
    INFTCollection(nftContract).transferNFT(listing.tokenId, msg.sender);
    
    // ✅ Hedera prélève automatiquement 5% de royalties lors du transfert !

    emit Sold(listingId, listing.tokenId, msg.sender, listing.price);

    if (msg.value > listing.price) {
        payable(msg.sender).transfer(msg.value - listing.price);
    }
}
```

---

## 💰 Comparaison des coûts

### Scénario : Vente d'un NFT à 100 HBAR

#### **Option 1 : Royalties On-Chain**
```
Prix de vente       : 100 HBAR
Royalty (5%)        : 5 HBAR → Admin
Platform Fee (2%)   : 2 HBAR → Admin  
Vendeur reçoit      : 93 HBAR

Gas/Frais transaction :
- transferNFT       : ~0.001 HBAR
- transfer seller   : ~0.001 HBAR
- transfer admin    : ~0.001 HBAR
TOTAL frais         : ~0.003 HBAR
```

#### **Option 2 : Royalties Natives HTS**
```
Prix de vente       : 100 HBAR
Platform Fee (2%)   : 2 HBAR → Admin
Vendeur reçoit      : 98 HBAR
Royalty (5%)        : 5 HBAR → Automatique par Hedera

Gas/Frais transaction :
- transferNFT       : ~0.001 HBAR
- transfer seller   : ~0.001 HBAR
TOTAL frais         : ~0.002 HBAR

✅ 33% de réduction des frais de gas !
```

---

## 🛠️ Migration vers HTS + Royalties natives

### Étape 1 : Créer une nouvelle collection avec HTS

```javascript
// scripts/create-hts-nft-collection.js
const {
  Client,
  TokenCreateTransaction,
  TokenType,
  CustomRoyaltyFee,
  Hbar
} = require("@hashgraph/sdk");

async function createNFTCollection() {
  const client = Client.forTestnet();
  client.setOperator(process.env.OPERATOR_ID, process.env.OPERATOR_KEY);

  const royaltyFee = new CustomRoyaltyFee()
    .setNumerator(5)
    .setDenominator(100)
    .setFeeCollectorAccountId(process.env.ROYALTY_ACCOUNT);

  const tx = await new TokenCreateTransaction()
    .setTokenName("Space Fighters NFT")
    .setTokenSymbol("SFNFT")
    .setTokenType(TokenType.NonFungibleUnique)
    .setCustomFees([royaltyFee])
    .setTreasuryAccountId(process.env.TREASURY_ACCOUNT)
    .execute(client);

  const receipt = await tx.getReceipt(client);
  console.log("Token ID:", receipt.tokenId.toString());
}

createNFTCollection();
```

### Étape 2 : Adapter le frontend

```typescript
// hooks/useHederaNFT.ts
import { TokenAssociateTransaction } from "@hashgraph/sdk";

export const useHederaNFT = () => {
  const associateToken = async (accountId: string, tokenId: string) => {
    // L'utilisateur doit "associer" le token avant de le recevoir
    const tx = new TokenAssociateTransaction()
      .setAccountId(accountId)
      .setTokenIds([tokenId]);
    
    // Signer et soumettre via HashPack ou MetaMask
    return tx;
  };

  return { associateToken };
};
```

### Étape 3 : Simplifier le Marketplace

Supprimer les calculs de royalties du smart contract et laisser Hedera gérer automatiquement.

---

## ✅ Recommandation finale

### Pour votre projet Space Fighters :

**🎯 Utilisez les Royalties Natives HTS si :**
- ✅ Vous déployez exclusivement sur Hedera
- ✅ Vous voulez minimiser les coûts
- ✅ Vous voulez la sécurité maximale (immuable)
- ✅ Vous préférez la simplicité du code

**🎯 Gardez les Royalties On-Chain si :**
- ✅ Vous voulez être multi-chain (Hedera + Ethereum, etc.)
- ✅ Vous avez besoin de flexibilité sur les % de royalties
- ✅ Vous voulez un contrôle total dans le smart contract
- ✅ Les frais légèrement plus élevés ne sont pas un problème

---

## 📊 Tableau récapitulatif

| Critère | On-Chain | HTS Native |
|---------|----------|------------|
| **Coût gas** | Moyen (~0.003 HBAR) | Faible (~0.002 HBAR) |
| **Sécurité** | Bon | Excellent (immuable) |
| **Flexibilité** | Élevée | Limitée |
| **Complexité code** | Élevée | Faible |
| **Multi-chain** | ✅ Oui | ❌ Non (Hedera only) |
| **Automatique** | ❌ Non | ✅ Oui |
| **Standard Hedera** | Partiel | ✅ Complet |

---

## 🔗 Ressources

- [Hedera Token Service (HTS)](https://docs.hedera.com/hedera/sdks-and-apis/sdks/token-service)
- [Custom Fees (Royalties)](https://docs.hedera.com/hedera/sdks-and-apis/sdks/token-service/custom-token-fees)
- [NFT Guide Hedera](https://docs.hedera.com/hedera/tutorials/token/create-and-transfer-your-first-nft)

---

**💡 Conseil final :** Pour Space Fighters, commencez avec l'implémentation on-chain actuelle (qui fonctionne), puis migrez vers HTS + royalties natives lors d'une future mise à jour pour optimiser les coûts et améliorer l'expérience utilisateur.
