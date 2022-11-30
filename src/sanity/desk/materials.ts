import {ListItemBuilder} from 'sanity/desk';
import {ComponentIcon} from '@sanity/icons';
import defineStructure from '../utils/defineStructure';

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Materials')
    .icon(ComponentIcon)
    .schemaType('material')
    .child(S.documentTypeList('material')),
);
