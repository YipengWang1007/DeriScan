import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils'
import {
  deriToNatural,
  checkHttpServerIsAliveByChain,
  getChainProviderUrlByChain,
  getLatestRPCServer,
} from "./utils";

/* eslint-disable */
const CONTRACT_ABI=[{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pool","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newPool","type":"address"}],"name":"setPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
/* eslint-enable */

export class LTokenContract {
  chainId: string;
  contractAddress: string;
  providerUrl: string;
  web3: Web3;
  contract: Contract;

  constructor(chainId, contractAddress) {
    this.chainId = chainId
    this.contractAddress = contractAddress
    // this.web3 = web3Factory(chainId)
    // this.contract = new this.web3.eth.Contract(
    //   CONTRACT_ABI,
    //   this.contractAddress
    // );
  }

  _init() {
    // only use 'bsc testnet' with chainId 97
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.providerUrl));
    this.contract = new this.web3.eth.Contract(
      CONTRACT_ABI as AbiItem[],
      this.contractAddress
    );
  }

  async updateProviderUrl() {
    if (!this.providerUrl) {
      this.providerUrl = await getLatestRPCServer(getChainProviderUrlByChain(this.chainId));
      this._init();
    } else if (
      this.providerUrl &&
      !(await checkHttpServerIsAliveByChain(this.chainId, this.providerUrl))
    ) {
      this.providerUrl = await getLatestRPCServer(getChainProviderUrlByChain(this.chainId));
      this._init();
    }
  }

  async _call(method, args=[]) {
    if (!this.web3 || !this.providerUrl) {
      this.providerUrl = await getLatestRPCServer(getChainProviderUrlByChain(this.chainId));
      this._init();
    }
    const latestBlock = await this.web3.eth.getBlock('latest')
    return await this.contract.methods[method](...args).call({}, latestBlock.number);
  }

  async balance(accountAddress) {
    await this.updateProviderUrl()
    const res = deriToNatural(await this._call('balanceOf', [accountAddress]));
    return res;
  }

  async totalSupply() {
    await this.updateProviderUrl()
    const res = deriToNatural(await this._call('totalSupply'));
    return res;
  }
}
