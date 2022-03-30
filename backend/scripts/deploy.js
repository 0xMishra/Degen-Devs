const hre = require("hardhat");
// Address of the Whitelist Contract that you deployed
const WHITELIST_CONTRACT_ADDRESS = "0x59f308c134C9c856f2558A366aE7b20678B05956";
// URL to extract Metadata for a Crypto Dev NFT
const METADATA_URL = "https://nft-collection-sneh1999.vercel.app/api/";
async function main() {
  const whitelistContract = WHITELIST_CONTRACT_ADDRESS;
  const metadataURL = METADATA_URL;
  const Degens = await hre.ethers.getContractFactory("Degens");
  const degens = await Degens.deploy(metadataURL, whitelistContract);

  await degens.deployed();

  console.log("Degens deployed to:", degens.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Degens Address: 0x59f308c134C9c856f2558A366aE7b20678B05956
