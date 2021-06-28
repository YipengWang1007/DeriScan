import {
  getPoolContractAddress,
  getNetworkName,
  deriToString,
  bg,
  naturalWithPercentage,
  deriToNatural,
  getBTCUSDPrice,
  getSlpContractAddress,
  getClpContractAddress,
  getDeriContractAddress,
} from "./utils";
import {
  perpetualPoolFactory,
  bTokenFactory,
  pTokenFactory,
  lTokenFactory,
  databaseFactory,
  slpPoolFactory,
  clpPoolFactory,
  deriFactory,
} from "./factory";
import {
  calculatePnl,
  calculateMarginHeld,
  calculateEntryPrice,
  calculateLiquidationPrice,
  calculateShareValue,
  calculateMaxRemovableShares,
} from './calculation'

// api
export const getSpecification = async (chainId, poolAddress) => {
  const { bTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  const {
    multiplier,
    feeRatio,
    minPoolMarginRatio,
    minInitialMarginRatio,
    minMaintenanceMarginRatio,
    minAddLiquidity,
    redemptionFeeRatio,
    fundingRateCoefficient,
    minLiquidationReward,
    maxLiquidationReward,
    liquidationCutRatio,
    priceDelayAllowance,
  } = await pPool.getParameters();
  let symbol = await pPool.symbol();
  const bSymbolRaw = await bToken.symbol();

  // fix symbol BTCUSD issue, will remove later
  // if (poolAddress === '0xA2D7316Bc60AA9463DfB78379d25E77371990507') {
  //   symbol = 'iMEME'
  // }

  return {
    address: poolAddress,
    symbol,
    bSymbol: bSymbolRaw,
    multiplier: multiplier.toString(),
    feeRatio: feeRatio.toString(),
    minPoolMarginRatio: minPoolMarginRatio.toString(),
    minInitialMarginRatio: minInitialMarginRatio.toString(),
    minMaintenanceMarginRatio: minMaintenanceMarginRatio.toString(),
    minAddLiquidity: minAddLiquidity.toString(),
    redemptionFeeRatio: redemptionFeeRatio.toString(),
    fundingRateCoefficient: fundingRateCoefficient.toString(),
    minLiquidationReward: minLiquidationReward.toString(),
    maxLiquidationReward: maxLiquidationReward.toString(),
    liquidationCutRatio: liquidationCutRatio.toString(),
    priceDelayAllowance: priceDelayAllowance.toString(),
  };
};

export const getPoolInfoApy = async (chainId, poolAddress) => {
  const db = databaseFactory(true);
  const poolNetwork = getNetworkName(chainId);
  let retry = 5;
  let res;
  while (retry > 0) {
    //console.log(`${poolNetwork}.${poolAddress}.apy`)
    try {
      res = await db.getValues([
        `${poolNetwork}.${poolAddress}.apy`,
        `${poolNetwork}.${poolAddress}.volume.1h`,
        `${poolNetwork}.${poolAddress}.volume.24h`,
      ]);
      break;
    } catch (err) {
      console.log(`err: ${err}`);
    }
    retry -= 1;
  }
  if (res) {
    const [apy, volume1h, volume24h] = res;
    return {
      apy: deriToString(apy),
      volume1h: deriToString(volume1h),
      volume24h: deriToString(volume24h),
    };
  }
  if (retry === 0 && !res) {
    throw new Error(`getPoolInfoApy err: exceed max retry 5`);
  }
};

export const getFundingRate = async (chainId, poolAddress) => {
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress);

  const res = await perpetualPool
    .getFundingRate()
    .catch((err) => console.log("getFundingRate", err));
  //fundingRateCache.set(chainId, poolAddress, res);
  const poolInfo = await getPoolInfoApy(chainId, poolAddress);
  if (res && poolInfo) {
    // console.log(hexToNatural(res[0]));
    const {
      fundingRate,
      fundingRatePerBlock,
      liquidity,
      tradersNetVolume,
    } = res;
    const volume = deriToNatural(poolInfo.volume24h);
    // fundingRate = processFundingRate(chainId, fundingRate);

    return [
      {
        fundingRate0: naturalWithPercentage(fundingRate),
        fundingRatePerBlock: bg(fundingRatePerBlock).toExponential(10),
        liquidity: liquidity.toString(),
        volume: volume.toString(),
        tradersNetVolume: tradersNetVolume.toString(),
      },
      res,
    ];
  }
  throw new Error(`getFundingRate() error`)
};

export const getLiquidityUsed = async (chainId, poolAddress) => {
  //res = fundingRateCache.get(chainId, poolAddress);
  //if (!res) {
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress);
  const res = await perpetualPool.getFundingRate();
  //}
  if (res) {
    const { liquidityUsed } = res;
    return [{
      liquidityUsed0: naturalWithPercentage(liquidityUsed),
    }, res];
  }
  throw new Error(`getFundingRate() error`)
};

export const getPositionInfo = async (chainId, poolAddress, accountAddress) => {
  //console.log(`${chainId} ${poolAddress} ${accountAddress}`)
  let price = ''
  try {
    price = await getBTCUSDPrice(chainId, poolAddress);
  } catch(err) {
    console.log(`-- fetch price error: ${err}`)
  }
  const { pTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  //pPool.setAccount(accountAddress);
  const pToken = pTokenFactory(chainId, pTokenAddress);
  const {
    multiplier,
    minInitialMarginRatio,
    minMaintenanceMarginRatio,
  } = await pPool.getParameters();
  const { volume, margin, cost } = await pToken.getPositionInfo(accountAddress);

  if (price === '') {
    return {
      volume: volume.toString(),
      averageEntryPrice: calculateEntryPrice(volume, cost, multiplier).toString(),
      margin: margin.toString(),
      marginHeld:  '',
      unrealizedPnl: '',
      liquidationPrice: '',
    };
  } else {
    return {
      volume: volume.toString(),
      averageEntryPrice: calculateEntryPrice(volume, cost, multiplier).toString(),
      margin: margin.toString(),
      marginHeld: calculateMarginHeld(
        price,
        volume,
        multiplier,
        minInitialMarginRatio
      ).toString(),
      unrealizedPnl: calculatePnl(price, volume, multiplier, cost).toString(),
      liquidationPrice: calculateLiquidationPrice(
        volume,
        margin,
        cost,
        multiplier,
        minMaintenanceMarginRatio
      ).toString(),
    };
  }
};

export const getLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { lTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  const lToken = lTokenFactory(chainId, lTokenAddress, poolAddress);
  //console.log('getLiquidityInfo ltoken', chainId, poolAddress, accountAddress, lTokenAddress)

  const lTokenTotalSupply = await lToken.totalSupply();
  const lTokenBalance = await lToken.balance(accountAddress)

  let price = '';
  try {
    price = await getBTCUSDPrice(chainId, poolAddress);
  } catch(err) {
    console.log(`-- fetch price error: ${err}`)
  }
  const {
    liquidity,
    tradersNetCost,
    tradersNetVolume,
  } = await pPool.getStateValues();
  const { multiplier, minPoolMarginRatio } = await pPool.getParameters();
  //const poolDynamicEquity = liquidity.plus(
    //tradersNetCost.minus(tradersNetVolume.times(price).times(multiplier))
  //);
  const poolDynamicEquity = liquidity

  if (price === '') {
    return {
      totalSupply: lTokenTotalSupply.toString(),
      poolLiquidity: liquidity.toString(),
      shares: lTokenBalance.toString(),
      shareValue: calculateShareValue(
        lTokenTotalSupply,
        poolDynamicEquity
      ).toString(),
    };
  } else {
    return {
      totalSupply: lTokenTotalSupply.toString(),
      poolLiquidity: liquidity.toString(),
      shares: lTokenBalance.toString(),
      shareValue: calculateShareValue(
        lTokenTotalSupply,
        poolDynamicEquity
      ).toString(),
      maxRemovableShares: calculateMaxRemovableShares(
        lTokenBalance,
        lTokenTotalSupply,
        liquidity,
        tradersNetVolume,
        tradersNetCost,
        multiplier,
        minPoolMarginRatio,
        price
      ).toString(),
    };
  }
};

export const getWalletBalance = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { bTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  console.log('getWalletBalance', chainId, poolAddress, accountAddress, bTokenAddress)
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  const balance = await bToken.balance(accountAddress);
  return balance.toString();
};

export const getSlpLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { bToken: bTokenAddress } = getSlpContractAddress(chainId, poolAddress);
  // console.log('pool', poolAddress, bTokenAddress)
  if (bTokenAddress) {
    const slpPool = slpPoolFactory(chainId, poolAddress);
    const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
    const [liquidity, bTokenBalance, shares] = await Promise.all([
      bToken.balance(poolAddress),
      bToken.balance(accountAddress),
      slpPool.getLiquidity(accountAddress),
    ]);

    return {
      liquidity: liquidity.toString(),
      bTokenBalance: bTokenBalance.toString(),
      shares: shares.toString(),
    };
  }
  console.log('no SlpPool address, please check');
  return {};
};

export const getSlpWalletBalance = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { bToken: bTokenAddress } = getSlpContractAddress(chainId, poolAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  const balance = await bToken.balance(accountAddress);
  return balance.toString();
};

export const getDeriBalance = async (chainId, accountAddress) => {
  const { deriAddress } = getDeriContractAddress(chainId);
  const deri = deriFactory(chainId, deriAddress);
  return (await deri.balance(accountAddress)).toString();
};

export const getClpLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { lTokenAddress } = getClpContractAddress(chainId, poolAddress);
  const clpPool = clpPoolFactory(chainId, poolAddress);
  const lToken = lTokenFactory(chainId, lTokenAddress, poolAddress);

  const [lTokenBalance, lTokenTotalSupply] = await Promise.all([
    lToken.balance(accountAddress),
    lToken.totalSupply(),
  ]);
  const { liquidity } = await clpPool.getStateValues();
  //console.log(liquidity);

  return {
    totalSupply: lTokenTotalSupply.toString(),
    poolLiquidity: liquidity.toString(),
    shares: lTokenBalance.toString(),
    shareValue: (lTokenTotalSupply.eq(0)
      ? bg(0)
      : liquidity.div(lTokenTotalSupply)
    ).toString(),
    maxRemovableShares: lTokenBalance.toString(),
  };
};

export const getClpWalletBalance = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { bTokenAddress } = getClpContractAddress(chainId, poolAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  const balance = await bToken.balance(accountAddress);
  return balance.toString();
};
