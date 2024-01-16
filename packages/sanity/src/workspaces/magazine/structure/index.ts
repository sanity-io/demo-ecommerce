import {UsersIcon} from '@sanity/icons'
import {ListItemBuilder, StructureResolver} from 'sanity/desk'

import {eventNode} from '../../shared/structure/events'
import guides from '../../shared/structure/guides'
import home from '../../shared/structure/home'
import {DOCUMENT_TYPES_IN_STRUCTURE} from '../../shared/structure/index'
import pages from '../../shared/structure/pages'

export const magazineStructure: StructureResolver = (S, context) =>
  S.list()
    .title('Magazine content')
    .items([
      //home(S, context),
      S.documentTypeListItem('guide').title('Articles'),
      S.documentTypeListItem('guide')
        .id('top-guides')
        .title('Top performing stories')
        .icon(() => '🥇'),
      S.documentTypeListItem('guide')
        .id('whoops-guides')
        .title('Guides that needs attention')
        .icon(() => '👀'),
      S.divider(),
      pages(S, context),
      S.documentTypeListItem('page')
        .id('experiments')
        .title('Experiments')
        .icon(() => '🧪'),
      S.divider(),
      S.listItem().title('Authors').icon(UsersIcon),
      //collections(S, context),
      //products(S, context),
      //S.divider(),
      //people(S, context),
      //materials(S, context),
      //S.documentTypeListItem('filter').title('Filters'),
      //colorThemes(S, context),
      //S.divider(),
      //S.divider(),
      //settings(S, context),

      S.divider(),
      S.listItem()
        .title('Ads and channels')
        .icon(() => '📣')
        .child(
          S.list()
            .title('Ads and channels')

            .items([
              S.documentTypeListItem('ad')
                .title('All ads')
                .icon(() => '📣'),
              S.listItem()
                .title('Goolge')
                .child(
                  S.documentList()
                    .title('Goolge ads')
                    .schemaType('ad')
                    .filter('_type == "ad" && channel == $channel')
                    .params({channel: 'google'})
                ),
              S.listItem()
                .title('Instagram')
                .child(
                  S.documentList()
                    .title('Instagram ads')
                    .schemaType('ad')
                    .filter('_type == "ad" && channel == $channel')
                    .params({channel: 'instagram'})
                ),
              S.listItem()
                .title('Pinterest')
                .child(
                  S.documentList()
                    .title('Pinterest ads')
                    .schemaType('ad')
                    .filter('_type == "ad" && channel == $channel')
                    .params({channel: 'pinterest'})
                ),
              S.divider(),
              S.listItem().title('Ads by quarter/year'),
            ])
        ),

      S.divider(),
      eventNode(S, context),
      S.divider(),
      S.documentTypeListItem('assist.instruction.context').title('AI Context'),
      // Automatically add new document types to the root pane
      /* ...S.documentTypeListItems().filter(
        (listItem: ListItemBuilder) =>
          // @ts-expect-error Object is possibly 'undefined'
          !DOCUMENT_TYPES_IN_STRUCTURE.includes(listItem.getId().toString())
      ), */
    ])
