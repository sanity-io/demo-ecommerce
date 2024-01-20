import {useEffect, useState} from 'react'
import {StringInputProps, useClient} from 'sanity'

import {SANITY_API_VERSION} from '../../constants'

export function ShopifyProductTagList(props: StringInputProps) {
  const [options, setOptions] = useState<string[]>([])
  const client = useClient({apiVersion: SANITY_API_VERSION})

  useEffect(() => {
    client
      .fetch(
        `array::unique(string::split(array::join(*[_type == 'product' && store.tags != ""].store.tags, ","), ","))`,
      )
      .then((tags) => {
        setOptions(tags)
      })
  }, [client])

  const newProps = {
    ...props,
    schemaType: {
      ...props.schemaType,
      options: {
        ...props.schemaType.options,
        list: options,
      },
    },
  }

  return newProps.renderDefault(newProps)
}
