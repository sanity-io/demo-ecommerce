import {ListItemBuilder} from 'sanity/desk';
import defineStructure from '../utils/defineStructure';
// @ts-expect-error incompatibility with node16 resolution
import {EarthGlobeIcon} from '@sanity/icons';

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Guides')
    .icon(EarthGlobeIcon)
    .schemaType('guide')
    .child(S.documentTypeList('guide')),
);
