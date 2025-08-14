# 🎮 TriX Gaming DApp

TriX Gaming DApp is a **simulated Web3 PvP betting platform** where players stake GT tokens, join or create matches, and compete for winnings. Matches auto-complete, and winners are randomly selected by the system.  
This project demonstrates **blockchain-inspired game logic** with wallet integration, token staking, and live updates, all running in a browser environment.

---
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6acdaea2-0496-47da-8636-eec997dca5bc" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b512f6a0-ba06-40b3-a9e8-3ad3a941bdb8" />



## 📌 Features

- **Wallet Integration** – Connect using MetaMask or simulated Web3 wallet.
- **Create & Join Matches** – Stake GT tokens and challenge opponents.
- **Automated Match Resolution** – Matches complete automatically after a countdown.
- **Random Winner Selection** – No skill involved; outcomes are fair and unbiased.
- **Winnings System** – Pending winnings can be withdrawn to the GT token balance.
- **Leaderboard** – Tracks top players by total winnings.
- **Responsive UI** – Built with HTML, CSS, and JavaScript.

---

## 🕹 How to Play

1. **Connect Your Wallet**  
   Click the “Connect Wallet” button to link MetaMask (or simulated wallet).

2. **Create or Join a Match**  
   - Enter a stake amount (in GT tokens).
   - Provide an opponent’s wallet address (optional).
   - Or join an existing match from the **Ongoing Matches** list.

3. **Wait for Match Completion**  
   - Matches auto-complete after a fixed timer.
   - The winner is randomly selected by the DApp logic.

4. **Withdraw Winnings**  
   - If you win, your stake × 2 will be added to your **Pending Winnings**.
   - Withdraw winnings to your GT token balance using the **Withdraw** button.

5. **Check the Leaderboard**  
   See where you rank among top players.

---

## ⚙️ Technical Approach

This DApp is **off-chain simulated**, meaning:
- No actual blockchain smart contract is deployed.
- The logic runs entirely in the browser via **JavaScript**.
- Wallet interactions are simulated for demonstration purposes.

The **random winner generation** uses JavaScript’s randomization, ensuring fairness within the simulation.

---

## 🏗 Architecture

```plaintext
+---------------------+
|     UI Layer        |
| (HTML + CSS)        |
|  - index.html       |
|  - style.css        |
+---------------------+
           |
           v
+---------------------+
|  Game Logic Layer   |
| (JavaScript - app.js)|
|  - Wallet simulation|
|  - Match creation   |
|  - Match joining    |
|  - Timer handling   |
|  - Random winner    |
|  - Winnings system  |
|  - Leaderboard      |
+---------------------+
           |
           v
+---------------------+
|  Data Management    |
|  (Local Storage)    |
|  - Store balances   |
|  - Store matches    |
|  - Store leaderboard|
+---------------------+



