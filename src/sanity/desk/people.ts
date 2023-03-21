import DocumentsPane from 'sanity-plugin-documents-pane';
import type {ListItemBuilder, StructureBuilder} from 'sanity/desk';
import defineStructure from '../utils/defineStructure';

/**
 * Show products for this person
 */
const productsPane = (S: StructureBuilder) =>
  S.view
    .component(DocumentsPane)
    .options({
      query: `
        {
          'products': *[_type == 'product']{
            _id, _type, creators, 'title': store.title
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
    .title('People')
    .schemaType('person')
    .child(
      S.documentTypeList('person').child((documentId, context) => {
        const documentNode = context.structureContext.resolveDocumentNode({
          documentId,
          schemaType: 'person',
        });

        return documentNode.views([
          ...documentNode.getViews(),
          productsPane(S),
        ]);
      }),
    ),
);
