import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './api';
import { AppLoginScreen, ThemeProvider } from './components';

export default function App() {
  return (
    <ThemeProvider forceColorScheme="light">
      <QueryClientProvider client={queryClient}>
        <AppLoginScreen />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
