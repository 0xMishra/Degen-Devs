import { Contract, providers, utils } from "ethers";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 137) {
      window.alert("Change the network to mumbai");
      throw new Error("Change network to mumbai");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const presaleMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const txn = await whitelistContract.presaleMint({
        value: utils.parseEther("0.01"),
      });
      setLoading(true);
      await txn.wait();
      setLoading(false);
      window.alert("You minted a Degen");
    } catch (error) {
      console.log(error);
    }
  };

  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      const txn = whitelistContract.mint({
        value: utils.parseEther("0.01"),
      });
      setLoading(true);
      await txn.wait();
      setLoading(false);
      window.alert("you minted a Degen");
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.log(error);
    }
  };

  const startPresale = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const txn = await whitelistContract.startPresale();
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await checkIfPresaleStarted();
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const whitelistContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        provider
      );

      const isPresaleStarted = await whitelistContract.presaleStarted();

      if (!isPresaleStarted) {
        await getOwner();
      }
      setPresaleStarted(isPresaleStarted);
      return isPresaleStarted;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, []);
  return <div className={styles.container}></div>;
}
