import {DefaultDocumentNodeResolver, StructureBuilder} from 'sanity/structure'
import {Iframe} from 'sanity-plugin-iframe-pane'

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
  if (PREVIEW_TYPES.includes(schemaType)) {
    return S.document().views([S.view.form(), previewPane(S)])
  } else {
    return S.document().views([S.view.form()])
  }
}
