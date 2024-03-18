import { useState } from 'react';
import { Home } from './home/Home.tsx';

export const Router = () => {
  const [route] = useState<string>(window.location.pathname);

  if (route === '/') {
    return <Home />;
  }
};
