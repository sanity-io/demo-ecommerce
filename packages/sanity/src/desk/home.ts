import {ListItemBuilder} from 'sanity/desk'

import defineStructure from '../utils/defineStructure'
import {previewPane} from './preview'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Home')
    .schemaType('home')
    .child(
      S.editor()
        .title('Home')
        .schemaType('home')
        .documentId('home')
        .views([S.view.form(), previewPane(S)])
    )
)
