const express = require('express');
const { ethers } = require('ethers');
const app = express();
app.use(express.json());

// Replace with your network RPC and contract addresses
const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_URL");
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

// Replace with actual contract addresses after deployment
const tokenStoreAddress = "YOUR_TOKENSTORE_ADDRESS";
const playGameAddress = "YOUR_PLAYGAME_ADDRESS";

// ABI snippets (copy full ABI from artifacts after compilation)
const tokenStoreABI = [
  "function purchase(uint256 usdtAmount) external returns (uint256)"
];
const playGameABI = [
  "function startMatch(bytes32 matchId, address player1, address player2, uint256 stakeAmount) external",
  "function submitResult(bytes32 matchId, address winner) external"
];

const tokenStore = new ethers.Contract(tokenStoreAddress, tokenStoreABI, wallet);
const playGame = new ethers.Contract(playGameAddress, playGameABI, wallet);

// Endpoint: /purchase
app.post('/purchase', async (req, res) => {
  try {
    const { buyer, usdtAmount } = req.body;
    const tx = await tokenStore.purchase(usdtAmount, { from: buyer });
    res.send({ txHash: tx.hash });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Endpoint: /match/start
app.post('/match/start', async (req, res) => {
  try {
    const { matchId, player1, player2, stakeAmount } = req.body;
    const tx = await playGame.startMatch(ethers.utils.formatBytes32String(matchId), player1, player2, stakeAmount);
    res.send({ txHash: tx.hash });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Endpoint: /match/result
app.post('/match/result', async (req, res) => {
  try {
    const { matchId, winner } = req.body;
    const tx = await playGame.submitResult(ethers.utils.formatBytes32String(matchId), winner);
    res.send({ txHash: tx.hash });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => console.log('API Gateway running on port 3000'));