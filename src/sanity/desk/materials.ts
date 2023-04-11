import type {ListItemBuilder, StructureBuilder} from 'sanity/desk';
// @ts-expect-error incompatibility with node16 resolution
import {ComponentIcon} from '@sanity/icons';
import defineStructure from '../utils/defineStructure';
import DocumentsPane from 'sanity-plugin-documents-pane';

/**
 * Show products where a material is used
 */
const productsPane = (S: StructureBuilder) =>
  S.view
    .component(DocumentsPane)
    .options({
      query: `
        {
          'products': *[_type == 'product']{
            _id, _type, composition, 'title': store.title
          }
        }
        {
          'drafts': products[_id in path('drafts.**')],
          'published': products[!(_id in path('drafts.**'))]
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
          'products': [...onlyDrafts, ...both, ...onlyPublished]{'latest': coalesce(draft, published)}[].latest
        }.products[references($id)] | order(title)
      `,
      params: {id: `_id`},
      debug: true,
    })
    .id('products')
    .title('Products');

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Materials')
    .icon(ComponentIcon)
    .schemaType('material')
    .child(
      S.documentTypeList('material').child((documentId, context) => {
        const documentNode = context.structureContext.resolveDocumentNode({
          documentId,
          schemaType: 'material',
        });

        return documentNode.views([
          ...documentNode.getViews(),
          productsPane(S),
        ]);
      }),
    ),
);
