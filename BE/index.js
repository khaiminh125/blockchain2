const express = require('express');
const Web3 = require('web3');
const ganache = require('ganache-cli');
const cors = require('cors');

const app = express();
const port = 3001;

const provider = ganache.provider();
const web3 = new Web3(provider);

app.use(cors());
app.use(express.json());

// Assuming you have a deployed staking contract at `stakingContractAddress`
const stakingContractAddress = '0x...'; // Replace with your actual contract address

// Example staking contract ABI (replace with your actual ABI)
const stakingContractABI = [
  // ABI definition here
];

// Endpoint to create a new wallet
app.post('/create-wallet', (req, res) => {
  const account = web3.eth.accounts.create();
  res.json(account);
});

// Endpoint to get balance of an address
app.get('/balance/:address', async (req, res) => {
  try {
    const balance = await web3.eth.getBalance(req.params.address);
    res.json({ balance: web3.utils.fromWei(balance, 'ether') });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to send coins
app.post('/send-coin', async (req, res) => {
  try {
    const { fromAddress, toAddress, amount, privateKey } = req.body;
    const value = web3.utils.toWei(amount, 'ether');
    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: toAddress,
        value,
        gas: 2000000,
      },
      privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    res.json(receipt);
   

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to stake tokens
app.post('/stake', async (req, res) => {
  try {
    const { amount, privateKey } = req.body;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    // Approve tokens for staking (if needed)
    // Example: await tokenContract.methods.approve(stakingContractAddress, amount).send({ from: account.address });

    // Stake tokens
    const stakingContract = new web3.eth.Contract(stakingContractABI, stakingContractAddress);
    const result = await stakingContract.methods.stake(amount).send({ from: account.address });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to withdraw stakes
app.post('/withdraw', async (req, res) => {
  try {
    const { amount, privateKey } = req.body;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    // Withdraw stakes
    const stakingContract = new web3.eth.Contract(stakingContractABI, stakingContractAddress);
    const result = await stakingContract.methods.withdraw(amount).send({ from: account.address });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to check staking balance
app.get('/staking-balance/:address', async (req, res) => {
  try {
    const accountAddress = req.params.address;
    const stakingContract = new web3.eth.Contract(stakingContractABI, stakingContractAddress);

    const balance = await stakingContract.methods.stakingBalance(accountAddress).call();
    res.json({ balance: web3.utils.fromWei(balance, 'ether') });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to claim staking rewards
app.post('/claim-rewards', async (req, res) => {
  try {
    const { privateKey } = req.body;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    const stakingContract = new web3.eth.Contract(stakingContractABI, stakingContractAddress);
    const result = await stakingContract.methods.claimRewards().send({ from: account.address });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to simulate transaction history (using mock data since Ganache doesn't provide real transaction history)
app.get('/transactions/:address', async (req, res) => {
  try {
    const address = req.params.address;
    // Mock transaction history
    const transactions = [
      { hash: '0x23498234', value: '2' },

    ];
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
