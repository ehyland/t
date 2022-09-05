import { useState } from 'react';
import './App.css';

export function App() {
  const [bootDate] = useState(() => new Date());
  return <span data-testid="date">{bootDate.toISOString()}</span>;
}
