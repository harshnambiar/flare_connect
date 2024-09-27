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
                rpcUrls: ['https://coston2.enosys.global/ext/C/rpc']
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
    console.log("hi");
  const account = accounts[0];
  var web3 = new Web3(window.ethereum);
  const bal = await web3.eth.getBalance(account);
  //console.log("hi");
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
                     "0x24A99A6dcFC3332443037C5a09505731312fD154");
  
  const myAddress = localStorage.getItem("acc");
  console.log('here');
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


async function updateCounter() {
  const web3 = new Web3(window.ethereum);
  const abiInstance = ABI.abi;
  const contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x24A99A6dcFC3332443037C5a09505731312fD154");
  
  const myAddress = localStorage.getItem("acc");
  contract.methods.increment()
    .send({from: myAddress})
    .catch((error) => {
        console.error('Call Error:', error);
    });
}
window.updateCounter = updateCounter;

async function resetCounter() {
  const web3 = new Web3(window.ethereum);
  web3.providers.HttpProvider.prototype.provideLegacyProvider = () => {  return {    send: (payload, callback) => {      payload.params[0].hardfork = 'london';      window.ethereum.send(payload, callback);    },    sendAsync: (payload, callback) => {      payload.params[0].hardfork = 'london';      window.ethereum.sendAsync(payload, callback);    },  };};
  const abiInstance = ABI.abi;
  const contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x24A99A6dcFC3332443037C5a09505731312fD154");

  const myAddress = localStorage.getItem("acc");
  console.log(myAddress);
  const hundredth_eth = BigInt(10000000000000000);
  const pay = web3.utils.toWei('0.01', 'ether');
  try {

    console.log(hundredth_eth);
    const res3 = await contract.methods.reset_count()
                .send({from: myAddress, value: pay, gas: '1000000', gasPrice:1000000000});
  }
  catch (err){
    console.log(err);
  }

}
window.resetCounter = resetCounter;
