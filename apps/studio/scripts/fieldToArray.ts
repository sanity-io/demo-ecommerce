/* eslint-disable no-console */

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2023-06-30'})

// Migration script to change a flat field to an internationalized array

// 1. Take a backup of your dataset
// `npx sanity@latest dataset export`
// Consider making a duplicate and testing the migration on that first

// 2. Modify this "TYPE" and "FIELD_NAME" variables
// to match the data you need to change

const TYPE = `collection`
const FIELD_NAME = `hero`

// 3. Run this script with:
// `sanity exec ./migrations/fieldToArray.ts --with-user-token`

const fetchDocuments = () =>
  client.fetch(
    `*[_type == $type 
        && defined(${FIELD_NAME}) 
        && !(${FIELD_NAME}[0]._key == "en")
    ][0...100] {_id, _rev, ${FIELD_NAME}}`,
    {type: TYPE}
  )

const buildPatches = (docs) =>
  docs.map((doc) => ({
    id: doc._id,
    patch: {
      set: {
        // Convert existing object to array
        [FIELD_NAME]: [
          {
            _key: 'en',
            value: doc[FIELD_NAME],
          },
        ],
      },
      // this will cause the migration to fail if any of the documents has been
      // modified since it was fetched.
      ifRevisionID: doc._rev,
    },
  }))

const createTransaction = (patches) =>
  patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction())

const commitTransaction = (tx) => tx.commit()

const migrateNextBatch = async () => {
  const documents = await fetchDocuments()
  const patches = buildPatches(documents)
  if (patches.length === 0) {
    console.log('No more documents to migrate!')
    return null
  }
  console.log(
    `Migrating batch:\n %s`,
    patches.map((patch) => `${patch.id} => ${JSON.stringify(patch.patch)}`).join('\n')
  )

  const transaction = createTransaction(patches)
  await commitTransaction(transaction)
  return migrateNextBatch()
}

migrateNextBatch().catch((err) => {
  console.error(err)

  throw new Error('Migration failed')
})
