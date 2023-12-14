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
  /**
   * Prevent a consumer from importing into a worker/server bundle.
   */
  if(typeof document === 'undefined') {
    throw new Error('Sanity Studio can only run in the browser. Please check that this file is not being imported into a worker or server bundle.')
  }

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
      documentInternationalization({
        supportedLanguages: LANGUAGES,
        schemaTypes: ['guide', 'page', 'article', 'landingPage'],
      }),
      internationalizedArray({
        languages: LANGUAGES,
        defaultLanguages: ['en'],
        fieldTypes: ['string', 'body', 'faqs', 'simpleBlockContent', 'hero.collection'],
        buttonLocations: ['unstable__fieldAction'],
      }),
      languageFilter({
        supportedLanguages: LANGUAGES,
        documentTypes: ['collection', 'material', 'product', 'person'],
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
      templates: (prev) => {
        const prevFiltered = prev.filter((template) => template.id !== 'lesson')

        return [
          ...prevFiltered,
          {
            id: 'guide-language',
            title: 'Guide with Language',
            schemaType: 'guide',
            parameters: [{name: 'language', type: 'string'}],
            value: (params: {language: string}) => ({
              language: params.language,
            }),
          },
          {
            id: 'article-language',
            title: 'Article with Language',
            schemaType: 'article',
            parameters: [{name: 'language', type: 'string'}],
            value: (params: {language: string}) => ({
              language: params.language,
            }),
          },
          {
            id: 'landingPage-language',
            title: 'Landing Page with Language',
            schemaType: 'landingPage',
            parameters: [{name: 'language', type: 'string'}],
            value: (params: {language: string}) => ({
              language: params.language,
            }),
          },
          {
            id: 'promo-language',
            title: 'Promo with Language',
            schemaType: 'promo',
            parameters: [{name: 'language', type: 'string'}],
            value: (params: {language: string}) => ({
              language: params.language,
            }),
          },
          {
            id: 'banner-language',
            title: 'Banner with Language',
            schemaType: 'banner',
            parameters: [{name: 'language', type: 'string'}],
            value: (params: {language: string}) => ({
              language: params.language,
            }),
          },
          {
            id: 'page-language',
            title: 'Page with Language',
            schemaType: 'page',
            parameters: [{name: 'language', type: 'string'}],
            value: (params: {language: string}) => ({
              language: params.language,
            }),
          },
        ].filter((template) => !['guide', 'page', 'article', 'landingPage', 'translation.metadata'].includes(template.id))
      },
    },

    document: {
      productionUrl: resolveProductionUrl,
      unstable_comments: {
        enabled: true,
      },
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
