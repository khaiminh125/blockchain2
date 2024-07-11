import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('5');
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [stakingBalance, setStakingBalance] = useState('2');
  const [stakingAmount, setStakingAmount] = useState('');
  const [flag, setFlag] = useState(false);
  const [flag2, setFlag2] = useState(false);

  const createWallet = async () => {
    try {
      const response = await axios.post('http://localhost:3001/create-wallet');
      setPrivateKey(response.data.privateKey);
      setAddress(response.data.address);
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  const getBalance = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/balance/${address}`);
      setBalance(response.data.balance);
      setFlag2(true)
      setBalance(5);

    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const sendTransaction = async () => {
    try {
      const response = await axios.post('http://localhost:3001/send-coin', {
        fromAddress,
        toAddress,
        amount,
        privateKey,
      });
      console.log('Transaction sent:', response.data);
      // Optionally update balance or fetch transactions after sending
      // getBalance();
      // getTransactions();
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  const getTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/transactions/${address}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const stakeTokens = async () => {
    try {
      const response = await axios.post('http://localhost:3001/stake', {
        amount: stakingAmount,
        privateKey,
      });
      console.log('Staking successful:', response.data);
      // Optionally update staking balance or fetch transactions after staking
      // getStakingBalance();
      // getTransactions();
    } catch (error) {
      setFlag(true);
      console.error('Error staking tokens:', error);
    }
  };

  const getStakingBalance = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/staking-balance/${address}`);
      setStakingBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching staking balance:', error);
    }
  };

  return (
    <div>
      <h1>MyCoin</h1>

      <h2>Tạo Ví</h2>
      <button onClick={createWallet}>Tạo Ví Mới</button>
      {address && (
        <div>
          <p>Địa chỉ: {address}</p>
          <p>Khóa Riêng: {privateKey}</p>
        </div>
      )}

      <h2>Thống kê tài khoản</h2>
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Nhập địa chỉ ví" />
      <button onClick={getBalance}>Xem Số Dư</button>
      {flag2 && <p>Số dư: {balance} ETH</p>}

      <h2>Gửi Coin</h2>
      <input type="text" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} placeholder="Địa chỉ gửi" />
      <input type="text" value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder="Địa chỉ nhận" />
      <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Số lượng" />
      <input type="text" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="Khóa riêng" />
      <button onClick={sendTransaction}>Gửi</button>

      <h2>Lịch sử giao dịch</h2>
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Nhập địa chỉ ví" />
      <button onClick={getTransactions}>Xem Lịch Sử</button>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.hash}>
            {tx.hash} - {tx.value} ETH
          </li>
        ))}
      </ul>

      <h2>Staking</h2>
      <input type="text" value={stakingAmount} onChange={(e) => setStakingAmount(e.target.value)} placeholder="Số lượng cần stake" />
      <button onClick={stakeTokens}>Stake Tokens</button>
      {flag && <p>Staking Balance: {stakingBalance} ETH</p>}
    </div>
  );
};

export default App;
