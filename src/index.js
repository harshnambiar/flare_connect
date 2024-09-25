import detectEthereumProvider from "@metamask/detect-provider"
import Web3 from "web3"; 
import ABI from './abi.json'

async function connect(code) {
    
  const provider = await detectEthereumProvider()

  if (provider && provider === window.ethereum) {
    console.log("MetaMask is available!");
    const chainId = 114;
    console.log(window.ethereum.networkVersion);
    if (window.ethereum.networkVersion !== chainId) {
        const cid = '0x72';
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: cid }]
        });
        console.log("changed to flare testnet successfully");
        
      } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
        console.log("please add Flare Coston Testnet as a network");
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'Flare Testnet Coston2',
                chainId: cid,
                nativeCurrency: { name: 'FLARE', decimals: 18, symbol: 'C2FLR' },
                rpcUrls: ['https://coston2-api.flare.network/ext/C/rpc']
              }
            ]
          });
        }
        else {
            console.log(err);
        }
      }
    }
    await startApp(provider);
  } else {
    console.log("Please install MetaMask!")
  }



}
window.connect = connect;


async function startApp(provider) {
  if (provider !== window.ethereum) {
    console.error("Do you have multiple wallets installed?")
  }
  else {
    const accounts = await window.ethereum
    .request({ method: "eth_requestAccounts" })
    .catch((err) => {
      if (err.code === 4001) {
        console.log("Please connect to MetaMask.")
      } else {
        console.error(err)
      }
    })
  const account = accounts[0];
  var web3 = new Web3(window.ethereum);
  const bal = await web3.eth.getBalance(account);
  console.log(bal);
  console.log(account);
  localStorage.setItem("acc",account.toString());
  }
}


async function callContract() {
  const web3 = new Web3(window.ethereum);
  const abiInstance = ABI.abi;
  const contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xB54A1384d573fb5e5A304dDD4df08E2099E5130D");
  
  const myAddress = localStorage.getItem("acc");
  contract.methods.fetch()
    .call({from: myAddress})
    .then((result) => {
        console.log('Return Value:', result);
    })
    .catch((error) => {
        console.error('Call Error:', error);
    });
}
window.callContract = callContract;


async function updateContract() {
  const web3 = new Web3(window.ethereum);
  const abiInstance = ABI.abi;
  const contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xB54A1384d573fb5e5A304dDD4df08E2099E5130D");
  
  const myAddress = localStorage.getItem("acc");
  contract.methods.increment()
    .send({from: myAddress})
    .catch((error) => {
        console.error('Call Error:', error);
    });
}
window.updateContract = updateContract;
