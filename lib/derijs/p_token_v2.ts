import { deriToNatural } from "./utils";
import {web3Factory} from './factory'
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils'

const POOL_ABI = [ { "inputs": [ { "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" }, { "internalType": "uint256", "name": "numSymbols_", "type": "uint256" }, { "internalType": "uint256", "name": "numBTokens_", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "bTokenId", "type": "uint256" }, { "indexed": false, "internalType": "int256", "name": "amount", "type": "int256" } ], "name": "UpdateMargin", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "symbolId", "type": "uint256" }, { "indexed": false, "internalType": "int256", "name": "volume", "type": "int256" }, { "indexed": false, "internalType": "int256", "name": "cost", "type": "int256" }, { "indexed": false, "internalType": "int256", "name": "lastCumulativeFundingRate", "type": "int256" } ], "name": "UpdatePosition", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "exists", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "getApproved", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "bTokenId", "type": "uint256" } ], "name": "getMargin", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "getMargins", "outputs": [ { "internalType": "int256[]", "name": "", "type": "int256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "symbolId", "type": "uint256" } ], "name": "getPosition", "outputs": [ { "components": [ { "internalType": "int256", "name": "volume", "type": "int256" }, { "internalType": "int256", "name": "cost", "type": "int256" }, { "internalType": "int256", "name": "lastCumulativeFundingRate", "type": "int256" } ], "internalType": "struct IPToken.Position", "name": "", "type": "tuple" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "getPositions", "outputs": [ { "components": [ { "internalType": "int256", "name": "volume", "type": "int256" }, { "internalType": "int256", "name": "cost", "type": "int256" }, { "internalType": "int256", "name": "lastCumulativeFundingRate", "type": "int256" } ], "internalType": "struct IPToken.Position[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "numBTokens", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "numSymbols", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pool", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "num", "type": "uint256" } ], "name": "setNumBTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "num", "type": "uint256" } ], "name": "setNumSymbols", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newPool", "type": "address" } ], "name": "setPool", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalMinted", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "bTokenId", "type": "uint256" }, { "internalType": "int256", "name": "amount", "type": "int256" } ], "name": "updateMargin", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "int256[]", "name": "margins", "type": "int256[]" } ], "name": "updateMargins", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "symbolId", "type": "uint256" }, { "components": [ { "internalType": "int256", "name": "volume", "type": "int256" }, { "internalType": "int256", "name": "cost", "type": "int256" }, { "internalType": "int256", "name": "lastCumulativeFundingRate", "type": "int256" } ], "internalType": "struct IPToken.Position", "name": "position", "type": "tuple" } ], "name": "updatePosition", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]

const processPosition = (res) => {
  return {
    volume: deriToNatural(res.volume),
    cost: deriToNatural(res.cost),
    lastCumulativeFundingRate: deriToNatural(res.lastCumulativeFundingRate),
  }
}
export class PTokenV2 {
  chainId: string;
  contractAddress: string;
  providerUrl: string;
  web3: Web3;
  contract: Contract;

  constructor(chainId, contractAddress) {
    //console.log(contractAddress)
    this.chainId = chainId
    this.contractAddress = contractAddress
    this.web3 = web3Factory(chainId)
    this.contract = new this.web3.eth.Contract(POOL_ABI as AbiItem[], this.contractAddress);
    //console.log(`PerpetualPool(): ${chainId} ${contractAddress} `, )
  }

  async _call(method, args=[], blockNumber='latest') {
    return await this.contract.methods[method](...args).call({}, blockNumber);
  }

  async getMargin(accountAddress, symbolId, blockNumber='latest') {
    const res = await this._call('getMargin', [accountAddress, symbolId], blockNumber);
    return deriToNatural(res)
  }
  async getMargins(accountAddress, blockNumber='latest') {
    console.log(blockNumber)
    const res = await this._call('getMargins', [accountAddress], blockNumber);
    if (Array.isArray(res)) {
      return res.map((i) => deriToNatural(i))
    }
  }
  async getPosition(accountAddress, symbolId, blockNumber='latest') {
    const res = await this._call('getPosition', [accountAddress, symbolId], blockNumber);
    if (Array.isArray(res)) {
      return processPosition(res)
    } else {
      throw new Error(`PToken#getMargin: invalid result with (${accountAddress})`)
    }
  }

  async getPositions(accountAddress, blockNumber='latest') {
    console.log(blockNumber)
    const res = await this._call('getPositions', [accountAddress], blockNumber);
    if (Array.isArray(res)) {
      return res.map((i) => processPosition(i))
    }
  }
}
