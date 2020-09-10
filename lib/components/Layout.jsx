import React, { useContext, useState } from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { AnimatePresence, motion, useViewportScroll } from 'framer-motion'

import {
  SUPPORTED_CHAIN_IDS,
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { NavAccount } from 'lib/components/NavAccount'
import { DepositWizardContainer } from 'lib/components/DepositWizardContainer'
import { HeaderLogo } from 'lib/components/HeaderLogo'
import { NavMobile } from 'lib/components/NavMobile'
import { NetworkText } from 'lib/components/NetworkText'
import { WithdrawWizardContainer } from 'lib/components/WithdrawWizardContainer'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'
import { LanguagePicker } from 'lib/components/LanguagePicker'
import { Settings } from 'lib/components/Settings'
import { SignInFormContainer } from 'lib/components/SignInFormContainer'
import { WrongNetworkModal } from 'lib/components/WrongNetworkModal'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index
}

export const Layout = (props) => {
  const {
    children
  } = props

  const [yScrollPosition, setYScrollPosition] = useState()
  const { scrollY } = useViewportScroll()

  scrollY.onChange(y => {
    setYScrollPosition(y)
  })

  const [showTransactionsDialog, setShowTransactionsDialog] = useState(false)

  const openTransactions = (e) => {
    e.preventDefault()
    setShowTransactionsDialog(true)
  }

  const closeTransactions = (e) => {
    if (e) {
      e.preventDefault()
    }
    setShowTransactionsDialog(false)
  }
  
  const router = useRouter()

  const signIn = router.query.signIn
  const deposit = /deposit/.test(router.asPath)
  const withdraw = /withdraw/.test(router.asPath)


  const authControllerContext = useContext(AuthControllerContext)
  const { supportedNetwork, usersAddress, chainId } = authControllerContext

  // this is useful for showing a big banner at the top that catches
  // people's attention
  const showingBanner = false
  // const showingBanner = chainId !== 1

  let supportedNetworkNames = SUPPORTED_CHAIN_IDS.map(chainId => chainIdToNetworkName(chainId))
  supportedNetworkNames = supportedNetworkNames.filter(onlyUnique)

  return <>
    <Meta />

    <AnimatePresence>
      {signIn && <SignInFormContainer />}
    </AnimatePresence>

    <AnimatePresence>
      {deposit && <DepositWizardContainer
        {...props}
      />}
    </AnimatePresence>

    <AnimatePresence>
      {withdraw && <WithdrawWizardContainer
        {...props}
      />}
    </AnimatePresence>

    <WrongNetworkModal />
    
    <div
      className='flex flex-col w-full'
      style={{
        minHeight: '100vh'
      }}
    >
      <motion.div
        className={classnames(
          'header fixed w-full bg-body z-30 pt-1 pb-1 xs:pt-2 xs:pb-0 sm:py-0 mx-auto l-0 r-0',
          { 
            'showing-network-banner': showingBanner
          }
        )}
      >
        <div
          className='flex justify-between items-center px-4 xs:px-12 sm:px-10 py-4 xs:pb-6 sm:pt-5 sm:pb-7 mx-auto'
        >
          <HeaderLogo />

          <div
            className={classnames(
              'flex items-center justify-end flex-row flex-wrap relative',
            )}
            style={{
              lineHeight: 0
            }}
          >
            {usersAddress && <>
              <NavAccount
                openTransactions={openTransactions}
                closeTransactions={closeTransactions}
                showTransactionsDialog={showTransactionsDialog}
              />
            </>}
            
            {usersAddress && chainId && chainId !== 1 && <>
              <NetworkText
                openTransactions={openTransactions}
              />
            </>}

            {/* this pushes the lang picker and settings gear onto it's own roll on mobile/tablet */}
            <div className='w-full sm:hidden'></div>

            <LanguagePicker />

            <Settings />
          </div>
        </div>

        <motion.div
          className='w-full'
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.025) 0px 0px 1px 1px, rgba(0, 0, 0, 0.1) 0px 1px 7px 1px',
            height: 0,
            maxWidth: '100vw',
          }}
          animate={yScrollPosition > 1 ? 'enter' : 'exit'}
          variants={{
            enter: {
              opacity: 1,
              transition: {
                duration: 1
              }
            },
            exit: {
              opacity: 0
            }
          }}
        >
        </motion.div>
      </motion.div>


      <div
        className={classnames(
          'grid-wrapper',
          {
            'showing-network-banner': showingBanner
          }
        )}
      >
        <div
          className={classnames(
            'sidebar hidden sm:block z-20',
            {
              'showing-network-banner': showingBanner
            }
          )}
        >
          <Nav />
        </div>

        <div className='content'>
          <div
            className='pool-container w-full flex flex-grow relative z-10 h-full page px-4 xs:px-12 sm:px-10 pt-6 xs:pt-6 sm:pt-8'
          >
            <div
              className='flex flex-col flex-grow'
            >

              <div
                className='relative flex flex-col flex-grow h-full z-10 text-white'
                style={{
                  flex: 1
                }}
              >
                <div
                  className='my-0 text-inverse sm:pt-2 lg:pt-4'
                >
                  {React.cloneElement(children, {
                    ...props,
                  })}
                </div>
              </div>

              {/* 
              <div
                className='main-footer z-10'
              >
                <Footer />
              </div> */}
              </div>
            </div>
          </div>

        </div>

      <NavMobile />
    </div>
  </>
}
