import {ListItemBuilder} from 'sanity/desk';
import {ComponentIcon, StackCompactIcon} from '@sanity/icons';
import defineStructure from '../utils/defineStructure';

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Materials')
    .icon(ComponentIcon)
    .child(
      S.list()
        .title('Materials')
        .items([
          S.listItem()
            .title('Materials')
            .icon(ComponentIcon)
            .child(S.documentTypeList('material')),
          S.listItem()
            .title('Attributes')
            .icon(StackCompactIcon)
            .child(S.documentTypeList('materialAttribute')),
        ]),
    ),
);
