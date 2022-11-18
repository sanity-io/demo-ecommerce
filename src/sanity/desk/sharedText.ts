import {ListItemBuilder} from 'sanity/desk';
import defineStructure from '../utils/defineStructure';

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Shared Text')
    .schemaType('sharedText')
    .child(S.documentTypeList('sharedText')),
);
