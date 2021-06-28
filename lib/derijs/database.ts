import Web3 from 'web3';
import { getDBProviderUrlsConfig } from './config'
import {
  getLatestRPCServer,
  checkHttpServerIsAlive,
} from "./utils";
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils'

// abi
const DB_CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"newController","type":"address"}],"name":"addController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"controllers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"data","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"oldController","type":"address"}],"name":"delController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"keys","type":"string[]"}],"name":"getValues","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"key","type":"string"},{"internalType":"bytes32","name":"value","type":"bytes32"}],"internalType":"structDatabase.Params1[]","name":"pairs","type":"tuple[]"}],"name":"setValues","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const GAS_LIMIT_REGEX = /gas limit is too low\. Need at least (\d+)/

export class DatabaseContract {
  providerUrl: string;
  contractAddress: string;
  accountAddress: string;
  privateKey: string;
  web3: Web3;
  contract: Contract;
  gasCoefficient: number;
  lastGasCached: number;

  constructor(contractAddress, providerUrl='') {
    console.log(`== database: ${contractAddress} ==`)
    this.providerUrl = providerUrl
    this.contractAddress = contractAddress
    this.gasCoefficient = 1.5
    if (this.providerUrl) {
      this._init()
    }
  }
  setAccount(accountAddress) {
    this.accountAddress = accountAddress
    return this
  }
  setPrivateKey(privateKey) {
    this.privateKey= privateKey
    return this
  }
  resetGasCoefficient() {
    this.gasCoefficient = 1.5
  }
  _init() {
    // only use 'bsc testnet' with chainId 97
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.providerUrl));
    this.contract = new this.web3.eth.Contract(
      DB_CONTRACT_ABI as AbiItem[],
      this.contractAddress,
    );
  }

  async updateProviderUrl() {
    if (!this.providerUrl) {
      this.providerUrl = await getLatestRPCServer(getDBProviderUrlsConfig());
      this._init();
    } else if (
      this.providerUrl &&
      !(await checkHttpServerIsAlive(this.providerUrl))
    ) {
      this.providerUrl = await getLatestRPCServer(getDBProviderUrlsConfig());
      this._init();
    }
  }

  setProviderUrl (url) {
    this.providerUrl = url
    this._init()
    return this
  }

  async getValues(keyArray) {
    await this.updateProviderUrl();
    let res
    try {
      res = await this.contract.methods.getValues(keyArray).call();
    } catch (err) {
      this.providerUrl = null
      throw new Error(`database getValues(): ${err}`)
    }
    return res
  }
  async getTransactionCount (address) {
    return await this.web3.eth.getTransactionCount(address);
  }
  async setValues(keyPairArray) {
    await this.updateProviderUrl()
    const gasLimit = 681818
    let gas = 0;
    if (this.lastGasCached) {
      gas = this.lastGasCached
    } else {
      for (let i = 0; i<20; i++) {
        try {
          gas = await this.contract.methods.setValues(keyPairArray).estimateGas({from: this.accountAddress})
          gas = gas * this.gasCoefficient
          break;
        } catch(err) {
          console.log(err)
        }
      }
      if (gas === 0) gas = gasLimit
      if (gas > gasLimit) gas = gasLimit
    }
    console.log('gas', gas)

    let tx = {
      from: this.accountAddress,
      to: this.contractAddress,
      gas: gas,
      value: 0,
      data: this.contract.methods.setValues(keyPairArray).encodeABI(),
    }
    await this.web3.eth.accounts.signTransaction(tx, this.privateKey).then(signedTx => {
      return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    }).catch(err => {
      //console.log(`caught db set error: ${err}`)
      if (err.toString().includes('gas limit is too low')) {
        const res = GAS_LIMIT_REGEX.exec(err.toString())
        if (res && res[1]) {
          this.lastGasCached = parseInt(res[1])
        } else {
          this.gasCoefficient += 0.1
        }
      }
      throw err
    })
    //return await this.contract.methods.setValues(keyPairArray).send({from: this.accountAddress, gas:gas });
  }
}
