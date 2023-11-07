import {EarthGlobeIcon} from '@sanity/icons'
import {type DocumentActionDescription} from 'sanity'

import {ENVIRONMENT} from '../../constants'
import {collectionUrl, productUrl, productVariantUrl} from '../../utils/shopifyUrls'
import type {ShopifyDocument, ShopifyDocumentActionProps} from './types'

export default (props: ShopifyDocumentActionProps): DocumentActionDescription | undefined => {
  const {published, type}: {published: ShopifyDocument; type: string} = props
  const {storeDomain} = window[ENVIRONMENT].shopify

  if (!published || published?.store?.isDeleted) {
    return
  }

  let url: string | null = null

  if (type === 'collection') {
    url = collectionUrl(storeDomain, published?.store?.id)
  }
  if (type === 'product') {
    url = productUrl(storeDomain, published?.store?.id)
  }
  if (type === 'productVariant') {
    url = productVariantUrl(storeDomain, published?.store?.productId, published?.store?.id)
  }

  if (!url) {
    return
  }

  if (published && !published?.store?.isDeleted) {
    return {
      label: 'Edit in Shopify',
      icon: EarthGlobeIcon,
      onHandle: () => {
        url ? window.open(url) : void 'No URL'
      },
      shortcut: 'Ctrl+Alt+E',
    }
  }
}
