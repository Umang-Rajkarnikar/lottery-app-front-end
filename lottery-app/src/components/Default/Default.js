import React, { useState, useContext } from 'react';
import styles from './Default.module.css';
import { Button } from 'rimble-ui';
import { 
  weiToEth,
  ethToWei,
} 
from '../../apis/blockchain';
import { LotteryContext } from '../../context/Context';
import { LotteryAddress, DEFAULT_ADMIN_ROLE } from '../../constants/addresses';
import { useNavigate } from "react-router-dom";
const Customer = () => {
  
  let navigate = useNavigate();
  const [pool, setPool] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [error, setError] = useState("");
  const [ticketPrice, setTicketPrice] = useState(0);
  const blockchain = useContext(LotteryContext);
  const { provider, web3Provider, signer, lottery_Contract, ERC20Contract, address } = blockchain;
  
  // Get and set current ticket price and lottery prize
  if (lottery_Contract){
    lottery_Contract.getPrice().then((result) => {
      setTicketPrice(weiToEth(parseInt(result._hex).toString()));
    });       
    lottery_Contract.sales().then((result) => {
      setPool(weiToEth((parseInt(result._hex)*.95).toString()));
    });      
  }

  // Enter ticket
  async function onSubmit (e) {
    e.preventDefault();
    try {
      if (tickets > 0) {
        setError("");     
        await ERC20Contract.approve(LotteryAddress, ethToWei("1000000"))
          .then(async () => {
            await lottery_Contract.enter(tickets);
          });
      } else {
        setError("Please enter an appropriate value")
      }  
    } catch (error) {
      setError(error);
    }
    
  }

  // Go to customer page if MetaMask account is not the owner
  async function goToOwnerPage () {
    if(address && await lottery_Contract.hasRole(DEFAULT_ADMIN_ROLE, address)){
      navigate('/owner');
    } else {
      alert("You are not the owner.");
    }
  }

  async function goToManagerPage () {
    if(address && await lottery_Contract.isManager(address)){
      navigate('/manager');
    } else {
      alert("You are not a manager.");
    }
  }

  return (
    <div className={styles.customerContainer}>
      <div className={styles.buttons}>
        <Button onClick={goToOwnerPage}>Owner Page</Button>
        <Button onClick={goToManagerPage}>Manager Page</Button>
      </div>
      <div className={styles.content}>
        <h1>Price per ticket: {ticketPrice} MOK Tokens</h1>
        <h1>Current Jackpot: {pool} MOK Tokens</h1>
      </div>
      <form className={styles.form}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>
              Enter number of tickets you wish to purchase:
            </label>
            <input 
              className={styles.input}
              value={tickets}
              onChange={event =>setTickets(event.target.value)}
            />
          </div>
          <h3>{error}</h3>
          <Button onClick={onSubmit}>Enter</Button>
      </form>
    </div>
  );
};

export default Customer;
