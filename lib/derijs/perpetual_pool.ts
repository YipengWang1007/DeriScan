import { bg, deriToNatural, hasInvalidArgsValue, getBTCUSDPrice } from "./utils";
import {web3Factory} from './factory'
import {calculateFundingRate, calculateLiquidityUsed, processFundingRate} from './calculation'
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils'

const POOL_ABI=[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"lShares","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bAmount","type":"uint256"}],"name":"AddLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"bAmount","type":"uint256"}],"name":"DepositMargin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"migrationTimestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"source","type":"address"},{"indexed":false,"internalType":"address","name":"target","type":"address"}],"name":"ExecuteMigration","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"int256","name":"volume","type":"int256"},{"indexed":false,"internalType":"int256","name":"cost","type":"int256"},{"indexed":false,"internalType":"uint256","name":"margin","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"address","name":"liquidator","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"Liquidate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"migrationTimestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"source","type":"address"},{"indexed":false,"internalType":"address","name":"target","type":"address"}],"name":"PrepareMigration","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"lShares","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bAmount","type":"uint256"}],"name":"RemoveLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"int256","name":"tradeVolume","type":"int256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"Trade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"bAmount","type":"uint256"}],"name":"WithdrawMargin","type":"event"},{"inputs":[{"internalType":"uint256","name":"bAmount","type":"uint256"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"bAmount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"approveMigration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"controller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"bAmount","type":"uint256"}],"name":"depositMargin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"bAmount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"depositMargin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"source","type":"address"}],"name":"executeMigration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAddresses","outputs":[{"internalType":"address","name":"bToken","type":"address"},{"internalType":"address","name":"pToken","type":"address"},{"internalType":"address","name":"lToken","type":"address"},{"internalType":"address","name":"oracle","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getParameters","outputs":[{"internalType":"uint256","name":"multiplier","type":"uint256"},{"internalType":"uint256","name":"feeRatio","type":"uint256"},{"internalType":"uint256","name":"minPoolMarginRatio","type":"uint256"},{"internalType":"uint256","name":"minInitialMarginRatio","type":"uint256"},{"internalType":"uint256","name":"minMaintenanceMarginRatio","type":"uint256"},{"internalType":"uint256","name":"minAddLiquidity","type":"uint256"},{"internalType":"uint256","name":"redemptionFeeRatio","type":"uint256"},{"internalType":"uint256","name":"fundingRateCoefficient","type":"uint256"},{"internalType":"uint256","name":"minLiquidationReward","type":"uint256"},{"internalType":"uint256","name":"maxLiquidationReward","type":"uint256"},{"internalType":"uint256","name":"liquidationCutRatio","type":"uint256"},{"internalType":"uint256","name":"priceDelayAllowance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStateValues","outputs":[{"internalType":"int256","name":"cumuFundingRate","type":"int256"},{"internalType":"uint256","name":"cumuFundingRateBlock","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"int256","name":"tradersNetVolume","type":"int256"},{"internalType":"int256","name":"tradersNetCost","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"address[4]","name":"addresses_","type":"address[4]"},{"internalType":"uint256[12]","name":"parameters_","type":"uint256[12]"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"liquidate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"liquidate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"migrationDestination","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"migrationTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newPool","type":"address"},{"internalType":"uint256","name":"graceDays","type":"uint256"}],"name":"prepareMigration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lShares","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lShares","type":"uint256"}],"name":"removeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newController","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int256","name":"tradeVolume","type":"int256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"trade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"tradeVolume","type":"int256"}],"name":"trade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"tradeVolume","type":"int256"},{"internalType":"uint256","name":"bAmount","type":"uint256"}],"name":"tradeWithMargin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"tradeVolume","type":"int256"},{"internalType":"uint256","name":"bAmount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"tradeWithMargin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"bAmount","type":"uint256"}],"name":"withdrawMargin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"bAmount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"withdrawMargin","outputs":[],"stateMutability":"nonpayable","type":"function"}]

export class PerpetualPool {
  chainId: string;
  contractAddress: string;
  providerUrl: string;
  web3: Web3;
  contractAbi: AbiItem[];

  contract: Contract;

  constructor(chainId, contractAddress) {
    //console.log(contractAddress)
    this.chainId = chainId
    this.contractAddress = contractAddress
    this.web3 = web3Factory(chainId)
    this.contractAbi = POOL_ABI as AbiItem[]
    this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
    //console.log(`PerpetualPool(): ${chainId} ${contractAddress} `, )
  }

  async getParameters() {
    let result;
    const defaultValue = bg(0);
    const res = await this._call("getParameters");
    // console.log("getParameters() raw: ", res)
    result = {
      multiplier: deriToNatural(res.multiplier),
      feeRatio: deriToNatural(res.feeRatio),
      minPoolMarginRatio: deriToNatural(res.minPoolMarginRatio),
      minInitialMarginRatio: deriToNatural(res.minInitialMarginRatio),
      minMaintenanceMarginRatio: deriToNatural(res.minMaintenanceMarginRatio),
      minAddLiquidity: deriToNatural(res.minAddLiquidity),
      redemptionFeeRatio: deriToNatural(res.redemptionFeeRatio),
      fundingRateCoefficient: deriToNatural(res.fundingRateCoefficient),
      minLiquidationReward: deriToNatural(res.minLiquidationReward),
      maxLiquidationReward: deriToNatural(res.maxLiquidationReward),
      liquidationCutRatio: deriToNatural(res.liquidationCutRatio),
      priceDelayAllowance: bg(res.priceDelayAllowance),
    };
    return result;
  }

  async getStateValues() {
    let result;
    const res = await this._call("getStateValues");
    //console.log("getStateValues() raw:", res)
    result = {
      cumuFundingRate: deriToNatural(res.cumuFundingRate),
      cumuFundingRateBlock: bg(res.cumuFundingRateBlock),
      liquidity: deriToNatural(res.liquidity),
      tradersNetVolume: deriToNatural(res.tradersNetVolume),
      tradersNetCost: deriToNatural(res.tradersNetCost),
    };
    return result;
  }

  async _call(method, args=[]) {
    let res
    let retry = 5
    while (retry > 0) {
      try {
        if (!this.web3) {
          this.web3 = web3Factory(this.chainId)
          this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress)
        }
        res = await this.contract.methods[method](...args).call();
        break;
      } catch (err) {
        console.log(`${err}`)
        this.web3 = null
        retry -= 1
      }
    }
    if (retry === 0 && !res) {
      throw new Error(`contract call '${method} ${args}' failed with max retry 5.`)
    }
    return res
  }

  async symbol() {
    return await this._call("symbol");
  }

  async _getBlockInfo(blockNumber) {
    return await this.web3.eth.getBlock(blockNumber);
  }
  async _getPastEvents(eventName, filter = {}, fromBlock = 0, to = 0) {
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
  async _getPastEventsReverse(eventName, filter = {}, fromBlock = 0, limit) {
    let events = [];
    let toBlock = await this._getBlockInfo("latest");
    let to = toBlock.number
    while (fromBlock <= to) {
      console.log('--- from:', to - 4999, ' => ', to)
      let es = await this.contract.getPastEvents(eventName, {
        filter: filter,
        fromBlock: to - 4999,
        toBlock: to,
      });
      for (let e of es) {
        events.push(e);
      }
      if (events.length > limit) {
        console.log(`reach the events length limit ${limit}`)
        break
      }
      to -= 5000;
    }
    return events;
  }

  async getFundingRate() {
    let price, fundingRate, fundingRatePerBlock, liquidityUsed;
    price = await getBTCUSDPrice(this.chainId, this.contractAddress);
    try {
      const { tradersNetVolume, liquidity } = await this.getStateValues();
      const {
        multiplier,
        fundingRateCoefficient,
        minPoolMarginRatio,
      } = await this.getParameters();
      //console.log("minPoolMarginRatio", minPoolMarginRatio.toString())
      const args1 = [
        tradersNetVolume,
        price,
        multiplier,
        liquidity,
        fundingRateCoefficient,
      ];
      if (hasInvalidArgsValue(...args1)) {
        fundingRate = '0';
        fundingRatePerBlock = '0';
      } else {
        fundingRatePerBlock = calculateFundingRate(tradersNetVolume, price, multiplier, liquidity, fundingRateCoefficient);
        fundingRate = processFundingRate(this.chainId, fundingRatePerBlock);
      }
      const args2 = [
        tradersNetVolume,
        price,
        multiplier,
        liquidity,
        minPoolMarginRatio,
      ];
      if (hasInvalidArgsValue(...args2)) {
        liquidityUsed = '0';
      } else {
        liquidityUsed = calculateLiquidityUsed(tradersNetVolume, price, multiplier, liquidity, minPoolMarginRatio);
      }
      return {
        price,
        multiplier: multiplier.toString(),
        fundingRate: fundingRate,
        fundingRatePerBlock: fundingRatePerBlock,
        tradersNetVolume: tradersNetVolume.toString(),
        liquidity: liquidity.toString(),
        fundingRateCoefficient: fundingRateCoefficient.toString(),
        liquidityUsed: liquidityUsed,
        poolMarginRatio: minPoolMarginRatio.toString(),
      };
    } catch (err) {
      console.log('PerpetualPool#gerFundingRate():', err);
      throw err;
    }
  }

  async _getTimeStamp(blockNumber) {
    return await this.web3.eth.getBlock(blockNumber);
  }
  _calculateFee(volume, price, multiplier, feeRatio) {
    return bg(volume)
      .abs()
      .times(price)
      .times(multiplier)
      .times(feeRatio)
      .toString();
  }
}
