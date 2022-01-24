import React, { useState, useEffect } from 'react';
import './App.css';
import Default from './components/Default/Default';
import Owner from './components/Owner/Owner';
import Manager from './components/Manager/Manager';
import { LotteryContext } from './context/Context';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { 
  getMetamaskProvider, 
  getWeb3Provider, 
  connectToMetamask, 
  getAccountSigner,
  lotteryContract,
  tokenContract,
  addMetamaskListeners
} 
from './apis/blockchain';
import { Button } from 'rimble-ui';

function App() {
  
  const [provider, setProvider] = useState(null);
  const [web3Provider, setWeb3Provider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [lottery_Contract, setLottery_Contract] = useState(null);
  const [ERC20Contract, setERC20Contract] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(async () => {
    handleClick();
  }, []);

  async function handleClick () {
    const provider_1 = await getMetamaskProvider();
    setProvider(provider_1);
    const web3Provider_1 = getWeb3Provider(provider_1);
    setWeb3Provider(web3Provider_1);
    connectToMetamask(web3Provider_1);
    await getAccountSigner(web3Provider_1).then((account) => {
      setSigner(account);
      const token = tokenContract(account);
      setERC20Contract(token);
      const lottery = lotteryContract(account);
      setLottery_Contract(lottery);
      account.getAddress().then((result) => setAddress(result));
    });
  }

  const chainChangedCallback = (chainID) => {
    window.location.reload();
  }
  
  const accountsChangedCallback = async (accounts) => {
    if (accounts.length == 0) {
    } else if (accounts[0] !== signer.getAddress().then((result) => {return result;})) {
      window.location.reload();      
      // handleClick();
    }
  }
  
  if (provider && signer) {
    addMetamaskListeners(provider, chainChangedCallback, accountsChangedCallback);
  }



  return (
    <LotteryContext.Provider value={{ provider, web3Provider, signer, lottery_Contract, ERC20Contract, address }}>
      <div className="header">
        <Button onClick={handleClick}>Connect</Button>
        <h2>Connected to: {address}</h2>
      </div>
      
      <Router>
          <Routes> 
              <Route exact path="/" element={<Default />}/>
              <Route path="/owner" element={<Owner />}/>
              <Route path="/manager" element={<Manager />}/>
          </Routes>
      </Router>
    </LotteryContext.Provider>
  );
}

export default App;
