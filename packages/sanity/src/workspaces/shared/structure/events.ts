import {ListItemBuilder} from 'sanity/desk'

import defineStructure from '../../../utils/defineStructure'

export const eventNode = defineStructure<ListItemBuilder>((S) =>
  S.listItem().title('Events').schemaType('event').child(S.documentTypeList('event'))
)
