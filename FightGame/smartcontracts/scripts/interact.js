const hre = require('hardhat');
const deployed = require('../deployed-contracts.json');

async function main() {
  console.log('Using network:', hre.network.name);

  // Get signer (the private key set in .env as HEDERA_PRIVATE_KEY)
  const [signer] = await hre.ethers.getSigners();
  console.log('Signer address:', signer.address);

  // Get contract instances by address
  const nft = await hre.ethers.getContractAt('NFTCollection', deployed.NFTCollection, signer);
  const marketplace = await hre.ethers.getContractAt('Marketplace', deployed.Marketplace, signer);
  const leaderboard = await hre.ethers.getContractAt('Leaderboard', deployed.Leaderboard, signer);
  const verifier = await hre.ethers.getContractAt('AchievementVerifier', deployed.AchievementVerifier, signer);

  console.log('\n--- READ: sample calls ---');
  // Read an achievement
  const achievement = await nft.getAchievement(1);
  console.log('Achievement[1]:', achievement);

  // Read nextTokenId / royaltyPercentage
  try {
    const nextTokenId = await nft.nextTokenId();
    const royalty = await nft.royaltyPercentage();
    console.log('nextTokenId:', nextTokenId.toString(), 'royalty%:', royalty.toString());
  } catch (e) {
    console.warn('Could not read some public vars:', e.message);
  }

  console.log('\n--- WRITE: sample mint (only admin) ---');
  // IMPORTANT: mintNFT has modifier onlyAdmin — signer must be the admin/deployer
  // mintNFT(address player, uint256 achievementId, string metadataURI, bytes signature)
  const player = signer.address; // for test we mint to ourselves
  const achievementId = 1;
  const metadataURI = 'ipfs://test-metadata';
  const fakeSignature = '0x01'; // contract only checks length > 0 for demo

  try {
    const tx = await nft.mintNFT(player, achievementId, metadataURI, fakeSignature);
    console.log('Mint tx sent, hash:', tx.hash);
    await tx.wait();
    console.log('Mint transaction confirmed');

    const ownerTokens = await nft.getOwnerTokens(player);
    console.log('Owner tokens for', player, ':', ownerTokens.map(t => t.toString()));
  } catch (err) {
    console.error('Mint failed (likely signer not admin or insufficient gas/funds):', err.message || err);
  }

  console.log('\n--- Marketplace sample (create listing) ---');
  // Example: create a listing (requires token ownership)
  try {
    // Use a tokenId from ownerTokens if minted above
    const ownerTokens = await nft.getOwnerTokens(player);
    if (ownerTokens.length > 0) {
      const tokenId = ownerTokens[0];
      const price = hre.ethers.parseEther ? hre.ethers.parseEther('0.01') : hre.ethers.utils.parseEther('0.01');
      const listingTx = await marketplace.createListing(tokenId, price);
      console.log('Listing tx:', listingTx.hash);
      await listingTx.wait();
      console.log('Listing created for token', tokenId.toString());
    } else {
      console.log('No tokens to list for', player);
    }
  } catch (err) {
    console.error('Listing failed:', err.message || err);
  }

  console.log('\n--- Verifier sample (checkAchievement) ---');
  try {
    const has = await verifier.checkAchievement(signer.address, 1);
    console.log('checkAchievement for player:', has);
  } catch (err) {
    console.error('Verifier read failed:', err.message || err);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
