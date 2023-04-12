import {ListItemBuilder} from 'sanity/desk';
import defineStructure from '../utils/defineStructure';
// @ts-expect-error incompatibility with node16 resolution
import {DocumentsIcon} from '@sanity/icons';

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Pages')
    .icon(DocumentsIcon)
    .schemaType('page')
    .child(S.documentTypeList('page')),
);
