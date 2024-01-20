import {InfoOutlineIcon} from '@sanity/icons'
import {ListItemBuilder, StructureBuilder} from 'sanity/structure'
import DocumentsPane from 'sanity-plugin-documents-pane'

import defineStructure from '../utils/defineStructure'
import {previewPane} from './preview'

/**
 * Show guides where a product is referenced
 */
const guidesPane = (S: StructureBuilder) =>
  S.view
    .component(DocumentsPane)
    .options({
      query: `
        {
          // Limit payload to just those fields that are needed or
          // would have product references
          'guides': *[_type == 'guide']{_id, _type, title, body, hero}
        }
        {
          'drafts': guides[_id in path('drafts.**')],
          'published': guides[!(_id in path('drafts.**'))]
        }
        {
          drafts,
          published,
          'both': published[('drafts.'+_id) in ^.drafts[]._id]{'published': @, 'draft': ^.drafts[_id == ('drafts.' + ^._id)][0]}
        }
        {
          'onlyDrafts': drafts[!(_id in ^.both[].draft._id)]{'draft': @},
          'onlyPublished': published[!(_id in ^.both[].published._id)]{'published': @},
          both
        }
        {
          'guides': [...onlyDrafts, ...both, ...onlyPublished]{'latest': coalesce(draft, published)}[].latest
        }.guides[references($id)] | order(title)
      `,
      params: {id: `_id`},
    })
    .id('guides')
    .title('Guides')

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Products')
    .schemaType('product')
    .child(
      S.documentTypeList('product')
        // .defaultLayout('detail')
        .child(async (id) =>
          S.list()
            .title('Product')
            .canHandleIntent(
              (intentName, params) => intentName === 'edit' && params.type === 'product',
            )
            .items([
              S.listItem()
                .title('Details')
                .icon(InfoOutlineIcon)
                .schemaType('product')
                .id(id)
                .child(
                  S.document()
                    .schemaType('product')
                    .documentId(id)
                    .views([S.view.form(), previewPane(S), guidesPane(S)]),
                ),
              // Product variants
              S.listItem()
                .title('Variants')
                .schemaType('productVariant')
                .child(
                  S.documentList()
                    .title('Variants')
                    .schemaType('productVariant')
                    .filter(
                      `
                      _type == "productVariant"
                      && store.productId == $productId
                    `,
                    )
                    .params({
                      productId: Number(id.replace('shopifyProduct-', '')),
                    })
                    .canHandleIntent(
                      (intentName, params) =>
                        intentName === 'edit' && params.type === 'productVariant',
                    ),
                ),
            ]),
        ),
    ),
)
