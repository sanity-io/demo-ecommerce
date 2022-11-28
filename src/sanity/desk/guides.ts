import {ListItemBuilder} from 'sanity/desk';
import defineStructure from '../utils/defineStructure';
import {EarthGlobeIcon} from '@sanity/icons';

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Guides')
    .icon(EarthGlobeIcon)
    .schemaType('guide')
    .child(S.documentTypeList('guide')),
);
