import {ListItemBuilder, StructureResolver} from 'sanity/desk'

import {eventNode} from '../../shared/structure/events'
import guides from '../../shared/structure/guides'
import home from '../../shared/structure/home'
import {DOCUMENT_TYPES_IN_STRUCTURE} from '../../shared/structure/index'
import pages from '../../shared/structure/pages'

export const magazineStructure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      //home(S, context),
      guides(S, context),
      pages(S, context),
      S.divider(),
      //collections(S, context),
      //products(S, context),
      //S.divider(),
      //people(S, context),
      //materials(S, context),
      //S.documentTypeListItem('filter').title('Filters'),
      //colorThemes(S, context),
      //S.divider(),
      eventNode(S, context),
      //S.divider(),
      //settings(S, context),
      S.divider(),
      S.documentTypeListItem('assist.instruction.context').title('AI Context'),
      // Automatically add new document types to the root pane
      ...S.documentTypeListItems().filter(
        (listItem: ListItemBuilder) =>
          // @ts-expect-error Object is possibly 'undefined'
          !DOCUMENT_TYPES_IN_STRUCTURE.includes(listItem.getId().toString())
      ),
    ])
