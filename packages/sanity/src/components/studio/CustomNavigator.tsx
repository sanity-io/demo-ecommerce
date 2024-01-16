import {usePresentationNavigate, usePresentationParams} from '@sanity/presentation'
import {Card, Stack, Text} from '@sanity/ui'

const pages = [
  {
    title: 'Home',
    url: '/',
  },
  {
    title: 'Magazine',
    url: '/pages/magazine',
  },
  {
    title: 'New Event',
    url: '/events/new-event',
  },
]

export function CustomNavigator() {
  const navigate = usePresentationNavigate()
  const {preview} = usePresentationParams()

  return (
    <Card>
      <Stack padding={2} space={1}>
        {pages.map(({url, title}) => (
          <Card
            key={title}
            as="button"
            onClick={() => navigate(url)}
            padding={3}
            pressed={preview === url}
            radius={2}
          >
            <Text>{title}</Text>
          </Card>
        ))}
      </Stack>
    </Card>
  )
}
