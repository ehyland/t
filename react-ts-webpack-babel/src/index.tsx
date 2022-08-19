import { createRoot } from 'react-dom/client';
import { cascadeLarger } from './assets';

const root = createRoot(document.getElementById('root')!);

root.render(
  <>
    <h1>Hello</h1>
    <img src={cascadeLarger} width="400" />
  </>
);
