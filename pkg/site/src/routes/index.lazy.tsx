import { createLazyFileRoute } from '@tanstack/react-router';
import { Home } from '../home';

export const Route = createLazyFileRoute('/')({
  component: Home,
});
