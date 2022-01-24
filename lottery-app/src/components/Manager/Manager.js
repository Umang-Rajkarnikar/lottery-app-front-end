import React, { useState, useContext } from 'react';
import styles from './Manager.module.css';
import { Button } from 'rimble-ui';
import { LotteryContext } from '../../context/Context';
import { useNavigate } from "react-router-dom";

const Manager = () => {
  let navigate = useNavigate();
  const blockchain = useContext(LotteryContext);
  const { provider, web3Provider, signer, lottery_Contract, ERC20Contract, address } = blockchain;
  const [error, setError] = useState("");

  // Go to customer page if MetaMask user is not the manager
  const checkManager = async () => {
    if(await lottery_Contract.isManager(address) === false) {
      navigate('/');
    }
  }
  checkManager();

  // Pick winner
  async function pickWinner () {      
    await lottery_Contract.pickWinner();
  }

  // Go to customer page
  function goToCustomerPage () {
    if(address){
      navigate('/');
    } else {
      alert("Error");
    }
  }

  return (
  
    <div className={styles.customerContainer}>
        <div className={styles.buttons}>
            <Button onClick={goToCustomerPage}>Customer Page</Button>
            <Button onClick={pickWinner}>Pick Winner</Button>
        </div>
    </div>

  );
};

export default Manager;
