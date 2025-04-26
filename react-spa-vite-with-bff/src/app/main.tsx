import * as ReactDOM from 'react-dom/client';

import App from './App';
import { notNull } from './libs/object';

ReactDOM.createRoot(notNull(document.getElementById('root'))).render(<App />);
