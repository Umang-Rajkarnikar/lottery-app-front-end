import React, { useState, useContext } from 'react';
import styles from './Owner.module.css';
import { Button } from 'rimble-ui';
import { 
    ethToWei
} 
from '../../apis/blockchain';
import { LotteryContext } from '../../context/Context';
import { useNavigate } from "react-router-dom";
import { DEFAULT_ADMIN_ROLE } from '../../constants/addresses';

const Owner = () => {
  let navigate = useNavigate();
  const [manager, setManager] = useState("");
  const [ticketPrice, setTicketPrice] = useState(0);
  const blockchain = useContext(LotteryContext);
  const { provider, web3Provider, signer, lottery_Contract, ERC20Contract, address } = blockchain;
  const [error, setError] = useState("");

  // Check if account connected on MetaMask is the owner
  // If not, go to customer page
  const checkOwner = async () => {
    if(await lottery_Contract.hasRole(DEFAULT_ADMIN_ROLE, address) === false) {
      navigate('/');
    }
  }
  checkOwner();
  
  // Adds a manager
  async function onSubmitAddManager (e) {
    e.preventDefault();
    try {
      if (manager.trim() !== "") {
        setError("");
        await lottery_Contract.setManager(manager);
      } else {
        setError("Please enter an appropriate value")
      }  
    } catch (error) {
      setError(error);
    }
    
  }

  // Removes a manager
  async function onSubmitRemoveManager (e) {
    e.preventDefault();
    try {
      if (manager.trim() !== "") {
        setError("");
        await lottery_Contract.removeManager(manager);
      } else {
        setError("Please enter an appropriate value")
      }  
    } catch (error) {
      setError(error);
    }
    
  }

  // Sets new ticket price  
  async function setPrice (e) {
    e.preventDefault();
    try {
      if (ticketPrice > 0) {
        setError("");
        await lottery_Contract.setTicketPrice(ethToWei(ticketPrice));
      } else {
        setError("Please enter an appropriate value")
      }  
    } catch (error) {
      setError(error);
    }  
  }

  // Picks winner
  async function pickWinner () {      
    await lottery_Contract.pickWinner();
  }

  // Withdraw fees
  async function withdrawFees () {      
    await lottery_Contract.withdraw();
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
          <Button onClick={withdrawFees}>Withdraw Fees</Button>
        </div>
        <form className={styles.form}>
          <h4>Adding a New Manager</h4>
          <div>
            <label>
              Type manager address
            </label>
            <input 
              className={styles.input}
              onChange={event =>setManager(event.target.value)}
            />
          </div>
          <Button onClick={onSubmitAddManager}>Add manager</Button>
        </form>

        <form className={styles.form}>
          <h4>Removing a New Manager</h4>
          <div>
            <label>
              Type manager address
            </label>
            <input 
              className={styles.input}
              onChange={event =>setManager(event.target.value)}
            />
          </div>
          <Button onClick={onSubmitRemoveManager}>Remove manager</Button>
        </form>
        <form className={styles.form}>
          <h4>Set New Price</h4>
          <div>
            <label>
              Enter new ticket price (MOK Tokens):
            </label>
            <input 
              className={styles.input}
              onChange={event => setTicketPrice(event.target.value)}
            />
          </div>
          <Button onClick={setPrice}>Set ticket price</Button>
        </form>
        {/* <Button onClick={getPrice}>Get ticket price</Button> */}
    </div>

  );
};

export default Owner;
