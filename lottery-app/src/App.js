import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import Default from './components/Default/Default';
import Owner from './components/Owner/Owner';
import Manager from './components/Manager/Manager';
import { LotteryContextProvider, LotteryContext } from './context/Context';
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

const App = () => {
  return (
    <LotteryContextProvider>
      <Main />
    </LotteryContextProvider>  
  );
}

function Main() {
  const { address, handleClick } = useContext(LotteryContext);
  return (
      <Router>
        <div className="header">
          <Button onClick={handleClick}>Connect</Button>
          <h2>Connected to: {address}</h2>
        </div>
        <Routes> 
            <Route exact path="/" element={<Default />}/>
            <Route path="/owner" element={<Owner />}/>
            <Route path="/manager" element={<Manager />}/>
        </Routes>
      </Router>
  );
}

export default App;
