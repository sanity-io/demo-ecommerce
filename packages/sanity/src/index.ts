import {assist} from '@sanity/assist'
import {colorInput} from '@sanity/color-input'
import {documentInternationalization} from '@sanity/document-internationalization'
import {googleMapsInput} from '@sanity/google-maps-input'
import {languageFilter} from '@sanity/language-filter'
import {presentationTool} from '@sanity/presentation'
import {scheduledPublishing} from '@sanity/scheduled-publishing'
import {visionTool} from '@sanity/vision'
import {AssetSource, defineConfig, isKeyedObject, type SingleWorkspace} from 'sanity'
import {structureTool} from 'sanity/structure'
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {workflow} from 'sanity-plugin-workflow'

import {CustomNavigator} from './components/studio/CustomNavigator'
import Logo from './components/studio/Logo'
import Navbar from './components/studio/Navbar'
import {ENVIRONMENT, LANGUAGES} from './constants'
import {locate} from './location'
import {customDocumentActions} from './plugins/customDocumentActions/index'
import {types} from './schema'
import resolveProductionUrl from './utils/resolveProductionUrl'
import {magazineStructure} from './workspaces/magazine/structure'
import {structure} from './workspaces/shared/structure'
import {defaultDocumentNode} from './workspaces/shared/structure/preview'

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
  if (typeof document === 'undefined') {
    throw new Error(
      'Sanity Studio can only run in the browser. Please check that this file is not being imported into a worker or server bundle.'
    )
  }

  const {title = 'AKVA', preview, shopify, ...rest} = config

  window[ENVIRONMENT] = {
    preview,
    shopify,
  }

  const sharedConfig = {
    ...rest,

    title,

    plugins: [
      presentationTool({
        previewUrl: preview.domain ?? window.location.origin,
        locate,
        components: {
          unstable_navigator: {
            minWidth: 120,
            maxWidth: 240,
            component: CustomNavigator,
          },
        },
      }),
      structureTool({
        structure,
        defaultDocumentNode,
      }),
      scheduledPublishing(),
      assist(),
      googleMapsInput({
        apiKey: 'AIzaSyAGcxPVmy0V7OtgCqTE62P9JMvscMHaq3c',
      }),
      colorInput(),
      imageHotspotArrayPlugin(),
      customDocumentActions(),
      media(),
      visionTool(),
      documentInternationalization({
        supportedLanguages: LANGUAGES,
        schemaTypes: ['guide', 'page'],
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
      workflow({
        // Required, list of document type names
        // schemaTypes: ['article', 'product'],
        schemaTypes: ['page', 'guide'],
        // Optional, see below
        // states: [],
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
            id: 'page-language',
            title: 'Page with Language',
            schemaType: 'page',
            parameters: [{name: 'language', type: 'string'}],
            value: (params: {language: string}) => ({
              language: params.language,
            }),
          },
        ].filter((template) => !['guide', 'page', 'translation.metadata'].includes(template.id))
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
  }
  console.log(sharedConfig.plugins)
  return defineConfig([
    {
      ...sharedConfig,
      title: 'Commerce',
      name: 'commerce',
      basePath: '/commerce',
    },
    {
      ...sharedConfig,
      title: 'Magazine Team',
      name: 'magazine',
      basePath: '/magazine',
      plugins: [
        structureTool({
          structure: magazineStructure,
        }),
        ...sharedConfig.plugins.filter(
          ({name}) => !['sanity/structure', '@sanity/vision'].includes(name)
        ),
      ],
    },
  ])
}
