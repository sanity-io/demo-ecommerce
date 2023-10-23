import {colorInput} from '@sanity/color-input'
import {documentInternationalization} from '@sanity/document-internationalization'
import {languageFilter} from '@sanity/language-filter'
import {visionTool} from '@sanity/vision'
import {AssetSource, defineConfig, isKeyedObject, type SingleWorkspace} from 'sanity'
import {deskTool} from 'sanity/desk'
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {media, mediaAssetSource} from 'sanity-plugin-media'

import Logo from './components/studio/Logo'
import Navbar from './components/studio/Navbar'
import {ENVIRONMENT, LANGUAGES} from './constants'
import {structure} from './desk'
import {defaultDocumentNode} from './desk/preview'
import {customDocumentActions} from './plugins/customDocumentActions/index'
import {types} from './schema'
import resolveProductionUrl from './utils/resolveProductionUrl'

/**
 * Configuration options that will be passed in
 * from the environment or application
 */
type SanityConfig = Pick<SingleWorkspace, 'projectId' | 'dataset' | 'title' | 'basePath'> & {
  preview: {
    domain?: string
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

  window[ENVIRONMENT] = {
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
      // documentInternationalization({
      //   supportedLanguages: LANGUAGES,
      //   schemaTypes: ['material'],
      // }),
      internationalizedArray({
        languages: LANGUAGES,
        defaultLanguages: ['en'],
        fieldTypes: ['string', 'body', 'faqs', 'simpleBlockContent'],
        buttonLocations: ['unstable__fieldAction'],
      }),
      languageFilter({
        supportedLanguages: LANGUAGES,
        documentTypes: ['material', 'product', 'person'],
        filterField: (enclosingType, member, selectedLanguageIds) => {
          // Filter internationalized arrays
          if (
            enclosingType.jsonType === 'object' &&
            enclosingType.name.startsWith('internationalizedArray') &&
            'kind' in member
          ) {
            const language = isKeyedObject(member.field.path[1]) ? member.field.path[1]._key : null

            return language ? selectedLanguageIds.includes(language) : false
          }

          // Filter internationalized objects
          // `localeString` must be registered as a custom schema type
          if (enclosingType.jsonType === 'object' && enclosingType.name.startsWith('locale')) {
            return selectedLanguageIds.includes(member.name)
          }

          return true
        },
      }),
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

    studio: {
      components: {
        navbar: Navbar,
        logo: Logo,
      },
    },
  })
}
