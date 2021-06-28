import Web3 from 'web3';
import { bg } from './utils';
import {web3Factory} from './factory'
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils'

/* eslint-disable */
const CONTRACT_ABI=[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldController","type":"address"},{"indexed":false,"internalType":"address","name":"newController","type":"address"}],"name":"ChangeController","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"controller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newController","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
/* eslint-enable */

export class DeriContract {
  chainId: string;
  contractAddress: string;
  web3: Web3;
  contract: Contract;

  constructor(chainId, contractAddress) {
    this.chainId = chainId
    this.contractAddress = contractAddress
    this.web3 = web3Factory(chainId)
    this.contract = new this.web3.eth.Contract(
      CONTRACT_ABI as AbiItem[],
      this.contractAddress
    );
  }

  async _call(method, args=[]) {
    const latestBlock = await this.web3.eth.getBlock('latest')
    return await this.contract.methods[method](...args).call({}, latestBlock.number);
  }

  async decimals() {
    return await this._call('decimals');
  }

  async _balance(address) {
    return await this._call('balanceOf', [address]);
  }

  async balance(address) {
    const [res, decimals] = await Promise.all([
      this._balance(address),
      this.decimals(),
    ]);
    return bg(res, -decimals);
  }

  async getBlockInfo(blockNumber) {
    return await this.web3.eth.getBlock(blockNumber);
  }
  async getPastEvents(eventName, filter = {}, fromBlock = 0, to = 0) {
    let events = [];
    //let toBlock = await this._getBlockInfo("latest");
    let amount
    if (this.chainId === '56') {
      amount = 999
    } else {
      amount = 4999
    }
    if ((fromBlock + amount) > to) {
      amount = to - fromBlock
    }

    while (fromBlock <= to) {
      console.log('--- from', fromBlock, to)
      let es = await this.contract.getPastEvents(eventName, {
        filter: filter,
        fromBlock: fromBlock,
        toBlock: fromBlock + amount,
      });
      for (let e of es) {
        events.push(e);
      }
      fromBlock += amount + 1;
      if ((fromBlock + amount) > to) {
        amount = to - fromBlock
      }
    }
    return events;
  }
}
