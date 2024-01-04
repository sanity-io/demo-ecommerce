import {CogIcon, PackageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

const TITLE = 'Settings'

export default defineType({
  name: 'settings',
  title: TITLE,
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      default: true,
      name: 'navigation',
      title: 'Navigation',
      description: 'Settings related to site navigation, including menus and footers.',
    },
    {
      name: 'productOptions',
      title: 'Product Options',
      description: 'Customization options for products displayed on the site.',
    },
    {
      name: 'notFoundPage',
      title: '404 Page',
      description: 'Content and settings for the custom 404 (Not Found) page.',
    },
    {
      name: 'seo',
      title: 'SEO',
      description: 'Default SEO settings that apply to the entire site.',
    },
  ],
  fields: [
    // Menu
    defineField({
      name: 'menu',
      title: 'Menu',
      type: 'object',
      description: 'Configure the main navigation menu of the site.',
      group: 'navigation',
      options: {
        collapsed: false,
        collapsible: true,
      },
      fields: [
        // Links
        defineField({
          name: 'links',
          title: 'Links',
          type: 'array',
          description:
            'Add links to collection groups, internal pages, or external URLs to the menu.',
          of: [
            {
              name: 'collectionGroup',
              title: 'Collection Group',
              type: 'object',
              icon: PackageIcon,
              description: 'Group collections under a common title in the navigation menu.',
              fields: [
                //... other fields here
              ],
            },
            //... other link types here
          ],
        }),
      ],
    }),
    // Footer
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      description: 'Settings for the footer of the site, including links and additional text.',
      group: 'navigation',
      options: {
        collapsed: false,
        collapsible: true,
      },
      fields: [
        //... other fields here
      ],
    }),
    // Custom product options
    //... definition for customProductOptions
    // Not found page
    //... definition for notFoundPage
    // SEO
    //... definition for SEO
    // Language
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      description:
        'The default language setting for the site, used primarily for multi-language support.',
      hidden: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: TITLE,
      }
    },
  },
})
