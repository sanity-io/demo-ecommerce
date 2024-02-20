import {StructureResolver} from 'sanity/structure'

import collections from '../shared/structure/collections'
import colorThemes from '../shared/structure/colorThemes'
import {eventNode} from '../shared/structure/events'
import home from '../shared/structure/home'
import materials from '../shared/structure/materials'
import pages from '../shared/structure/pages'
import people from '../shared/structure/people'
import products from '../shared/structure/products'
import settings from '../shared/structure/settings'

export const commerceStructure: StructureResolver = (S, context) =>
  S.list()
    .title('Commerce')
    .items([
      home(S, context),
      S.divider(),
      collections(S, context),
      products(S, context),
      S.divider(),
      pages(S, context),
      people(S, context),
      materials(S, context),
      S.documentTypeListItem('filter').title('Filters'),
      colorThemes(S, context),
      S.divider(),
      eventNode(S, context),
      S.divider(),
      settings(S, context),
      S.divider(),
    ])
