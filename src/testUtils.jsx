import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BacklogProvider } from './context/BacklogContext';

export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <BacklogProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </BacklogProvider>
  );
}