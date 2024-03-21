import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/belt/whats-new')({
  component: () => <div>Hello /belt/whats-new!</div>
})