// Deploy script for MoroccanCulturalHeritage contract
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of MoroccanCulturalHeritage contract...");

  // Get the contract factory
  const MoroccanCulturalHeritage = await ethers.getContractFactory("MoroccanCulturalHeritage");

  // Deploy the contract
  console.log("📦 Deploying contract...");
  const contract = await MoroccanCulturalHeritage.deploy();

  // Wait for deployment to complete
  await contract.deployed();

  console.log("✅ MoroccanCulturalHeritage deployed to:", contract.address);
  console.log("🔗 Transaction hash:", contract.deployTransaction.hash);

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const owner = await contract.owner();
  console.log("👤 Contract owner:", owner);

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "Chain ID:", network.chainId);

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contract.address,
    transactionHash: contract.deployTransaction.hash,
    network: network.name,
    chainId: network.chainId,
    owner: owner,
    deployedAt: new Date().toISOString(),
    blockNumber: contract.deployTransaction.blockNumber
  };

  console.log("\n📋 Deployment Summary:");
  console.log("Contract Address:", deploymentInfo.contractAddress);
  console.log("Network:", deploymentInfo.network);
  console.log("Chain ID:", deploymentInfo.chainId);
  console.log("Owner:", deploymentInfo.owner);
  console.log("Deployed At:", deploymentInfo.deployedAt);

  // Save to file for reference
  const fs = require('fs');
  const path = require('path');
  
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `${network.name}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", deploymentFile);

  // Instructions for next steps
  console.log("\n🎯 Next Steps:");
  console.log("1. Update your .env.local file with:");
  console.log(`   SMART_CONTRACT_ADDRESS=${contract.address}`);
  console.log("2. Add authorized verifiers using addVerifier()");
  console.log("3. Add museum curators using addCurator()");
  console.log("4. Test the contract functions");

  return contract.address;
}

// Handle errors
main()
  .then((address) => {
    console.log(`\n🎉 Deployment completed successfully!`);
    console.log(`📍 Contract Address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 