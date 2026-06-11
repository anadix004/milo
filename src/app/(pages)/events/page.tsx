import type { Metadata } from 'next'
import EventsClient from './events-client'

export const metadata: Metadata = {
  title: 'Events — The Circuit | Milo',
  description: 'Browse all events on Milo. Underground techno, secret gigs, warehouse parties, rooftop sessions, chai walks, and art shows across Delhi, Mumbai, and Bangalore.',
  openGraph: {
    title: 'Events — The Circuit | Milo',
    description: 'Browse all events on Milo across Delhi, Mumbai, and Bangalore.',
  },
}

export default function EventsPage() {
  return <EventsClient />
}
