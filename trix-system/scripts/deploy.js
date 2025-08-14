const hre = require("hardhat");

async function main() {
  // Deploy GameToken
  const GameToken = await hre.ethers.getContractFactory("GameToken");
  const gameToken = await GameToken.deploy();
  await gameToken.deployed();
  console.log("GameToken deployed to:", gameToken.address);

  // Deploy TokenStore (replace with actual USDT address for your network)
  const usdtAddress = "0xYOUR_USDT_ADDRESS_HERE"; // Replace with actual USDT address
  const TokenStore = await hre.ethers.getContractFactory("TokenStore");
  const tokenStore = await TokenStore.deploy(usdtAddress, gameToken.address);
  await tokenStore.deployed();
  console.log("TokenStore deployed to:", tokenStore.address);

  // Grant MINTER_ROLE to TokenStore in GameToken
  const minterRole = await gameToken.MINTER_ROLE();
  await gameToken.grantRole(minterRole, tokenStore.address);
  console.log("Minter role granted to TokenStore");

  // Deploy PlayGame
  const PlayGame = await hre.ethers.getContractFactory("PlayGame");
  const playGame = await PlayGame.deploy(gameToken.address);
  await playGame.deployed();
  console.log("PlayGame deployed to:", playGame.address);

  // Grant API_GATEWAY_ROLE to your API Gateway address (replace with actual address)
  const apiGatewayAddress = "0xYOUR_API_GATEWAY_ADDRESS_HERE"; // Replace with actual address
  const apiGatewayRole = await playGame.API_GATEWAY_ROLE();
  await playGame.grantRole(apiGatewayRole, apiGatewayAddress);
  console.log("API Gateway role granted");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});