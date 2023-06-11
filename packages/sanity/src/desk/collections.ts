import type {ListItemBuilder, StructureBuilder} from 'sanity/desk'

import {CollectionProducts} from '../components/collection/CollectionProducts'
import defineStructure from '../utils/defineStructure'

const SCHEMA_TYPE = 'collection'

/**
 * Show products that are included in a collection
 */
const collectionProductsPane = (S: StructureBuilder) =>
  S.view.component(CollectionProducts).id('products').title('Products')

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Collections')
    .schemaType(SCHEMA_TYPE)
    .child(
      S.documentTypeList(SCHEMA_TYPE).child((documentId, {structureContext}) => {
        const documentNode = structureContext.resolveDocumentNode({
          documentId,
          schemaType: SCHEMA_TYPE,
        })

        return documentNode.views([...documentNode.getViews(), collectionProductsPane(S)])
      })
    )
)
