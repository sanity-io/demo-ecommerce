import { createStorefrontClient } from "@shopify/hydrogen-react";
import { useMemo } from "react";
import type { UserViewComponent } from "sanity/desk";

import { ENVIRONMENT } from "../../../constants";
import { StorefrontProvider } from "./Storefront";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const COLLECTION_QUERY = `
query getCollectionById($id: ID!) {
collection(id: $id) {
  title
}
}`;

const CollectionProducts: UserViewComponent = (props) =>{
    const {storeDomain, storefrontToken, apiVersion} = window[ENVIRONMENT].shopify

    const client = useMemo(() => createStorefrontClient({
        storeDomain,
        publicStorefrontToken: storefrontToken,
        storefrontApiVersion: apiVersion
    }), [apiVersion, storeDomain, storefrontToken])

    return <StorefrontProvider value={{client}}></StorefrontProvider>
}

export default CollectionProducts