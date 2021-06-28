import { bg, deriToNatural } from "./utils";
import {web3Factory} from './factory'
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils'
import BigNumber from 'bignumber.js'

const POOL_ABI= [ { "inputs": [ { "internalType": "uint256[9]", "name": "parameters", "type": "uint256[9]" }, { "internalType": "address[4]", "name": "addresses", "type": "address[4]" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "bTokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "bAmount", "type": "uint256" } ], "name": "AddLiquidity", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "bTokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "bAmount", "type": "uint256" } ], "name": "AddMargin", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "liquidator", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256" } ], "name": "Liquidate", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "collector", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "ProtocolFeeCollection", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "bTokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "bAmount", "type": "uint256" } ], "name": "RemoveLiquidity", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "bTokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "bAmount", "type": "uint256" } ], "name": "RemoveMargin", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "symbolId", "type": "uint256" }, { "indexed": false, "internalType": "int256", "name": "tradeVolume", "type": "int256" }, { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" } ], "name": "Trade", "type": "event" }, { "inputs": [ { "components": [ { "internalType": "address", "name": "bTokenAddress", "type": "address" }, { "internalType": "address", "name": "swapperAddress", "type": "address" }, { "internalType": "address", "name": "oracleAddress", "type": "address" }, { "internalType": "uint256", "name": "decimals", "type": "uint256" }, { "internalType": "int256", "name": "discount", "type": "int256" }, { "internalType": "int256", "name": "price", "type": "int256" }, { "internalType": "int256", "name": "liquidity", "type": "int256" }, { "internalType": "int256", "name": "pnl", "type": "int256" }, { "internalType": "int256", "name": "cumulativePnl", "type": "int256" } ], "internalType": "struct IPerpetualPool.BTokenInfo", "name": "info", "type": "tuple" } ], "name": "addBToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "bTokenId", "type": "uint256" }, { "internalType": "uint256", "name": "bAmount", "type": "uint256" }, { "internalType": "uint256", "name": "blength", "type": "uint256" }, { "internalType": "uint256", "name": "slength", "type": "uint256" } ], "name": "addLiquidity", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "bTokenId", "type": "uint256" }, { "internalType": "uint256", "name": "bAmount", "type": "uint256" } ], "name": "addMargin", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "components": [ { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "address", "name": "oracleAddress", "type": "address" }, { "internalType": "int256", "name": "multiplier", "type": "int256" }, { "internalType": "int256", "name": "feeRatio", "type": "int256" }, { "internalType": "int256", "name": "fundingRateCoefficient", "type": "int256" }, { "internalType": "int256", "name": "price", "type": "int256" }, { "internalType": "int256", "name": "cumulativeFundingRate", "type": "int256" }, { "internalType": "int256", "name": "tradersNetVolume", "type": "int256" }, { "internalType": "int256", "name": "tradersNetCost", "type": "int256" } ], "internalType": "struct IPerpetualPool.SymbolInfo", "name": "info", "type": "tuple" } ], "name": "addSymbol", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "targetPool", "type": "address" } ], "name": "approvePoolMigration", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "collectProtocolFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sourcePool", "type": "address" } ], "name": "executePoolMigration", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getAddresses", "outputs": [ { "internalType": "address", "name": "lTokenAddress", "type": "address" }, { "internalType": "address", "name": "pTokenAddress", "type": "address" }, { "internalType": "address", "name": "routerAddress", "type": "address" }, { "internalType": "address", "name": "protocolFeeCollector", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "bTokenId", "type": "uint256" } ], "name": "getBToken", "outputs": [ { "components": [ { "internalType": "address", "name": "bTokenAddress", "type": "address" }, { "internalType": "address", "name": "swapperAddress", "type": "address" }, { "internalType": "address", "name": "oracleAddress", "type": "address" }, { "internalType": "uint256", "name": "decimals", "type": "uint256" }, { "internalType": "int256", "name": "discount", "type": "int256" }, { "internalType": "int256", "name": "price", "type": "int256" }, { "internalType": "int256", "name": "liquidity", "type": "int256" }, { "internalType": "int256", "name": "pnl", "type": "int256" }, { "internalType": "int256", "name": "cumulativePnl", "type": "int256" } ], "internalType": "struct IPerpetualPool.BTokenInfo", "name": "", "type": "tuple" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "bTokenId", "type": "uint256" } ], "name": "getBTokenOracle", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLengths", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getParameters", "outputs": [ { "internalType": "uint256", "name": "decimals0", "type": "uint256" }, { "internalType": "int256", "name": "minBToken0Ratio", "type": "int256" }, { "internalType": "int256", "name": "minPoolMarginRatio", "type": "int256" }, { "internalType": "int256", "name": "minInitialMarginRatio", "type": "int256" }, { "internalType": "int256", "name": "minMaintenanceMarginRatio", "type": "int256" }, { "internalType": "int256", "name": "minLiquidationReward", "type": "int256" }, { "internalType": "int256", "name": "maxLiquidationReward", "type": "int256" }, { "internalType": "int256", "name": "liquidationCutRatio", "type": "int256" }, { "internalType": "int256", "name": "protocolFeeCollectRatio", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getProtocolFeeAccrued", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "symbolId", "type": "uint256" } ], "name": "getSymbol", "outputs": [ { "components": [ { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "address", "name": "oracleAddress", "type": "address" }, { "internalType": "int256", "name": "multiplier", "type": "int256" }, { "internalType": "int256", "name": "feeRatio", "type": "int256" }, { "internalType": "int256", "name": "fundingRateCoefficient", "type": "int256" }, { "internalType": "int256", "name": "price", "type": "int256" }, { "internalType": "int256", "name": "cumulativeFundingRate", "type": "int256" }, { "internalType": "int256", "name": "tradersNetVolume", "type": "int256" }, { "internalType": "int256", "name": "tradersNetCost", "type": "int256" } ], "internalType": "struct IPerpetualPool.SymbolInfo", "name": "", "type": "tuple" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "symbolId", "type": "uint256" } ], "name": "getSymbolOracle", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "liquidator", "type": "address" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "blength", "type": "uint256" }, { "internalType": "uint256", "name": "slength", "type": "uint256" } ], "name": "liquidate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "bTokenId", "type": "uint256" }, { "internalType": "uint256", "name": "bAmount", "type": "uint256" }, { "internalType": "uint256", "name": "blength", "type": "uint256" }, { "internalType": "uint256", "name": "slength", "type": "uint256" } ], "name": "removeLiquidity", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "bTokenId", "type": "uint256" }, { "internalType": "uint256", "name": "bAmount", "type": "uint256" }, { "internalType": "uint256", "name": "blength", "type": "uint256" }, { "internalType": "uint256", "name": "slength", "type": "uint256" } ], "name": "removeMargin", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "bTokenId", "type": "uint256" }, { "internalType": "address", "name": "swapperAddress", "type": "address" }, { "internalType": "address", "name": "oracleAddress", "type": "address" }, { "internalType": "uint256", "name": "discount", "type": "uint256" } ], "name": "setBTokenParameters", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "symbolId", "type": "uint256" }, { "internalType": "address", "name": "oracleAddress", "type": "address" }, { "internalType": "uint256", "name": "feeRatio", "type": "uint256" }, { "internalType": "uint256", "name": "fundingRateCoefficient", "type": "uint256" } ], "name": "setSymbolParameters", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "symbolId", "type": "uint256" }, { "internalType": "int256", "name": "tradeVolume", "type": "int256" }, { "internalType": "uint256", "name": "blength", "type": "uint256" }, { "internalType": "uint256", "name": "slength", "type": "uint256" } ], "name": "trade", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]

export interface IBToken {
  bTokenAddress: string
  swapperAddress: string
  oracleAddress: string
  decimals: string
  discount: string
  price: string
  liquidity: string
  pnl:string 
  cumulativePnl:string
}
export interface ISymbol {
  symbol: string
  oracleAddress: string
  multiplier: string
  feeRatio: string 
  fundingRateCoefficient:string
  price: string
  cumulativeFundingRate: string
  tradersNetVolume: string
  tradersNetCost: string
} 
export class PerpetualPoolV2 {
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

  //async getParameters(symbolCount) {
    //let promiseList = []
    //for (let i=0;i<symbolCount; i++) {
      //this._call('getSymbol', [i.toString()])
    //}
    //const resList = await Promise.all(promiseList)
    //const multipliers = resList.map(i => i.multiplier)
  //}

  async getBlockInfo(blockNumber) {
    return await this.web3.eth.getBlock(blockNumber);
  }
  async getPastEvents(eventName, filter = {}, fromBlock = 0, to = 0) {
    let events = [];
    //let toBlock = await this._getBlockInfo("latest");
    let amount
    if (['56', '97', '137', '80001'].includes(this.chainId)) {
      amount = 999
    } else {
      amount = 4999
    }
    if ((fromBlock + amount) > to) {
      amount = to - fromBlock
    }
    while (fromBlock <= to) {
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
  async getTimeStamp(blockNumber) {
    return await this.web3.eth.getBlock(blockNumber);
  }
  calculateFee(volume, price, multiplier, feeRatio) {
    return bg(volume)
      .abs()
      .times(price)
      .times(multiplier)
      .times(feeRatio)
      .toString();
  }
  async getBToken(bTokenId, blockNumber='latest'): Promise<IBToken> {
    try {
      //bTokenId = parseInt(bTokenId)
      const res = await this._call('getBToken', [bTokenId], blockNumber);
      return {
        bTokenAddress: res.bTokenAddress,
        swapperAddress: res.bTokenAddress,
        oracleAddress: res.oracleAddress,
        decimals: res.decimals,
        discount: deriToNatural(res.discount),
        price: deriToNatural(res.price),
        liquidity: deriToNatural(res.liquidity),
        pnl: deriToNatural(res.pnl),
        cumulativePnl: deriToNatural(res.cumulativePnl),
      };
    } catch (err) {
      throw new Error(`PerpetualPool#getBToken error: ${err}`);
    }
  }
  async getSymbol(symbolId, blockNumber='latest'):Promise<ISymbol>{
    //symbolId = parseInt(symbolId)
    try {
      const res =  await this._call('getSymbol', [symbolId], blockNumber)
      return {
        symbol: res.symbol,
        oracleAddress: res.oracleAddress,
        multiplier: deriToNatural(res.multiplier),
        feeRatio: deriToNatural(res.feeRatio),
        fundingRateCoefficient: deriToNatural(res.fundingRateCoefficient),
        price: deriToNatural(res.price),
        cumulativeFundingRate: deriToNatural(res.cumulativeFundingRate),
        tradersNetVolume: deriToNatural(res.tradersNetVolume),
        tradersNetCost: deriToNatural(res.tradersNetCost),
      };
    } catch (err) {
      throw new Error(`PerpetualPool#getSymbol error: ${err}`);
    }
  }
}
