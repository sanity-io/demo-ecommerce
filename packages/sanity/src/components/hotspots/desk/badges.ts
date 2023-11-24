
import {StarIcon} from '@sanity/icons'
import type {ListItemBuilder} from 'sanity/desk'

import defineStructure from '../../../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Badges')
    .icon(StarIcon)
    .schemaType('badge')
    .child(
      S.documentTypeList('badge').child((documentId, context) => {
        const documentNode = context.structureContext.resolveDocumentNode({
          documentId,
          schemaType: 'badge',
        })

        return documentNode.views([...documentNode.getViews()])
      }),
    ),
)
