// import type {PatchBuilder, PatchOperations, Transaction} from '@sanity/client'
// import type {SanityDocumentLike} from 'sanity'
import {getCliClient} from 'sanity/cli'

// type Patch = {
//   id: string
//   patch: PatchBuilder | PatchOperations
// }

// This will use the client configured in ./sanity.cli.ts
const client = getCliClient()

// Get the settings document(s) from the dataset. We might have a draft, which will need patching too.
// We make the change to the structure in the GROQ query, so we don't need to do any transformation.
// We also fetch the _id and _rev, so we can use that to patch the document(s) later.
const fetchSettings = () =>
  client.fetch(
    `*[_type == 'settings' && _id == "settings"][0] {
      "_id": "sharedText",
      "_type": "sharedText",
      labels,
      deliveryAndReturns,
    }`
  )

// Migrate the settings documents by getting the documents, building the patches, creating a transaction and committing it.
const migrateLabels = async () => {
  const labels = await fetchSettings()

  const transaction = client.transaction()
  transaction.createOrReplace(labels)

  //eslint-disable-next-line no-console
  console.debug(`⏳ Migrating settings documents to labels...`)

  await transaction
    .commit()
    .then((res) => {
      // eslint-disable-next-line no-console
      console.log(res)
    })
    .catch((err) => {
      console.error(err)
    })

  console.debug(`✅ Settings migrated`)

  return
}

const runMigration = async () => {
  // eslint-disable-next-line no-console
  console.debug('🚀 Starting migration...')
  await migrateLabels()
  // eslint-disable-next-line no-console
  console.debug('👋 Migration complete!')
}

runMigration().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
