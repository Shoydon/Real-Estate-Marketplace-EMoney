import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import Home from './components/Home';
import NFTs from './components/NFTs';
// import {marketplace_abi} from "./Abi.js"
import Create from './components/Create';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import 'react-toastify/dist/ReactToastify.css';
import Info from './components/Info.jsx';
// import Web3 from 'web3';
import contractData from './contract.json'
import MyBuildings from './components/MyListedBuildings.jsx';
import OwnedApartments from './components/OwnedApartments.jsx';
import ChangeNetwork from './components/ChangeNetwork.jsx';

function App() {

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [marketplace, setMarketplace]= useState({});
  const [nftitem, setNFTitem] = useState({})
  const [chainId, setChainId] = useState(null)
  const [correctNetwork, setCorrectNetwork] = useState(false)

  useEffect(() => {
    if(chainId !== 4544) {
      setCorrectNetwork(false);
    } else if (chainId === 4544) {
      setCorrectNetwork(true);
    }
  }, [chainId])

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {

        // provider.on("chainChanged", (newChain) => {
        //   setChainId(newChain);
        //   console.log(chainId);
        //   window.location.reload()
        // })

        window.ethereum.on("chainChanged", (newChain) => {
          setChainId(newChain); 
          console.log(newChain);
          console.log(chainId);
          window.location.reload()
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.href = "/"; // Redirect using window.location
          console.log(window.location);
        });

        window.onbeforeunload = function() {
          // Your custom function to run when the page is reloaded
          console.log("Page is being reloaded!");
          window.location.href = "/";
          // Add any other actions you want to perform here
        };
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const bal = Number(await signer.getBalance());
        console.log("balance: ", bal);
        setAccount(address);
        let marketplaceAddress = contractData.contractAddress;
        let marketplace_abi = contractData.contractAbi;
        console.log(address);
        

        const marketplacecontract = new ethers.Contract(
          marketplaceAddress,
          marketplace_abi,
          signer
        );
        //console.log(contract);
        setMarketplace(marketplacecontract);
        setMarketplace(marketplacecontract);
        console.log(marketplace);       
        const chain = await provider.getNetwork();
        setChainId(Number(chain.chainId))
        console.log(chainId);
        setLoading(false);
        if(chainId === 4544) {
          setCorrectNetwork(true);
        }
        // console.log(chain);
        // const web3 = new Web3(window.ethereum);
        // const contract = new web3.eth.Contract(contractData.contractABI, contractData.contractAddress);
        // console.log("contract: ", contract);
      } else {
        console.error("Metamask is not installed");
      }
    };

    provider && loadProvider();
  }, []);




  return (
    <BrowserRouter>
    <ToastContainer/>
    <div className="App min-h-screen">
      <div className='gradient-bg-welcome h-screen w-screen'>
      {!correctNetwork && <ChangeNetwork/>}
      <Nav account={account}/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        {/* <Route path="/all-nft" element={<NFTs marketplace={contract} setNFTitem={setNFTitem} />}></Route>
        <Route path="/create" element={<Create marketplace={contract}  address={account}/>}></Route> */}
        <Route path="/all-nft" element={<NFTs marketplace={marketplace} setNFTitem={setNFTitem} setMarketplace={setMarketplace} />}></Route>
        <Route path="/create" element={<Create marketplace={marketplace}  address={account} correctNetwork={correctNetwork}/>}></Route>
        <Route path="/info" element={<Info nftitem={nftitem} />}></Route>
        <Route path='/listed-buildings' element={<MyBuildings marketplace={marketplace} address={account}/>}></Route>
        <Route path='/owned-apartments' element={<OwnedApartments marketplace={marketplace}/>}></Route>
      </Routes>
      </div>
    </div>
  
    </BrowserRouter>
  );
}

export default App;
