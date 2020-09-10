import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { FetchGenericChainData } from 'lib/components/FetchGenericChainData'
import { FetchUsersChainData } from 'lib/components/FetchUsersChainData'
import { GraphDataQueries } from 'lib/components/queryComponents/GraphDataQueries'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { poolToast } from 'lib/utils/poolToast'
import { readProvider } from 'lib/utils/readProvider'

export const PoolDataContext = React.createContext()

export const PoolDataContextProvider = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const {
    supportedNetwork,
    networkName,
    chainId,
    usersAddress
  } = authControllerContext

  const [defaultReadProvider, setDefaultReadProvider] = useState({})

  const router = useRouter()
  const querySymbol = router.query.symbol && router.query.symbol.toLowerCase()

  useEffect(() => {
    const getReadProvider = async () => {
      const defaultReadProvider = await readProvider(networkName)
      setDefaultReadProvider(defaultReadProvider)
    }
    getReadProvider()
  }, [networkName])

  let poolAddresses
  try {
    if (supportedNetwork) {
      poolAddresses = getContractAddresses(chainId)
    }
  } catch (e) {
    poolToast.error(e)
    console.error(e)
  }

  return <>
    <GraphDataQueries
      {...props}
      poolAddresses={poolAddresses}
      usersAddress={usersAddress}
    >
      {({
        graphDataLoading,
        dynamicPoolData,
        dynamicPrizeStrategiesData,
        dynamicPlayerData,
        dynamicSponsorData,
        refetchPlayerQuery,
        refetchSponsorQuery,
      }) => {
        return <FetchGenericChainData
          {...props}
          chainId={chainId}
          provider={defaultReadProvider}
          poolAddresses={poolAddresses}
        >
          {({ genericChainData }) => {
            let pools = []

            if (!graphDataLoading) {
              pools = [
                {
                  ...genericChainData.daiPrizeStrategy,
                  ...dynamicPoolData.daiPool,
                  ...dynamicPrizeStrategiesData.daiPrizeStrategy,
                  name: 'DAI Pool',
                  frequency: 'Weekly',
                  symbol: 'PT-cDAI',
                },
                {
                  ...genericChainData.usdcPrizeStrategy,
                  ...dynamicPoolData.usdcPool,
                  ...dynamicPrizeStrategiesData.usdcPrizeStrategy,
                  name: 'USDC Pool',
                  frequency: 'Weekly',
                  symbol: 'PT-cUSDC',
                },
                // {
                //   ...genericChainData.usdtPrizeStrategy,
                //   ...dynamicPoolData.usdtPool,
                //   ...dynamicPrizeStrategiesData.usdtPrizeStrategy,
                //   name: 'Tether Pool',
                //   frequency: 'Weekly',
                //   symbol: 'PT-cUSDT',
                // },
                // {
                //   ...genericChainData.wbtcPrizeStrategy,
                //   ...dynamicPoolData.wbtcPool,
                //   ...dynamicPrizeStrategiesData.wbtcPrizeStrategy,
                //   yieldSource: 'Compound',
                //   name: 'Weekly Wrapped Bitcoin Pool',
                //   symbol: 'PT-cWBTC',
                // },
              ]
            }

            let pool
            if (querySymbol && pools?.length > 0) {
              pool = pools.find(_pool => {
                let symbol
                if (_pool && _pool.symbol) {
                  symbol = _pool.symbol.toLowerCase()
                }

                if (_pool && symbol) {
                  return symbol === querySymbol
                }
              })

              if (!pool) {
                pool = null
              }
            }

            const poolAddress = pool?.poolAddress
            const underlyingCollateralDecimals = pool?.underlyingCollateralDecimals

            let usersTicketBalance = 0
            let usersTicketBalanceBN = ethers.utils.bigNumberify(0)

            if (pool && dynamicPlayerData) {
              const player = dynamicPlayerData.find(data => data.prizePool.id === poolAddress)

              if (player && underlyingCollateralDecimals) {
                usersTicketBalance = Number(ethers.utils.formatUnits(
                  player.balance,
                  Number(underlyingCollateralDecimals)
                ))
                usersTicketBalanceBN = ethers.utils.bigNumberify(player.balance)
              }
            }

            let usersSponsorshipBalance = 0
            let usersSponsorshipBalanceBN = ethers.utils.bigNumberify(0)

            if (pool && dynamicSponsorData) {
              const sponsor = dynamicSponsorData.find(data => data.prizePool.id === poolAddress)

              if (sponsor && underlyingCollateralDecimals) {
                usersSponsorshipBalance = Number(ethers.utils.formatUnits(
                  sponsor.balance,
                  Number(underlyingCollateralDecimals)
                ))
                usersSponsorshipBalanceBN = ethers.utils.bigNumberify(sponsor.balance)
              }
            }


            return <FetchUsersChainData
              {...props}
              provider={defaultReadProvider}
              pool={pool}
              usersAddress={usersAddress}
            >
              {({ usersChainData }) => {
                return <PoolDataContext.Provider
                  value={{
                    loading: graphDataLoading,
                    pool,
                    pools,
                    poolAddresses,
                    dynamicPoolData,
                    dynamicPlayerData,
                    genericChainData,
                    refetchPlayerQuery,
                    refetchSponsorQuery,
                    usersChainData,
                    usersSponsorshipBalance,
                    usersSponsorshipBalanceBN,
                    usersTicketBalance,
                    usersTicketBalanceBN,
                  }}
                >
                  {props.children}
                </PoolDataContext.Provider>


              }}
            </FetchUsersChainData>
          }}
        </FetchGenericChainData>
      }}
    </GraphDataQueries>
  </>
}
