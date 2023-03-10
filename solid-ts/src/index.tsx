import 'windi.css';
import './styles.css';
import { render } from 'solid-js/web';

import { App } from './App';
import { AppStoreProvider } from './store';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?'
  );
}

render(
  () => (
    <AppStoreProvider>
      <App />
    </AppStoreProvider>
  ),
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  root!
);
