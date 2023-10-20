import {Box, Button, Card, Flex} from '@sanity/ui'
import type {NavbarProps} from 'sanity'

import {ENVIRONMENT} from '../../constants'
import ShopifyIcon from '../icons/Shopify'

export default function Navbar(props: NavbarProps) {
  const {storeDomain} = window[ENVIRONMENT].shopify

  return (
    <Card scheme="dark">
      <Flex align="center">
        <Box flex={1}>{props.renderDefault(props)}</Box>
        <Card scheme="dark" paddingRight={2}>
          <Button
            as="a"
            href={`https://${storeDomain}/admin/`}
            icon={ShopifyIcon}
            mode="bleed"
            title="Open Shopify Admin"
            target="_blank"
          />
        </Card>
      </Flex>
    </Card>
  )
}
