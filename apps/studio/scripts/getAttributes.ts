/**
 * Install yargs with `npm install yargs`
 * To run: `sanity exec scripts/getAttributes.ts --with-user-token -- --dataset=production --resultFile`
 **/

import type {SanityDocument} from 'sanity'
import {getCliClient} from 'sanity/cli'
import {hideBin} from 'yargs/helpers'
import yargs from 'yargs/yargs'
const argv = yargs(hideBin(process.argv)).argv
const client = getCliClient({
  apiVersion: '2023-02-10',
}).withConfig({
  dataset: argv.dataset || 'production',
})
/**
 * @param {}
 * query: '*'
 */
getAttributes()
async function getAttributes({
  query = '*[_id == "drafts.3c2ad238-aebc-4944-b1c8-2d30298d69a4"]',
} = {}) {
  const response = (await client.fetch(query)) as SanityDocument[]
  // eslint-disable-next-line
  console.log([...new Set(response.map((i) => i._type))])
  const reduced = reducer(response, 'obj', [])
  const final = uniq(reduced)
  const file = argv.resultFile ? writeFile(final) : false
  // eslint-disable-next-line
  console.log(`
    ATTRIBUTES COUNTER:
    --------------------
​
    dataset: ${client.config().dataset}
    query: '${query}'
    resultFile: ${file}
    count: ${final.length}
  `)
}
// -------------
// UTILS
// -------------
function reducer(item: any, key: string, array: any[]) {
  if (Array.isArray(item)) {
    array.push(`${key}___array`)
    item.forEach((subItem) => {
      reducer(subItem, `${key}[]`, array)
    })
  } else if (typeof item === 'object') {
    array.push(`${key}___object`)
    Object.keys(item).forEach((subItem) => {
      reducer(item[subItem], `${key}.${subItem}`, array)
    })
  } else {
    const type = typeof item
    array.push(`${key}___${type}`)
  }
  return array
}
function uniq(array: string[]) {
  return [...new Set(array)]
}
function writeFile(array: string[]) {
  const fs = require('fs')
  const {v4: uuidGenerator} = require('uuid')
  const file = `./${uuidGenerator()}.txt`
  fs.writeFile(file, array.join('\n'), () => {
    return
  })
  return file
}
