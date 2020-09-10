import { ApolloLink, ApolloClient, HttpLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import Cookies from 'js-cookie'

import { STORED_CHAIN_ID_KEY } from 'lib/constants'
import { cache } from 'lib/apollo/cache'
import { networkNameToChainId } from 'lib/utils/networkNameToChainId'

let client

const GRAPH_CHAIN_URIS = {
  // 1: process.env.NEXT_JS_SUBGRAPH_URI_MAINNET,
  4: process.env.NEXT_JS_SUBGRAPH_URI_RINKEBY,
  42: process.env.NEXT_JS_SUBGRAPH_URI_KOVAN,
  // 1234: process.env.NEXT_JS_SUBGRAPH_URI_LOCALHOST
}

export async function v3ApolloClient() {
  if (client) {
    return client
  }

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        console.log(locations)
        console.warn(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      })
    }

    // The unexpected token JSON errors are when you're on an unsupported Eth network
    if (
      networkError?.message.match('Unexpected token < in JSON at position 0') ||
      networkError?.message.match('unexpected character at line 1 column 1 of the JSON data')
    ) {
      console.log(`[Network error]: ${networkError}`)
    } else if (networkError) {
      console.warn(`[Network error]: ${networkError}`)
    }
  })

  const customFetch = async (uri, options) => {
    let chainId = Cookies.get(STORED_CHAIN_ID_KEY) ? 
      Cookies.get(STORED_CHAIN_ID_KEY) :
      networkNameToChainId(NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME)

    let uriOverride = GRAPH_CHAIN_URIS[chainId]
    // console.log({ uriOverride})

    return fetch(
      uriOverride,
      options
    )
  }

  const link = ApolloLink.from([
    // errorLink,
    new HttpLink({
      fetch: customFetch
    }),
  ])

  const createAndStartApollo = () => {
    console.log('APOLLO: creating and starting apollo ..')
    client = new ApolloClient({
      cache,
      link
    })
    console.log('APOLLO: started ...')
  }

  const destroyApollo = async () => {
    console.log('APOLLO: stopping ...')

    if (client) {
      client.stop()
      console.log('APOLLO: stopped ...')
  
      client = null
      console.log('APOLLO: nulled ...')
    }
  }

  const resetApollo = async () => {
    // console.log('run reset store')
    // client.cache.reset()
    // client.resetStore()

    // should have been: clearStore() instead of resetStore() so we don't refetch
    // queries right away!

    destroyApollo()
    createAndStartApollo()
  }

  window.createAndStartApollo = createAndStartApollo
  window.destroyApollo = destroyApollo
  window.resetApollo = resetApollo

  window.addEventListener("beforeunload", function (e) {
    console.log('before unload')
    window.destroyApollo()
  })

  createAndStartApollo()

  return client
}
