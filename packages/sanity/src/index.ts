import {assist} from '@sanity/assist'
import {colorInput} from '@sanity/color-input'
import {documentInternationalization} from '@sanity/document-internationalization'
import {languageFilter} from '@sanity/language-filter'
import {presentationTool} from '@sanity/presentation'
import {visionTool} from '@sanity/vision'
import {AssetSource, defineConfig, isKeyedObject, type SingleWorkspace} from 'sanity'
import {deskTool} from 'sanity/desk'
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {media, mediaAssetSource} from 'sanity-plugin-media'

import {structure} from './components/hotspots/desk'
import {defaultDocumentNode} from './components/hotspots/desk/preview'
import Logo from './components/studio/Logo'
//import Navbar from './components/studio/Navbar'
import {ENVIRONMENT, LANGUAGES} from './constants'
import {locate} from './location'
import {types} from './schema'
import resolveProductionUrl from './utils/resolveProductionUrl'
import { scheduledPublishing } from '@sanity/scheduled-publishing'
import { crossDatasetDuplicator } from '@sanity/cross-dataset-duplicator'

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
  const {title = 'US', preview, shopify, ...rest} = config

  window[ENVIRONMENT] = {
    preview,
    shopify,
  }

  const usConfig = {
    ...rest,

    title,

    plugins: [
     
      presentationTool({
        // title: 'Storefront',
        // name: 'storefront',
        // previewUrl: preview.domain ?? 'http://localhost:3000',
        previewUrl:
          typeof document === 'undefined' ? 'http://localhost:3000' : window.location.origin,
        locate,
      }),
      deskTool({
        title: 'Structure',
        structure,
        defaultDocumentNode,
      }),
      colorInput(),
      imageHotspotArrayPlugin(),
      // customDocumentActions(),
      media(),
      visionTool(),
      documentInternationalization({
        supportedLanguages: LANGUAGES,
        schemaTypes: ['guide', 'page'],
      }),
      internationalizedArray({
        languages: LANGUAGES,
        // disabling as default languages seems to create duplicates
        // defaultLanguages: ['en'],
        fieldTypes: ['string', 'body', 'faqs', 'simpleBlockContent', 'hero.collection'],
        buttonLocations: ['unstable__fieldAction'],
      }),
      assist(),
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
      scheduledPublishing(),
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
        //navbar: Navbar,
        // logo: Logo,
      },
    },

    name: 'us',
    basePath: '/us'
  }

  const caConfig = {
    ...rest,

    title: 'Canada',

    plugins: [
      deskTool({
        title: 'Structure',
        structure,
        defaultDocumentNode,
      }),
      colorInput(),
      imageHotspotArrayPlugin(),
      // customDocumentActions(),
      media(),
      visionTool(),
      documentInternationalization({
        supportedLanguages: LANGUAGES,
        schemaTypes: ['guide', 'page'],
      }),
      internationalizedArray({
        languages: LANGUAGES,
        // disabling as default languages seems to create duplicates
        // defaultLanguages: ['en'],
        fieldTypes: ['string', 'body', 'faqs', 'simpleBlockContent', 'hero.collection'],
        buttonLocations: ['unstable__fieldAction'],
      }),
      assist(),
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
      scheduledPublishing(),
      crossDatasetDuplicator({
        // Required settings to show document action
        types: ['article', 'page'],
        // Optional settings
        tool: true,
        filter: '_type != "product"',
        follow: []
      })
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
        //navbar: Navbar,
        // logo: Logo,
      },
    },

    name: 'Norway',
    basePath: '/norway',
    dataset: 'daniel-demo-nov-2023-b'
  }

  

  return defineConfig([usConfig, caConfig])
}
