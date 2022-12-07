/**
 * Desk structure overrides
 */

import {ListItemBuilder, StructureResolver} from 'sanity/desk';
import collections from './collections';
import colorThemes from './colorThemes';
import guides from './guides';
import materials from './materials';
import home from './home';
import pages from './pages';
import people from './people';
import products from './products';
import settings from './settings';

/**
 * Desk structure overrides
 *
 * Sanity Studio automatically lists document types out of the box.
 * With this custom desk structure we achieve things like showing the `home`
 * and `settings` document types as singletons, and grouping product details
 * and variants for easy editorial access.
 *
 * You can customize this even further as your schemas progress.
 * To learn more about structure builder, visit our docs:
 * https://www.sanity.io/docs/overview-structure-builder
 */

// If you add document types to desk structure manually, you can add them to this array to prevent duplicates in the root pane
const DOCUMENT_TYPES_IN_STRUCTURE = [
  'collection',
  'colorTheme',
  'guide',
  'home',
  'material',
  'media.tag',
  'page',
  'person',
  'product',
  'productVariant',
  'settings',
];

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      home(S, context),
      pages(S, context),
      guides(S, context),
      S.divider(),
      collections(S, context),
      products(S, context),
      S.divider(),
      people(S, context),
      materials(S, context),
      colorThemes(S, context),
      S.divider(),
      settings(S, context),
      S.divider(),
      // Automatically add new document types to the root pane
      ...S.documentTypeListItems().filter(
        (listItem: ListItemBuilder) =>
          // @ts-expect-error Object is possibly 'undefined'
          !DOCUMENT_TYPES_IN_STRUCTURE.includes(listItem.getId().toString()),
      ),
    ]);
