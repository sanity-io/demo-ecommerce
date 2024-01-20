export const collectionUrl = (storeDomain: string, collectionId: number) => {
  if (!storeDomain) {
    return null
  }
  return `https://${storeDomain}/admin/collections/${collectionId}`
}

export const productUrl = (storeDomain: string, productId: number) => {
  if (!storeDomain) {
    return null
  }
  return `https://${storeDomain}/admin/products/${productId}`
}

export const productVariantUrl = (
  storeDomain: string,
  productId: number,
  productVariantId: number,
) => {
  if (!storeDomain) {
    return null
  }
  return `https://${storeDomain}/admin/products/${productId}/variants/${productVariantId}`
}
