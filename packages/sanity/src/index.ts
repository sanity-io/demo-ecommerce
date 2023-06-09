import {colorInput} from '@sanity/color-input'
import {visionTool} from '@sanity/vision'
import {AssetSource, defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array'
import {media, mediaAssetSource} from 'sanity-plugin-media'

import {structure} from './desk'
import {defaultDocumentNode} from './desk/preview'
import {customDocumentActions} from './plugins/customDocumentActions/index'
import {types} from './schema'
import resolveProductionUrl from './utils/resolveProductionUrl'

/**
 * Configuration options that will be passed in
 * from the environment or application
 */
type SanityConfig = {
  projectId: string
  dataset: string
  title?: string
  basePath?: string
  apiVersion?: string
  preview: {
    domain: string
    secret: string
  }
  shopify: {
    storeDomain: string
  }
}

/**
 * Wrap whatever Sanity Studio configuration your project requires.
 *
 * In this example, it's a single workspace but adjust as necessary.
 */
export function defineSanityConfig(config: SanityConfig) {
  const {title = 'AKVA', preview, shopify, ...rest} = config

  // TODO: don't set on `global`
  globalThis.env = {
    preview,
    shopify,
  }

  return defineConfig({
    ...rest,

    title,

    plugins: [
      deskTool({
        structure,
        defaultDocumentNode,
      }),
      colorInput(),
      imageHotspotArrayPlugin(),
      customDocumentActions(),
      media(),
      visionTool(),
    ],

    schema: {
      types,
    },

    document: {
      productionUrl: resolveProductionUrl,
    },

    form: {
      file: {
        assetSources: (previousAssetSources: AssetSource[]) => {
          return previousAssetSources.filter((assetSource) => assetSource !== mediaAssetSource)
        },
      },
      image: {
        assetSources: (previousAssetSources: AssetSource[]) => {
          return previousAssetSources.filter((assetSource) => assetSource === mediaAssetSource)
        },
      },
    },
  })
}
