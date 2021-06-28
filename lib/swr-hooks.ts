import useSWR from 'swr'

export function fetcher(url: string) {
  return window.fetch(url).then((res) => res.json())
}

export function useTrades() {
    const { data, error } = useSWR(`/api/get-trades`, fetcher)
    // console.log('data', data)

    return {
      trades: data,
      isLoading: !error && !data,
      isError: error,
  }
}


export function useLiquidities() {
  const { data, error } = useSWR(`/api/get-liquidities`, fetcher)
  // console.log('data', data)

  return {
    liquidities: data,
    isLoading: !error && !data,
    isError: error,
  }
}
export function useTradeRanks() {
  const { data, error } = useSWR(`/api/get-trade-ranks`, fetcher)
  //console.log('data', data)

  return {
    tradeRanks: data,
    isLoading: !error && !data,
    isError: error,
  }
}
export function useHomeCount() {
  const { data:trades, error:error1} = useSWR(`/api/get-trade-count`, fetcher)
  const { data:liquidities, error:error2} = useSWR(`/api/get-liquidity-count`, fetcher)
  // if (trades && liquidities) {
  //   console.log('data useCount', trades, liquidities)
  // }
  const data = {trades, liquidities}
   return {
    data,
    isLoading: (!error1 || !error2) && !trades && !liquidities,
    isError: error1 || error2,
  }
}
