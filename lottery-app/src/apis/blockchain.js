import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import LotteryAbi from '../abis/Lottery.json';
import ERC20Abi from '../abis/ERC20.json';
import { LotteryAddress, ERC20Address } from '../constants/addresses';

export const getWeb3Provider = (provider) => {
  if (provider) {
    return new ethers.providers.Web3Provider(provider);
  } else {
    return null;
  }
};
 
export const getMetamaskProvider = async () => {
  const provider = await detectEthereumProvider();
  if (provider) {
    return provider;
  } else {
    return null;
  }
};
 
export const isMetamaskConnected = async (provider) => {
  return provider.isConnected();
};
 
export const addMetamaskListeners = (
  provider,
  chainChangedCallback,
  accountsChangedCallback
) => {
  provider.on('chainChanged', (chainId) => {
    chainChangedCallback(chainId);
  });
//   provider.on('message', (message) => {
//     messageCallback(message);
//   });
  provider.on('accountsChanged', (accounts) => {
    accountsChangedCallback(accounts);
  });
};
 
export const getAccountSigner = async (web3Provider) => {
  return await web3Provider.getSigner();
};
 
export const weiToEth = (weiBalance) => {
  return ethers.utils.formatEther(weiBalance);
};
 
export const ethToWei = (ethBalance) => {
  return ethers.utils.parseEther(ethBalance);
};
 
export const formatUnits = (weiBalance, decimals) => {
  return ethers.utils.formatUnits(weiBalance, decimals);
};
 
export const connectToMetamask = (web3Provider) => {

    try {
        web3Provider.send('eth_requestAccounts');
    } catch (error) {
        console.log(error);
    }
};

export const lotteryContract = (signer) => {
    return new ethers.Contract(LotteryAddress, LotteryAbi, signer);
}

export const tokenContract = (signer) => {
    return new ethers.Contract(ERC20Address, ERC20Abi, signer);
}