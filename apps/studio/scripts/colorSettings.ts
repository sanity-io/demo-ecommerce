import type {PatchBuilder, PatchOperations, Transaction} from '@sanity/client'
import type {SanityDocumentLike} from 'sanity'
import {getCliClient} from 'sanity/cli'

type Patch = {
  id: string
  patch: PatchBuilder | PatchOperations
}

// This will use the client configured in ./sanity.cli.ts
const client = getCliClient()

// Get the settings document(s) from the dataset. We might have a draft, which will need patching too.
// We make the change to the structure in the GROQ query, so we don't need to do any transformation.
// We also fetch the _id and _rev, so we can use that to patch the document(s) later.
const fetchSettings = () =>
  client.fetch(
    `*[_type == 'settings'] {
      _id,
      _rev,
      customProductOptions[] {
        ...,
        _type == 'customProductOption.color' => {
          ...,
          colors[] {
            ...,
            '_type': 'customProductOption.colorObject',
          }
        },
        _type == 'customProductOption.size' => {
          ...,
          sizes[] {
            ...,
            '_type': 'customProductOption.sizeObject',
          }
        }
      }
    }`
  )

// Create a transaction from the patches
const createTransaction = (patches: Patch[]) =>
  patches.reduce((tx: Transaction, patch) => tx.patch(patch.id, patch.patch), client.transaction())

// Commit the transaction
const commitTransaction = (tx: Transaction) => tx.commit()

// Build the patches to apply to the settings document(s)
const buildSettingsPatches = (docs: SanityDocumentLike[]) =>
  docs.map((doc) => ({
    id: doc._id,
    patch: {
      set: {customProductOptions: doc.customProductOptions},
      // this will cause the migration to fail if any of the
      // documents have been modified since the original fetch.
      ifRevisionID: doc._rev,
    },
  }))

// Migrate the settings documents by getting the documents, building the patches, creating a transaction and committing it.
const migrateSettings = async () => {
  const documents = await fetchSettings()
  const patches = buildSettingsPatches(documents)

  if (patches.length === 0) {
    // eslint-disable-next-line no-console
    console.debug('🚨 No settings documents to migrate!')
    return null
  }

  //eslint-disable-next-line no-console
  console.debug(`⏳ Migrating ${patches.length} settings documents...`)
  const transaction = createTransaction(patches)
  await commitTransaction(transaction)
  console.debug(`✅ Settings migrated`)

  return
}

const runMigration = async () => {
  // eslint-disable-next-line no-console
  console.debug('🚀 Starting migration...')
  await migrateSettings()
  // eslint-disable-next-line no-console
  console.debug('👋 Migration complete!')
}

runMigration().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
