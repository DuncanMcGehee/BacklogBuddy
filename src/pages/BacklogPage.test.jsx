import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import BacklogPage from './BacklogPage';

const seedEntries = [
  { id: 1, name: 'Game One', background_image: null, released: '2020-01-01', status: 'Backlog' },
  { id: 2, name: 'Game Two', background_image: null, released: '2021-01-01', status: 'Playing' }
];

describe('BacklogPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows an empty message when there are no games', () => {
    renderWithProviders(<BacklogPage />);

    expect(screen.getByText(/Your backlog is empty/)).toBeInTheDocument();
  });

  test('shows the saved games', () => {
    localStorage.setItem('backlogbuddy-entries', JSON.stringify(seedEntries));
    renderWithProviders(<BacklogPage />);

    expect(screen.getByText('Game One')).toBeInTheDocument();
    expect(screen.getByText('Game Two')).toBeInTheDocument();
  });

  test('filters games by status', () => {
    localStorage.setItem('backlogbuddy-entries', JSON.stringify(seedEntries));
    renderWithProviders(<BacklogPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Playing (1)' }));

    expect(screen.getByText('Game Two')).toBeInTheDocument();
    expect(screen.queryByText('Game One')).not.toBeInTheDocument();
  });

  test('changes a game status', () => {
    localStorage.setItem('backlogbuddy-entries', JSON.stringify([seedEntries[0]]));
    renderWithProviders(<BacklogPage />);

    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'Completed' }
    });

    expect(screen.getByLabelText('Status')).toHaveValue('Completed');
    expect(screen.getByRole('button', { name: 'Completed (1)' })).toBeInTheDocument();
  });

  test('removes a game from the backlog', () => {
    localStorage.setItem('backlogbuddy-entries', JSON.stringify([seedEntries[0]]));
    renderWithProviders(<BacklogPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(screen.getByText(/Your backlog is empty/)).toBeInTheDocument();
  });
});