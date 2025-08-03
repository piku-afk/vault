import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <StrictMode>
    <h1>Hello, world!</h1>
  </StrictMode>
);
