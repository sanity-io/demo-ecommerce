import {EarthGlobeIcon} from '@sanity/icons'
import {defineType} from 'sanity'

import page from './page'

export default defineType({
  ...page,
  name: 'guide',
  title: 'Guide',
  icon: EarthGlobeIcon,
  
})
