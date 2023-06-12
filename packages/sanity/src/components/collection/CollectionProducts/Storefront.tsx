import type {createStorefrontClient} from '@shopify/hydrogen-react'
import {createContext, useContext} from 'react'


type StorefrontContext = {
    client: ReturnType<typeof createStorefrontClient>
}

const Storefront = createContext<StorefrontContext | null>(null)

export const StorefrontProvider = Storefront.Provider

/**
 * Storefront API Client
 */
export function useStorefrontClient(){
    const storefront = useContext(Storefront)

    if(!storefront){
        throw new Error('No storefront provider found')
    }

    return storefront.client
}