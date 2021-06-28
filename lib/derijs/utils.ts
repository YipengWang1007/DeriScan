import Web3 from "web3";
import fetch from 'node-fetch'
import BigNumber from "bignumber.js";
import {
  DeriEnv,
  ChainProviderUrls,
  getContractAddressConfig,
  getAnnualBlockNumberConfig,
  getSlpContractAddressConfig,
  getClpContractAddressConfig,
  getDeriContractAddressConfig,
} from "./config";

BigNumber.config({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: 256
});

export { BigNumber }

// numberic
export const bg = (value, base = 0) => {
  if (base == 0) {
    return new BigNumber(value);
  } else if (base > 0) {
    return new BigNumber(value).times(new BigNumber("1" + "0".repeat(base)));
  } else {
    return new BigNumber(value).div(new BigNumber("1" + "0".repeat(-base)));
  }
};

export const max = (value1, value2) => {
  if (value1.gte(value2)) {
    return value1;
  } else {
    return value2;
  }
};

export const min = (value1, value2) => {
  if (value1.lte(value2)) {
    return value1;
  } else {
    return value2;
  }
};

export const toByte32Hex = (value) => {
  let res = "0"
  //console.log('v before', value)
  if (value) {
    res = Web3.utils.padLeft(Web3.utils.toHex(value), 64)
  }
  //console.log('v after', res)
  return res
}
export const hexToNumber = (value) => {
  return Web3.utils.hexToNumber(value)
}

export const numberToHex = (value) => {
  return Web3.utils.padLeft(Web3.utils.numberToHex(value), 64)
}

export const toNatural = (value, num=0) => {
  return new BigNumber(value).toFixed(num).toString()
}

export const toHex = (value) => {
  return Web3.utils.toHex(value);
};

export const toChecksumAddress = (value) => {
  return Web3.utils.toChecksumAddress(value);
};

export const hexToString= (value) => {
  return Web3.utils.hexToUtf8(value);
};

export const hexToNumberString = (value) => {
  return Web3.utils.hexToNumberString(value);
};

export const hexToDeri = (value) => {
  return bg(hexToNumberString(value))
};

export const hexToNatural = (value) => {
  return bg(hexToNumberString(value), -18)
};

export const hexToNaturalWithPercentage = (value) => {
  return (
    bg(hexToNumberString(value), -18).sd(4).times(100).toFixed(4).toString() + "%"
  );
};

export const naturalToDeri = (value) => {
  return bg(value, 18).toFixed(0)
};

export const naturalWithPercentage = (value) => {
  return bg(value).sd(4).times(100).toFixed(4).toString() + "%";
};


export const deriToNatural = (value) => {
  return bg(value, -18).toString()
};

export const deriToNaturalWithPercentage = (value) => {
  return bg(value, -18).sd(4).times(100).toFixed(4).toString() + "%";
};

export const deriToString = (value) => {
  return bg(value).toString()
}

export const deriToBool = (value) => {
  if (bg(value).toNumber() === 1) {
    return true;
  } else {
    return false;
  }
};

export const hasInvalidArgsValue = (...args) => {
  return args.some((i) => {
    //console.log(bg(i))
    return isNaN(i.toString()) || i.toString() === "0";
  });
};

// language
export const isObject = (obj) => {
  return typeof obj === "object";
};

// http
export const checkHttpServerIsAlive = async (url) => {
  try {
    //console.log('url', url)
    const response = await fetch(url);
    if (response.ok) {
      return true;
    }
  } catch (err) {
    console.log(`${err}`);
  }
  return false;
};

export const checkHttpServerIsAliveByChain = async (chainId, url) => {
  if (['56', '97'].includes(chainId)) {
    try {
      //console.log('url - ', url)
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch (err) {
      console.log(`${err}`);
    }
    return false;
  } else {
    return true
  }
};

export const getAliveHttpServer = async (urls = []) => {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (await checkHttpServerIsAlive(url)) {
      //console.log('returned url', url)
      return url;
    }
  }
  throw new Error('No alive http server');
};
// export const getAliveHttpServerByChain = async (chainId, urls = []) => {
//   if (['56', '97'].includes(chainId)) {
//     for (let i = 0; i < urls.length; i++) {
//       const url = urls[i];
//       //console.log('url >', url)
//       if (await checkHttpServerIsAlive(url)) {
//         //console.log('returned url', url)
//         return url;
//       }
//     }
//     throw new Error('No alive http server');
//   } else {
//     return urls[0]
//   }
// };

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const getBlockNumber = async (url) => {
  let res = { url: url, blockNumber: -1, duration: Number.MAX_SAFE_INTEGER,};
  try {
    const web3 = new Web3(new Web3.providers.HttpProvider(url))
    const startTime = Date.now()
    res.blockNumber = await web3.eth.getBlockNumber()
    res.duration = Date.now() - startTime
  } catch (err) {
    console.log(`getBlockNumber(${url}) error: ${err}`)
  }
  return res
};

export const getLatestRPCServer = async (urls = []) => {
  urls = shuffleArray(urls)
  let promises = []
  for (let i = 0; i < urls.length; i++) {
    promises.push(getBlockNumber(urls[i]));
  }
  let blockNumbers = await Promise.all(promises)
  blockNumbers = blockNumbers.sort((a, b) => a.duration - b.duration)
  //console.log('blockNumbers',  blockNumbers)
  const latestBlockNumber = blockNumbers.reduce((a, b) => b.blockNumber !== -1 ? a > b.blockNumber ? a : b.blockNumber : a, 0)
  const index = blockNumbers.findIndex((b) => b.blockNumber === latestBlockNumber);
  const res = blockNumbers[index].url
  //console.log(res)
  if (res.startsWith('http')) {
    return res
  } else {
    throw new Error(`getLatestRPCServer(): cannot find alive RPC server in ${urls}`)
  }
};

// ethereum chain
export const MAX_VALUE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
export const getNetworkName = (chainId) => {
  let poolNetwork
  switch(chainId) {
    case "1":
      poolNetwork = "ethereum"
      break
    case "56":
      poolNetwork = "bsc"
      break
    case "128":
      poolNetwork = "heco"
      break
    case "3":
      poolNetwork = "ropsten"
      break
    case "42":
      poolNetwork = "kovan"
      break
    case "97":
      poolNetwork = "bsctestnet"
      break
    case "256":
      poolNetwork = "hecotestnet"
      break
    default:
      throw new Error("The networkId is not valid")
  }
  return poolNetwork
}

export const getWalletBalanceUnit = (chainId) => {
  let index;
  const unitNetworkIdsMap = {
    ETH: ["1", "3", "42"],
    BNB: ["56", "97"],
    HT: ["128", "256"],
  };
  const networkIdsArray = Object.values(unitNetworkIdsMap);
  for (let i = 0; i < networkIdsArray.length; i++) {
    if (networkIdsArray[i].includes(chainId)) {
      index = i;
      break;
    }
  }
  if (index !== undefined) {
    return Object.keys(unitNetworkIdsMap)[index];
  } else if (chainId === "") {
    return "";
  } else {
    throw new Error(`Invalid Network: ${chainId}`);
  }
};

export const getPoolBaseSymbolList = (chainId) => {
  let result = []
  const pools = getContractAddressConfig(DeriEnv.get()).filter((c) => c.chainId === chainId);
  for (let i=0; i<pools.length; i++) {
    const bTokenSymbol = pools[i].bTokenSymbol
    if (bTokenSymbol) {
      result.push(bTokenSymbol)
    }
  }
  return result
}

export const getPoolContractAddress = (chainId, poolAddress) => {
  const pools = getContractAddressConfig(DeriEnv.get()).filter((c) => c.chainId === chainId);
  const pool = pools.filter((p) => p.pool === poolAddress)
  if (pool.length > 0) {
    return {
      poolAddress: pool[0]["pool"],
      bTokenSymbol: pool[0]["bTokenSymbol"],
      bTokenAddress: pool[0]["bToken"],
      pTokenAddress: pool[0]["pToken"],
      lTokenAddress: pool[0]["lToken"],
      dTokenAddress: pool[0]["dToken"],
      MiningVaultAddress: pool[0]["MiningVault"],
      initialBlock: pool[0]["initialBlock"],
      symbol: pool[0]['symbol'],
    }
  }
  //console.log(pools)
  throw new Error(`contract address is not found: ${chainId} ${poolAddress}`);
}

export const getOracleUrl = (env = 'dev', chainId, poolAddress) => {
  const { symbol } = getPoolContractAddress(chainId, poolAddress);
  const addSymbolParam = (url, symbol="BTCUSD") => `${url}?symbol=${symbol}`;
  if (env === 'prod' || env === 'production') {
    // for production
    if (symbol) {
      return addSymbolParam('https://oracle4.deri.finance/price', symbol);
    }
    return 'https://oracle4.deri.finance/price';
  } else {
    if (symbol) {
      return addSymbolParam('https://oracle2.deri.finance/price', symbol);
    }
    // for test
    return 'https://oracle2.deri.finance/price';
  }
};

export const getBTCUSDPrice = async (chainId, poolAddress) => {
  let url = getOracleUrl(DeriEnv.get(), chainId, poolAddress);
  //console.log('oracle url', url);
  try {
    const priceResponse = await fetch(url, {cache: 'no-cache'});
    const priceResponseJson = await priceResponse.json();
    let price = priceResponseJson.price
    if (!price) {
      price = '0';
    }
    return deriToNatural(price);
  } catch (err) {
    throw new Error(`fetch oracle price error: ${err}`);
  }
};

export const getOracleInfo = async (chainId, poolAddress) => {
  try {
    let url = getOracleUrl(DeriEnv.get(), chainId, poolAddress);
    //console.log('oracle url', url);
    const priceResponse = await fetch(url, {cache: 'no-cache'});
    const priceResponseJson = await priceResponse.json();
    return priceResponseJson;
  } catch(err) {
    throw new Error(`fetch oracle info error: ${err}`);
  }
};

type fnArgBoolean = (...args:any[]) => boolean

export const getChainProviderUrl = (chainId, filterFunc:fnArgBoolean = () => true) => {
  const chains = ChainProviderUrls.filter((item) => item.chainId === chainId);
  if (chains.length === 1) {
    let urls = chains[0].provider_urls
    urls = shuffleArray(urls)
    if (filterFunc) {
      for (let i = 0; i < urls.length; i++) {
        if (filterFunc(urls[i])) {
          return urls[i]
        }
      }
      throw new Error(
        `Cannot find the alive chain provider url with chainId: ${chainId}`
      );
    } else {
      return chains[0].provider_urls[0];
    }
    //return chains[0].provider_urls[0];
  } else {
    throw new Error(
      `Cannot find the provider url with chainId ${chainId}`
    );
  }
};
export const getChainProviderUrlByChain = (chainId) => {
  const chains = ChainProviderUrls.filter((item) => item.chainId === chainId);
  if (chains.length === 1) {
    const urls = chains[0].provider_urls
    return urls
  } else {
    throw new Error(
      `Cannot find the provider url with chainId ${chainId}`
    );
  }
};

export const getAnnualBlockNumber = (chainId) => {
  const blockNumbers = getAnnualBlockNumberConfig();
  if (blockNumbers[chainId]) {
    return parseInt(blockNumbers[chainId]);
  }
  console.log(`cannot find the annual block number with chainId: ${chainId}`);
};

export const getSlpContractAddress = (chainId, poolAddress) => {
  const pools = getSlpContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  const pool = pools.filter((p) => p.pool === poolAddress);
  if (pool.length > 0) {
    return {
      pool: pool[0].pool,
      bToken: pool[0].bToken,
      pToken: pool[0].pToken,
      lToken: pool[0].lToken,
      dToken: pool[0].dToken,
      MinningVault: pool[0].MiningVault,
    };
  }
  throw new Error(`getSlpContractAddress(): contract address is not found: ${chainId} ${poolAddress}`)
};

export const getClpContractAddress = (chainId, poolAddress) => {
  const pools = getClpContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  const pool = pools.filter((p) => p.pool === poolAddress);
  if (pool.length > 0) {
    return {
      poolAddress: pool[0].pool,
      bTokenAddress: pool[0].bToken,
      lTokenAddress: pool[0].lToken,
    };
  }
  console.log(
    `getClpContractAddress(): contract address is not found: ${chainId} ${poolAddress}`
  );
  return {};
};

export const getDeriContractAddress = (chainId) => {
  const pool = getDeriContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  if (pool.length > 0) {
    return {
      deriAddress: pool[0].Deri,
      wormholeAddress: pool[0].Wormhole,
      bTokenSymbol: pool[0].bTokenSymbol,
    };
  }
  throw new Error( `getDeriContractAddress(): contract address is not found: ${chainId}`)
};
