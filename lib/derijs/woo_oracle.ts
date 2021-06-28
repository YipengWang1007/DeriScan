import {web3Factory} from './factory'
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils'

const CONTRACT_ABI=[{"inputs":[{"internalType":"address","name":"oracle_","type":"address"},{"internalType":"address","name":"token_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"_I_","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oracle","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

export class WooOracle {
  chainId: string;
  contractAddress: string;
  providerUrl: string;
  web3: Web3;
  contract: Contract;
  contractAbi: AbiItem[]
  symbol: string;

  constructor(chainId, contractAddress, symbol) {
    this.chainId = chainId
    this.contractAddress = contractAddress
    this.web3 = web3Factory(chainId)
    this.contractAbi = CONTRACT_ABI as AbiItem[];
    this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
    this.symbol = symbol
  }

  async _call(method, args=[], blockNumber='latest') {
    return await this.contract.methods[method](...args).call({}, blockNumber);
  }

  async getPrice() {
    return await this._call('_I_');
  }
}
