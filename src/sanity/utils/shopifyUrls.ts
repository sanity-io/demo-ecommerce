const storeDomain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN;

export const collectionUrl = (collectionId: number) => {
  if (!storeDomain) {
    return null;
  }
  return `https://${storeDomain}/admin/collections/${collectionId}`;
};

export const productUrl = (productId: number) => {
  if (!storeDomain) {
    return null;
  }
  return `https://${storeDomain}/admin/products/${productId}`;
};

export const productVariantUrl = (
  productId: number,
  productVariantId: number,
) => {
  if (!storeDomain) {
    return null;
  }
  return `https://${storeDomain}/admin/products/${productId}/variants/${productVariantId}`;
};
