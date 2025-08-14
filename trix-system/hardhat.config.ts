require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {}, // Local development network
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY", // Replace with your Infura/Alchemy key
      accounts: ["YOUR_PRIVATE_KEY"] // Replace with your wallet private key
    }
  }
};