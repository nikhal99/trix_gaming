// TriX Gaming - Solana PvP Platform JavaScript

class TriXGaming {
    constructor() {
        this.wallet = null;
        this.connection = null;
        this.programId = "11111111111111111111111111111111";
        this.isConnected = false;
        this.balances = {
            sol: 0,
            usdt: 0,
            gt: 0
        };
        this.userStats = {
            totalMatches: 0,
            wins: 0,
            losses: 0,
            totalWinnings: 0,
            winRate: 0
        };
        this.activeMatches = [];
        this.matchHistory = [];
        this.pendingWinnings = 0;
        
        this.init();
    }

    async init() {
        await this.delay(100); // Small delay to ensure DOM is ready
        this.setupEventListeners();
        this.loadMockData();
        this.updateUI();
        this.startPeriodicUpdates();
        console.log('TriX Gaming initialized successfully');
    }

    setupEventListeners() {
        // Wallet connection
        const connectBtn = document.getElementById('connect-wallet');
        const disconnectBtn = document.getElementById('disconnect-wallet');
        
        if (connectBtn) connectBtn.addEventListener('click', () => this.connectWallet());
        if (disconnectBtn) disconnectBtn.addEventListener('click', () => this.disconnectWallet());

        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Token purchase
        const usdtInput = document.getElementById('usdt-amount');
        const purchaseBtn = document.getElementById('purchase-tokens');
        
        if (usdtInput) usdtInput.addEventListener('input', () => this.updateTokenPreview());
        if (purchaseBtn) purchaseBtn.addEventListener('click', () => this.purchaseTokens());

        // Match creation
        const matchIdInput = document.getElementById('match-id');
        const stakeSelect = document.getElementById('stake-amount');
        const createMatchBtn = document.getElementById('create-match-btn');
        
        if (matchIdInput) matchIdInput.addEventListener('input', () => this.updateMatchPreview());
        if (stakeSelect) stakeSelect.addEventListener('change', () => this.updateMatchPreview());
        if (createMatchBtn) createMatchBtn.addEventListener('click', () => this.createMatch());

        // Active matches
        const stakeFilter = document.getElementById('stake-filter');
        const refreshBtn = document.getElementById('refresh-matches');
        
        if (stakeFilter) stakeFilter.addEventListener('change', () => this.filterMatches());
        if (refreshBtn) refreshBtn.addEventListener('click', () => this.refreshMatches());

        // Match history
        const withdrawBtn = document.getElementById('withdraw-winnings');
        if (withdrawBtn) withdrawBtn.addEventListener('click', () => this.withdrawWinnings());

        // Modal and notifications
        const closeNotification = document.getElementById('close-notification');
        if (closeNotification) closeNotification.addEventListener('click', () => this.hideNotification());

        console.log('Event listeners setup complete');
    }

    loadMockData() {
        // Simulate some initial data for demonstration
        this.activeMatches = [
            {
                id: "MATCH001",
                creator: "7xK3...5mN9",
                creatorFull: "7xK3mV2pL8qR9sT4uW6yZ1aB3cD5fG7hJ9kL2mN4",
                stake: 10,
                status: "WaitingForPlayer",
                timestamp: Date.now() - 300000
            },
            {
                id: "MATCH002", 
                creator: "9bM1...7pQ3",
                creatorFull: "9bM1nX4rL7sU2vY5zA8cF3gH6jK9mP1qR4tW7pQ3",
                stake: 25,
                status: "WaitingForPlayer",
                timestamp: Date.now() - 150000
            },
            {
                id: "MATCH003",
                creator: "5dR8...2kL6",
                creatorFull: "5dR8eT1wQ4yU7iO0aS3fG6hJ9kL2mN5pR8tW2kL6",
                stake: 5,
                status: "Active",
                timestamp: Date.now() - 600000
            }
        ];

        this.matchHistory = [
            {
                id: "MATCH_H001",
                opponent: "8xP2...4mK9",
                opponentFull: "8xP2nR5vL1sU8iY3zA6cF9gH2jK5mP8qR1tW4mK9",
                stake: 15,
                result: "win",
                winnings: 30,
                timestamp: Date.now() - 7200000
            },
            {
                id: "MATCH_H002",
                opponent: "3fG7...9qN2",
                opponentFull: "3fG7hJ0kL3mN6pR9tW2xZ5aB8cD1eF4gH7jK9qN2",
                stake: 5,
                result: "loss",
                winnings: 0,
                timestamp: Date.now() - 10800000
            },
            {
                id: "MATCH_H003",
                opponent: "6yH4...1wE5",
                opponentFull: "6yH4jK7mP0qR3tW6xZ9aB2cD5eF8gH1jK4mN1wE5",
                stake: 20,
                result: "win",
                winnings: 40,
                timestamp: Date.now() - 14400000
            }
        ];

        // Calculate stats from history
        this.userStats.totalMatches = this.matchHistory.length;
        this.userStats.wins = this.matchHistory.filter(m => m.result === 'win').length;
        this.userStats.losses = this.userStats.totalMatches - this.userStats.wins;
        this.userStats.totalWinnings = this.matchHistory.reduce((sum, m) => sum + m.winnings, 0);
        this.userStats.winRate = this.userStats.totalMatches > 0 ? 
            ((this.userStats.wins / this.userStats.totalMatches) * 100).toFixed(1) : 0;

        // Set some pending winnings
        this.pendingWinnings = 45;

        console.log('Mock data loaded');
    }

    async connectWallet() {
        this.showLoadingModal("Connecting to wallet...");
        
        try {
            console.log('Attempting wallet connection...');
            // Simulate wallet connection delay
            await this.delay(2000);
            
            // Mock successful connection
            this.isConnected = true;
            this.wallet = {
                publicKey: "7xK3mV2pL8qR9sT4uW6yZ1aB3cD5fG7hJ9kL2mN4pR8tW"
            };

            // Mock balances
            this.balances = {
                sol: 2.45,
                usdt: 150.75,
                gt: 89.50
            };

            console.log('Wallet connected successfully');
            this.updateWalletUI();
            this.showNotification("Wallet connected successfully!", "success");
            
        } catch (error) {
            console.error('Wallet connection failed:', error);
            this.showNotification("Failed to connect wallet. Please try again.", "error");
        } finally {
            this.hideLoadingModal();
        }
    }

    async disconnectWallet() {
        this.isConnected = false;
        this.wallet = null;
        this.balances = { sol: 0, usdt: 0, gt: 0 };
        this.updateWalletUI();
        this.showNotification("Wallet disconnected", "info");
        console.log('Wallet disconnected');
    }

    updateWalletUI() {
        const connectBtn = document.getElementById('connect-wallet');
        const disconnectBtn = document.getElementById('disconnect-wallet');
        const walletInfo = document.getElementById('wallet-info');
        const connectionStatus = document.getElementById('connection-status');

        if (!connectBtn || !disconnectBtn || !walletInfo || !connectionStatus) {
            console.error('Wallet UI elements not found');
            return;
        }

        if (this.isConnected) {
            connectBtn.classList.add('hidden');
            disconnectBtn.classList.remove('hidden');
            walletInfo.classList.remove('hidden');
            connectionStatus.classList.add('hidden');

            // Update balance displays
            const solBalance = document.getElementById('sol-balance');
            const usdtBalance = document.getElementById('usdt-balance');
            const gtBalance = document.getElementById('gt-balance');

            if (solBalance) solBalance.textContent = this.balances.sol.toFixed(2);
            if (usdtBalance) usdtBalance.textContent = this.balances.usdt.toFixed(2);
            if (gtBalance) gtBalance.textContent = this.balances.gt.toFixed(2);

            // Enable form elements
            this.enableInteractions();
        } else {
            connectBtn.classList.remove('hidden');
            disconnectBtn.classList.add('hidden');
            walletInfo.classList.add('hidden');
            connectionStatus.classList.remove('hidden');

            // Disable form elements
            this.disableInteractions();
        }

        this.updateStats();
        console.log('Wallet UI updated, connected:', this.isConnected);
    }

    enableInteractions() {
        const buttons = document.querySelectorAll('.btn:not(#connect-wallet):not(#disconnect-wallet)');
        buttons.forEach(btn => {
            if (!btn.dataset.permanentlyDisabled) {
                btn.disabled = false;
            }
        });
        console.log('Interactions enabled');
    }

    disableInteractions() {
        const buttons = document.querySelectorAll('.btn:not(#connect-wallet):not(#disconnect-wallet)');
        buttons.forEach(btn => btn.disabled = true);
        console.log('Interactions disabled');
    }

    switchTab(tabName) {
        if (!tabName) {
            console.error('No tab name provided');
            return;
        }

        console.log('Switching to tab:', tabName);

        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTabBtn) {
            activeTabBtn.classList.add('active');
        }

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
            activeContent.style.display = 'block';
        } else {
            console.error('Tab content not found:', tabName);
        }

        // Refresh data for specific tabs
        if (tabName === 'active-matches') {
            this.renderActiveMatches();
        } else if (tabName === 'match-history') {
            this.renderMatchHistory();
        }

        console.log('Tab switched to:', tabName);
    }

    updateTokenPreview() {
        const usdtInput = document.getElementById('usdt-amount');
        const gtPreview = document.getElementById('gt-preview');
        const purchaseBtn = document.getElementById('purchase-tokens');

        if (!usdtInput || !gtPreview || !purchaseBtn) return;

        const usdtAmount = parseFloat(usdtInput.value) || 0;
        gtPreview.textContent = `${usdtAmount.toFixed(2)} GT`;
        
        purchaseBtn.disabled = !this.isConnected || usdtAmount <= 0 || usdtAmount > this.balances.usdt;
    }

    async purchaseTokens() {
        const usdtInput = document.getElementById('usdt-amount');
        if (!usdtInput) return;

        const usdtAmount = parseFloat(usdtInput.value);
        
        if (!this.validateTokenPurchase(usdtAmount)) {
            return;
        }

        this.setButtonLoading('purchase-tokens', true);
        this.showLoadingModal("Processing token purchase...");

        try {
            await this.delay(3000); // Simulate transaction time

            // Update balances
            this.balances.usdt -= usdtAmount;
            this.balances.gt += usdtAmount; // 1:1 exchange rate

            this.updateWalletUI();
            this.showNotification(`Successfully purchased ${usdtAmount.toFixed(2)} GT tokens!`, "success");
            
            // Reset form
            usdtInput.value = '';
            this.updateTokenPreview();

        } catch (error) {
            console.error('Token purchase failed:', error);
            this.showNotification("Transaction failed. Please try again.", "error");
        } finally {
            this.setButtonLoading('purchase-tokens', false);
            this.hideLoadingModal();
        }
    }

    validateTokenPurchase(amount) {
        if (!this.isConnected) {
            this.showNotification("Please connect your wallet first.", "error");
            return false;
        }

        if (amount <= 0) {
            this.showNotification("Please enter a valid USDT amount.", "error");
            return false;
        }

        if (amount > this.balances.usdt) {
            this.showNotification("Insufficient USDT balance.", "error");
            return false;
        }

        return true;
    }

    updateMatchPreview() {
        const matchIdInput = document.getElementById('match-id');
        const stakeSelect = document.getElementById('stake-amount');
        const createBtn = document.getElementById('create-match-btn');
        const totalEscrowEl = document.getElementById('total-escrow');
        const winnerPrizeEl = document.getElementById('winner-prize');
        
        if (!matchIdInput || !stakeSelect || !createBtn || !totalEscrowEl || !winnerPrizeEl) return;

        const matchId = matchIdInput.value;
        const stakeAmount = parseFloat(stakeSelect.value) || 0;
        
        const totalEscrow = stakeAmount * 2;
        totalEscrowEl.textContent = `${totalEscrow} GT (2 players × ${stakeAmount} GT)`;
        winnerPrizeEl.textContent = `${totalEscrow} GT (100% of escrow)`;

        const isValidMatchId = matchId.length >= 3 && !this.activeMatches.find(m => m.id === matchId);
        const hasEnoughBalance = stakeAmount <= this.balances.gt;
        
        createBtn.disabled = !this.isConnected || !isValidMatchId || stakeAmount <= 0 || !hasEnoughBalance;
    }

    async createMatch() {
        const matchIdInput = document.getElementById('match-id');
        const stakeSelect = document.getElementById('stake-amount');

        if (!matchIdInput || !stakeSelect) return;

        const matchId = matchIdInput.value;
        const stakeAmount = parseFloat(stakeSelect.value);

        if (!this.validateMatchCreation(matchId, stakeAmount)) {
            return;
        }

        this.setButtonLoading('create-match-btn', true);
        this.showLoadingModal("Creating match...");

        try {
            await this.delay(2500);

            // Create new match
            const newMatch = {
                id: matchId,
                creator: this.wallet.publicKey.slice(0, 4) + "..." + this.wallet.publicKey.slice(-4),
                creatorFull: this.wallet.publicKey,
                stake: stakeAmount,
                status: "WaitingForPlayer",
                timestamp: Date.now()
            };

            this.activeMatches.unshift(newMatch);
            
            // Update balance
            this.balances.gt -= stakeAmount;
            this.updateWalletUI();

            this.showNotification(`Match "${matchId}" created successfully!`, "success");
            
            // Reset form
            matchIdInput.value = '';
            stakeSelect.value = '';
            this.updateMatchPreview();

            // Switch to active matches tab
            this.switchTab('active-matches');

        } catch (error) {
            console.error('Match creation failed:', error);
            this.showNotification("Failed to create match. Please try again.", "error");
        } finally {
            this.setButtonLoading('create-match-btn', false);
            this.hideLoadingModal();
        }
    }

    validateMatchCreation(matchId, stakeAmount) {
        if (!this.isConnected) {
            this.showNotification("Please connect your wallet first.", "error");
            return false;
        }

        if (matchId.length < 3) {
            this.showNotification("Match ID must be at least 3 characters long.", "error");
            return false;
        }

        if (this.activeMatches.find(m => m.id === matchId)) {
            this.showNotification("Match ID already exists. Please choose a different one.", "error");
            return false;
        }

        if (stakeAmount <= 0) {
            this.showNotification("Please select a valid stake amount.", "error");
            return false;
        }

        if (stakeAmount > this.balances.gt) {
            this.showNotification("Insufficient GT token balance.", "error");
            return false;
        }

        return true;
    }

    async joinMatch(matchId) {
        const match = this.activeMatches.find(m => m.id === matchId);
        if (!match || match.status !== "WaitingForPlayer") {
            this.showNotification("Match is no longer available.", "error");
            return;
        }

        if (match.creatorFull === this.wallet.publicKey) {
            this.showNotification("You cannot join your own match.", "error");
            return;
        }

        if (match.stake > this.balances.gt) {
            this.showNotification("Insufficient GT tokens to join this match.", "error");
            return;
        }

        this.showLoadingModal("Joining match...");

        try {
            await this.delay(2000);

            // Update match status
            match.status = "Active";
            
            // Update balance
            this.balances.gt -= match.stake;
            this.updateWalletUI();

            this.showNotification(`Successfully joined match "${matchId}"!`, "success");
            this.renderActiveMatches();

        } catch (error) {
            console.error('Failed to join match:', error);
            this.showNotification("Failed to join match. Please try again.", "error");
        } finally {
            this.hideLoadingModal();
        }
    }

    filterMatches() {
        this.renderActiveMatches();
    }

    refreshMatches() {
        // Simulate getting fresh data
        this.showNotification("Matches refreshed", "info");
        this.renderActiveMatches();
    }

    renderActiveMatches() {
        const tbody = document.querySelector('#active-matches-table tbody');
        if (!tbody) return;

        const filterSelect = document.getElementById('stake-filter');
        const filter = filterSelect ? filterSelect.value : '';
        
        let matches = this.activeMatches;
        if (filter) {
            matches = matches.filter(m => m.stake == filter);
        }

        tbody.innerHTML = '';

        matches.forEach(match => {
            const row = document.createElement('tr');
            const statusClass = match.status === 'WaitingForPlayer' ? 'status-waiting' : 
                               match.status === 'Active' ? 'status-active' : 'status-completed';
            
            const canJoin = this.isConnected && 
                           match.status === 'WaitingForPlayer' && 
                           match.creatorFull !== this.wallet?.publicKey &&
                           match.stake <= this.balances.gt;

            row.innerHTML = `
                <td>${match.id}</td>
                <td>${match.creator}</td>
                <td>${match.stake} GT</td>
                <td><span class="${statusClass}">${match.status}</span></td>
                <td>
                    ${canJoin ? 
                        `<button class="btn btn--sm btn--primary" onclick="window.trixApp.joinMatch('${match.id}')">Join</button>` : 
                        `<button class="btn btn--sm btn--secondary" disabled>Unavailable</button>`
                    }
                </td>
            `;
            tbody.appendChild(row);
        });

        if (matches.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" class="text-center">No matches found</td>';
            tbody.appendChild(row);
        }
    }

    async withdrawWinnings() {
        if (this.pendingWinnings <= 0) {
            this.showNotification("No winnings to withdraw.", "info");
            return;
        }

        this.setButtonLoading('withdraw-winnings', true);
        this.showLoadingModal("Processing withdrawal...");

        try {
            await this.delay(2500);

            // Update balances
            this.balances.gt += this.pendingWinnings;
            const withdrawnAmount = this.pendingWinnings;
            this.pendingWinnings = 0;

            this.updateUI();
            this.showNotification(`Successfully withdrew ${withdrawnAmount} GT tokens!`, "success");

        } catch (error) {
            console.error('Withdrawal failed:', error);
            this.showNotification("Withdrawal failed. Please try again.", "error");
        } finally {
            this.setButtonLoading('withdraw-winnings', false);
            this.hideLoadingModal();
        }
    }

    renderMatchHistory() {
        const tbody = document.querySelector('#match-history-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.matchHistory.forEach(match => {
            const row = document.createElement('tr');
            const resultClass = match.result === 'win' ? 'result-win' : 'result-loss';
            const date = new Date(match.timestamp).toLocaleDateString();
            
            row.innerHTML = `
                <td>${match.id}</td>
                <td>${match.opponent}</td>
                <td>${match.stake} GT</td>
                <td><span class="${resultClass}">${match.result.toUpperCase()}</span></td>
                <td>${match.winnings} GT</td>
                <td>${date}</td>
            `;
            tbody.appendChild(row);
        });

        if (this.matchHistory.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" class="text-center">No match history available</td>';
            tbody.appendChild(row);
        }
    }

    updateStats() {
        const totalMatchesEl = document.getElementById('total-matches');
        const winsEl = document.getElementById('wins');
        const winRateEl = document.getElementById('win-rate');
        const totalWinningsEl = document.getElementById('total-winnings');
        const pendingWinningsEl = document.getElementById('pending-winnings');
        const withdrawBtn = document.getElementById('withdraw-winnings');

        if (totalMatchesEl) totalMatchesEl.textContent = this.userStats.totalMatches;
        if (winsEl) winsEl.textContent = this.userStats.wins;
        if (winRateEl) winRateEl.textContent = `${this.userStats.winRate}%`;
        if (totalWinningsEl) totalWinningsEl.textContent = `${this.userStats.totalWinnings} GT`;
        if (pendingWinningsEl) pendingWinningsEl.textContent = `${this.pendingWinnings.toFixed(2)} GT`;
        if (withdrawBtn) withdrawBtn.disabled = !this.isConnected || this.pendingWinnings <= 0;
    }

    updateUI() {
        this.updateWalletUI();
        this.updateStats();
        this.renderActiveMatches();
        this.renderMatchHistory();
        this.updateTokenPreview();
        this.updateMatchPreview();
    }

    startPeriodicUpdates() {
        // Update UI every 30 seconds
        setInterval(() => {
            if (this.isConnected) {
                this.simulateMatchUpdates();
                this.renderActiveMatches();
            }
        }, 30000);
    }

    simulateMatchUpdates() {
        // Randomly complete some matches
        this.activeMatches.forEach(match => {
            if (match.status === 'Active' && Math.random() > 0.7) {
                match.status = 'Completed';
                
                // Simulate win/loss (50% chance)
                if (Math.random() > 0.5) {
                    // Player wins
                    const winnings = match.stake * 2;
                    this.pendingWinnings += winnings;
                    
                    // Add to history
                    this.matchHistory.unshift({
                        id: match.id,
                        opponent: match.creator,
                        opponentFull: match.creatorFull,
                        stake: match.stake,
                        result: 'win',
                        winnings: winnings,
                        timestamp: Date.now()
                    });
                    
                    this.userStats.wins++;
                    this.userStats.totalWinnings += winnings;
                } else {
                    // Player loses
                    this.matchHistory.unshift({
                        id: match.id,
                        opponent: match.creator,
                        opponentFull: match.creatorFull,
                        stake: match.stake,
                        result: 'loss',
                        winnings: 0,
                        timestamp: Date.now()
                    });
                    
                    this.userStats.losses++;
                }

                this.userStats.totalMatches++;
                this.userStats.winRate = ((this.userStats.wins / this.userStats.totalMatches) * 100).toFixed(1);
            }
        });

        // Remove completed matches after some time
        this.activeMatches = this.activeMatches.filter(match => 
            match.status !== 'Completed' || Date.now() - match.timestamp < 60000
        );
    }

    setButtonLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const text = button.querySelector('.btn-text');
        const spinner = button.querySelector('.spinner');

        if (loading) {
            button.disabled = true;
            if (text) text.style.display = 'none';
            if (spinner) spinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            if (text) text.style.display = 'inline';
            if (spinner) spinner.classList.add('hidden');
        }
    }

    showLoadingModal(message) {
        const modal = document.getElementById('loading-modal');
        const messageEl = document.getElementById('loading-message');
        
        if (modal && messageEl) {
            messageEl.textContent = message;
            modal.classList.remove('hidden');
        }
    }

    hideLoadingModal() {
        const modal = document.getElementById('loading-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notification-message');
        
        if (notification && messageEl) {
            messageEl.textContent = message;
            notification.className = `notification status--${type}`;
            notification.classList.remove('hidden');

            // Auto-hide after 5 seconds
            setTimeout(() => {
                this.hideNotification();
            }, 5000);
        }
    }

    hideNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.add('hidden');
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global variable for the app instance
let trixApp;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing TriX Gaming...');
    trixApp = new TriXGaming();
    window.trixApp = trixApp; // Make globally available
});

// Fallback global access
window.trixApp = trixApp;