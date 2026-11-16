import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../testUtils';
import GameDetailsPage from './GameDetailsPage';
import { getGameById } from '../services/rawgService';

vi.mock('../services/rawgService', () => ({
  getGameById: vi.fn()
}));

const mockGame = {
  id: 1,
  name: 'Detail Game',
  released: '2020-01-01',
  background_image: null,
  genres: [{ id: 1, name: 'Action' }],
  platforms: [{ platform: { name: 'PC' } }],
  description_raw: 'A great game',
  rating: 4.2
};

function renderDetails() {
  return renderWithProviders(
    <Routes>
      <Route path="/games/:id" element={<GameDetailsPage />} />
    </Routes>,
    { route: '/games/1' }
  );
}

describe('GameDetailsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    getGameById.mockResolvedValue(mockGame);
  });

  test('fetches the game using the id from the URL', async () => {
    renderDetails();

    expect(await screen.findByText('Detail Game')).toBeInTheDocument();
    expect(getGameById).toHaveBeenCalledWith('1');
  });

  test('shows the game details', async () => {
    renderDetails();

    expect(await screen.findByText('Genres: Action')).toBeInTheDocument();
    expect(screen.getByText('Platforms: PC')).toBeInTheDocument();
    expect(screen.getByText('A great game')).toBeInTheDocument();
  });

  test('adds and removes the game from the backlog', async () => {
    renderDetails();

    fireEvent.click(await screen.findByRole('button', { name: 'Add to Backlog' }));
    expect(screen.getByRole('button', { name: 'Remove from Backlog' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Remove from Backlog' }));
    expect(screen.getByRole('button', { name: 'Add to Backlog' })).toBeInTheDocument();
  });

  test('shows an error message when the request fails', async () => {
    getGameById.mockRejectedValue(new Error('fail'));
    renderDetails();

    expect(
      await screen.findByText('Failed to load this game. Please try again later.')
    ).toBeInTheDocument();
  });
});