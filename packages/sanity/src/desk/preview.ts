import type {DefaultDocumentNodeResolver, StructureBuilder, View, ViewBuilder} from 'sanity/desk'
import Iframe from 'sanity-plugin-iframe-pane'

import {resolvePreviewUrl} from '../utils/resolveProductionUrl'

const PREVIEW_TYPES = ['page', 'product', 'home', 'guide', 'collection', 'person']

export const previewPane = (S: StructureBuilder) => {
  return S.view
    .component(Iframe)
    .title('Preview')
    .options({
      url: resolvePreviewUrl,
      reload: {
        button: true,
      },
    })
}

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, options) => {
  const {schemaType} = options
  let views: (View | ViewBuilder)[] = [S.view.form()]

  if (PREVIEW_TYPES.includes(schemaType)) {
    views.push(previewPane(S))
  }

  return S.document().views(views)
}
