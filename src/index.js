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
  const abi = await fetchAbi();
  //console.log(abi);
  const w3 = new Web3("https://coston2-api.flare.network/ext/C/rpc");
  const cnt = new w3.eth.Contract(abi, "0x24A99A6dcFC3332443037C5a09505731312fD154");
  const myAddress = localStorage.getItem("acc");
  //console.log(myAddress);
  const res = await cnt.methods.fetch().call();
  console.log("Counter: ", res);

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
  const abiInstance = await fetchAbi();
  console.log(abiInstance);
    const myAddress = localStorage.getItem("acc");
  //const abiInstance = ABI.abi;
  const contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x24A99A6dcFC3332443037C5a09505731312fD154");


  const hundredth_eth = BigInt(10000000000000000);
  const pay = web3.utils.toWei('0.01', 'ether');
  try {

    console.log(hundredth_eth);
    const res3 = await contract.methods.reset_count()
                .send({from: myAddress, value: pay, gas: '1000000', gasPrice:100000000});
  }
  catch (err){
    console.log(err);
  }

}
window.resetCounter = resetCounter;


async function fetchAbi(){
  const base_url = "https://coston2-explorer.flare.network/api";
  const params =
    "?module=contract&action=getabi&address=0x24A99A6dcFC3332443037C5a09505731312fD154";
  const response = await fetch(base_url + params);
  const abi = JSON.parse((await response.json())["result"]);
  return abi;
}
