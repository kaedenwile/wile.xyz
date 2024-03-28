import { createFileRoute } from '@tanstack/react-router';
import { Colony } from '../colony';

export const Route = createFileRoute('/colony')({
  component: Colony,
  beforeLoad: () => ({ title: 'wile.xyz ~ Colony', bodyClass: 'colony' }),
});
