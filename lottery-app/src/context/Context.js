import React, { createContext, useState, useEffect } from "react";
import { 
    getMetamaskProvider, 
    getWeb3Provider, 
    connectToMetamask, 
    getAccountSigner,
    lotteryContract,
    tokenContract,
  } 
from '../apis/blockchain';

const LotteryContext = createContext();

const LotteryContextProvider = ({ children }) => {

    const [provider, setProvider] = useState(null);
    const [web3Provider, setWeb3Provider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [lottery_Contract, setLottery_Contract] = useState(null);
    const [ERC20Contract, setERC20Contract] = useState(null);
    const [address, setAddress] = useState(null);
  
    useEffect(() => {
      handleClick();
    }, []);
  
    const handleClick = async () => {
      console.log("clicked");
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

    return ( 
        <LotteryContext.Provider value={{ provider, web3Provider, signer, lottery_Contract, ERC20Contract, address, handleClick }} >
            {children}
        </LotteryContext.Provider>
    )

};

export { LotteryContext, LotteryContextProvider };
