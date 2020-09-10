export const getPrizeStrategyDataFromQueryResult = (addresses, data) => {
  let prizeStrategyData = {
    daiPrizeStrategy: {},
    usdcPrizeStrategy: {},
    // usdtPrizeStrategy: {},
    // wbtcPrizeStrategy: {},
  }

  if (addresses && data && data.prizeStrategies && data.prizeStrategies.length > 0) {
    const dynamicDaiData = data.prizeStrategies.find(prizePool => addresses.daiPrizeStrategy === prizePool.id)
    const dynamicUsdcData = data.prizeStrategies.find(prizePool => addresses.usdcPrizeStrategy === prizePool.id)
    // const dynamicUsdtData = data.prizeStrategies.find(prizePool => addresses.usdtPrizeStrategy === prizePool.id)
    // const dynamicWbtcData = data.prizeStrategies.find(prizePool => addresses.wbtcPrizeStrategy === prizePool.id)

    prizeStrategyData.daiPrizeStrategy = { prizeStrategyAddress: addresses.daiPrizeStrategy, ...prizeStrategyData.daiPrizeStrategy, ...dynamicDaiData }
    prizeStrategyData.usdcPrizeStrategy = { prizeStrategyAddress: addresses.usdcPrizeStrategy, ...prizeStrategyData.usdcPrizeStrategy, ...dynamicUsdcData }
    // prizeStrategyData.usdtPrizeStrategy = { prizeStrategyAddress: addresses.usdtPrizeStrategy, ...prizeStrategyData.usdtPrizeStrategy, ...dynamicUsdtData }
    // prizeStrategyData.wbtcPrizeStrategy = { prizeStrategyAddress: addresses.wbtcPrizeStrategy, ...prizeStrategyData.wbtcPrizeStrategy, ...dynamicWbtcData }
  }

  return prizeStrategyData
}
