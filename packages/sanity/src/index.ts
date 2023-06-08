import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {types} from './schema'

/**
 * Configuration options that will be passed in
 * from the environment or application
 */
type SanityConfig = {
  projectId: string
  dataset: string
  title?: string
}

/**
 * Wrap whatever Sanity Studio configuration your project requires.
 *
 * In this example, it's a single workspace but adjust as necessary.
 */
export function defineSanityConfig(config: SanityConfig) {
  const {projectId, dataset, title = 'Sanity Studio'} = config

  return defineConfig({
    title,

    projectId,
    dataset,

    plugins: [deskTool(), visionTool()],

    schema: {
      types,
    },
  })
}
