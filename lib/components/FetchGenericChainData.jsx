import { useContext, useEffect, useState } from 'react'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchGenericChainData } from 'lib/utils/fetchGenericChainData'
import { isEmptyObject } from 'lib/utils/isEmptyObject'

export const FetchGenericChainData = (props) => {
  const {
    chainId,
    children,
    provider,
    poolAddresses,
  } = props

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext
  
  const [genericChainData, setGenericChainData] = useState({})

  const fetchDataFromInfura = async () => {
    try {
      const daiPrizeStrategy = await fetchGenericChainData(
        provider,
        poolAddresses['daiPrizeStrategy']
      )
      const usdcPrizeStrategy = await fetchGenericChainData(
        provider,
        poolAddresses['usdcPrizeStrategy']
      )
      // const usdtPrizeStrategy = await fetchGenericChainData(
      //   provider,
      //   poolAddresses['usdtPrizeStrategy']
      // )
      // const wbtcPrizeStrategy = await fetchGenericChainData(
      //   provider,
      //   poolAddresses['wbtcPrizeStrategy']
      // )

      return {
        daiPrizeStrategy,
        usdcPrizeStrategy,
        // usdtPrizeStrategy,
        // wbtcPrizeStrategy,
      }
    } catch (e) {
      console.warn(e)
      return {}
    }
  }

  const updateOrDelete = async () => {
    const genericData = await fetchDataFromInfura()
    setGenericChainData(genericData)
  }

  useInterval(() => {
    if (!isEmptyObject(provider)) {
      updateOrDelete()
    }
  }, paused ? null : MAINNET_POLLING_INTERVAL)

  useEffect(() => {
    if (!isEmptyObject(provider)) {
      updateOrDelete()
    }

    // OPTIMIZE: Could reset the interval loop here
    // since we just grabbed fresh data!
  }, [provider, chainId])

  return children({ genericChainData })
}
