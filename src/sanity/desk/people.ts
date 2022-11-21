import {ListItemBuilder} from 'sanity/desk';
import defineStructure from '../utils/defineStructure';

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('People')
    .schemaType('person')
    .child(S.documentTypeList('person').title('People')),
);
