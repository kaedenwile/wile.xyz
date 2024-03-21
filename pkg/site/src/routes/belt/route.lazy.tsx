import { Belt } from '../../belt';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/belt')({
  component: Belt,
});
