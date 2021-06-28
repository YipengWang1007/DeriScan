import Web3 from "web3";
import { getChainProviderUrl } from "./utils";
import { DeriEnv, getDBAddressConfig } from "./config";
import { DatabaseContract } from "./database";
import { PerpetualPool } from "./perpetual_pool";
import { BTokenContract } from "./b_token";
import { PTokenContract } from "./p_token";
import { LTokenContract } from "./l_token";
import { SlpPool } from "./slp_pool";
import { ClpPool } from "./clp_pool";
import { Clp2Pool } from "./clp2_pool";
import { DeriContract } from "./deri";
import { PerpetualPoolV2 } from "./perpetual_pool_v2";

export const web3Factory = (function() {
    //const web3InstanceMap = {}
    return (chainId) => {
      // if (Object.keys(web3InstanceMap).includes(chainId)) {
      //   return web3InstanceMap[chainId]
      // } else {
        const providerUrl = getChainProviderUrl(chainId);
        const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
        //web3InstanceMap[chainId] = web3
        return web3
      //}
    }
})()

export const databaseFactory = (() => {
  const databaseInstanceMap = {};
  return (useProductionDB = false) => {
    const address = getDBAddressConfig(DeriEnv.get(), useProductionDB);
    const key = address;
    if (Object.keys(databaseInstanceMap).includes(key)) {
      return databaseInstanceMap[key];
    }
    const database = new DatabaseContract(address);
    databaseInstanceMap[key] = database;
    return database;
  };
})();

export const perpetualPoolFactory = (() => {
  let perpetualPoolInstanceMap = {}
  return (chainId, contractAddress) => {
    let key = `${chainId}.${contractAddress}`
    if (Object.keys(perpetualPoolInstanceMap).includes(key)) {
      return perpetualPoolInstanceMap[key];
    } else {
      const perpetualPool = new PerpetualPool(chainId, contractAddress);
      //console.log("new PerpetualPoolContract");
      perpetualPoolInstanceMap[key] = perpetualPool;
      return perpetualPool;
    }
  }
})()

export const bTokenFactory = (function() {
  const bTokenInstanceMap = {}
  return (chainId, contractAddress, poolAddress) => {
    let key = `${chainId}.${contractAddress}.${poolAddress}`
    if (Object.keys(bTokenInstanceMap).includes(key)) {
      return bTokenInstanceMap[key]
    } else {
      const bToken = new BTokenContract(chainId, contractAddress)
      //console.log("new BTokenContract", chainId, contractAddress)
      bTokenInstanceMap[key] = bToken
      return bToken
    }
  }
})()

export const pTokenFactory = (function() {
  const pTokenInstanceMap = {}
  return (chainId, contractAddress) => {
    let key = `${chainId}.${contractAddress}`
    if (Object.keys(pTokenInstanceMap).includes(key)) {
      return pTokenInstanceMap[key]
    } else {
      const pToken = new PTokenContract(chainId, contractAddress)
      //console.log("new PTokenContract", chainId, contractAddress)
      pTokenInstanceMap[key] = pToken
      return pToken
    }
  }
})()

export const lTokenFactory = (function() {
  const lTokenInstanceMap = {}
  return (chainId, contractAddress, poolAddress) => {
    let key = `${chainId}.${contractAddress}.${poolAddress}`
    if (Object.keys(lTokenInstanceMap).includes(key)) {
      return lTokenInstanceMap[key]
    } else {
      const lToken = new LTokenContract(chainId, contractAddress)
      //console.log("new LTokenContract", chainId, contractAddress)
      lTokenInstanceMap[key] = lToken
      return lToken
    }
  }
})()

export const deriFactory = (function () {
  const deriInstanceMap = {};
  return (chainId, contractAddress) => {
    let key = `${chainId}.${contractAddress}`;
    if (Object.keys(deriInstanceMap).includes(key)) {
      return deriInstanceMap[key];
    } else {
      const deri = new DeriContract(chainId, contractAddress);
      deriInstanceMap[key] = deri;
      return deri;
    }
  };
})();

export const slpPoolFactory = (function () {
  const slpPoolInstanceMap = {};
  return (chainId, contractAddress) => {
    let key;
    key = `${chainId}.${contractAddress}`;
    if (Object.keys(slpPoolInstanceMap).includes(key)) {
      return slpPoolInstanceMap[key];
    }
    const slpPool = new SlpPool(chainId, contractAddress);
    slpPoolInstanceMap[key] = slpPool;
    return slpPool;
  };
})();

export const clpPoolFactory = (function () {
  const clpPoolInstanceMap = {};
  return (chainId, contractAddress) => {
    let key;
    key = `${chainId}.${contractAddress}`;
    if (Object.keys(clpPoolInstanceMap).includes(key)) {
      return clpPoolInstanceMap[key];
    }
    const clpPool = new ClpPool(chainId, contractAddress);
    clpPoolInstanceMap[key] = clpPool;
    return clpPool;
  };
})();

export const clp2PoolFactory = (function () {
  const clp2PoolInstanceMap = {};
  return (chainId, contractAddress) => {
    let key = `${chainId}.${contractAddress}`;
    if (Object.keys(clp2PoolInstanceMap).includes(key)) {
      return clp2PoolInstanceMap[key];
    }
    const clp2Pool = new Clp2Pool(chainId, contractAddress);
    clp2PoolInstanceMap[key] = clp2Pool;
    return clp2Pool;
  };
})();

export const perpetualPoolV2Factory = (() => {
  let perpetualPoolInstanceMap = {}
  return (chainId, contractAddress) => {
    let key = `${chainId}.${contractAddress}`
    if (Object.keys(perpetualPoolInstanceMap).includes(key)) {
      return perpetualPoolInstanceMap[key];
    } else {
      const perpetualPool = new PerpetualPoolV2(chainId, contractAddress);
      //console.log("new PerpetualPoolContract");
      perpetualPoolInstanceMap[key] = perpetualPool;
      return perpetualPool;
    }
  }
})()
