import {Card, Flex, Spinner, Text} from '@sanity/ui'
import {lazy, Suspense} from 'react'
import type {UserViewComponent} from 'sanity/desk'

const LazyCollectionProducts = lazy(() => import('./CollectionProducts.js'))

const Loading = () => (
  <Flex align="center" direction="column" height="fill" justify="center" gap={3}>
    <Spinner muted />

    <Text align="center" muted size={1}>
      Loading products...
    </Text>
  </Flex>
)

export const CollectionProducts: UserViewComponent = (props) => (
  <Card padding={4}>
    <Suspense fallback={<Loading />}>
      <LazyCollectionProducts {...props} />
    </Suspense>
  </Card>
)
