import BigNumber from 'bignumber.js';
import {formatDistance} from 'date-fns'

// == bg
BigNumber.config({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: 256,
});

export const bg = (value, base = 0) => {
  if (base === 0) {
    return new BigNumber(value);
  }
  if (base > 0) {
    return new BigNumber(value).times(new BigNumber(`1${'0'.repeat(base)}`));
  }
  return new BigNumber(value).div(new BigNumber(`1${'0'.repeat(-base)}`));
};

export const toNatural = (str:string) => {
  if (str.indexOf(',') === -1) {
    return bg(str, -18).toFixed(2).toString()
  } else {
    const arr = str.split(',')
    return arr.map((i) => bg(i,-18).toFixed(2).toString()).join(',')
  }
}

export const compactAddress = (address:string) => address.slice(0,6) + '...' + address.slice(-4)

export const toAddressUrl = (chainId:string, address: string, type: string = 'address') => {
  if (chainId === '56') {
    return `https://bscscan.com/${type}/${address}`
  } else if (chainId === '97') {
    return `https://testnet.bscscan.com/${type}/${address}`
  } else if (chainId === '80001') {
    return `https://explorer-mumbai.maticvigil.com/${type}/${address}`
  }
}

export const directionClass  = (direction) => {
  if (direction === 'LONG' || direction === 'AddLiquidity') {
    return 'bg-green-600 text-white text-xs py-1 px-2 rounded-md'
  } else if (direction === 'SHORT' || direction === 'RemoveLiquidity') {
    return 'bg-red-600 text-white text-xs py-1 px-2 rounded-md'
  } else if (direction === 'LIQUIDATION') {
    return 'bg-purple-600 text-white text-xs py-1 px-2 rounded-md'
  }
}
export const timeAgo = (date: string) => {
  return formatDistance(new Date(date), new Date(), {addSuffix:true})
}

export const liquidityDirection = (volume: string) => {
  if (bg(volume, -18).gt(0)) {
    return 'AddLiquidity'
  } else {
    return 'RemoveLiquidity'
  }
}
