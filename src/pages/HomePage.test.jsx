import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import HomePage from './HomePage';
import { getPopularGames, searchGames } from '../services/rawgService';

vi.mock('../services/rawgService', () => ({
  getPopularGames: vi.fn(),
  searchGames: vi.fn()
}));

const mockGames = [
  { id: 1, name: 'Game One', released: '2020-01-01', background_image: null, genres: [] },
  { id: 2, name: 'Game Two', released: '2021-01-01', background_image: null, genres: [] }
];

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    getPopularGames.mockResolvedValue(mockGames);
  });

  test('shows a loading message and then the popular games', async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText('Loading games...')).toBeInTheDocument();
    expect(await screen.findByText('Game One')).toBeInTheDocument();
    expect(screen.getByText('Game Two')).toBeInTheDocument();
    expect(screen.getByText('Popular Games')).toBeInTheDocument();
  });

  test('shows an error message when the request fails', async () => {
    getPopularGames.mockRejectedValue(new Error('fail'));
    renderWithProviders(<HomePage />);

    expect(
      await screen.findByText('Failed to load games. Please try again later.')
    ).toBeInTheDocument();
  });

  test('searches for games when the form is submitted', async () => {
    searchGames.mockResolvedValue([
      { id: 3, name: 'Zelda', released: '2017-03-03', background_image: null, genres: [] }
    ]);
    renderWithProviders(<HomePage />);
    await screen.findByText('Game One');

    fireEvent.change(screen.getByLabelText('Search games'), {
      target: { value: 'zelda' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findByText('Zelda')).toBeInTheDocument();
    expect(searchGames).toHaveBeenCalledWith('zelda');
    expect(screen.getByText('Results for "zelda"')).toBeInTheDocument();
  });

  test('clears the search and shows popular games again', async () => {
    searchGames.mockResolvedValue([
      { id: 3, name: 'Zelda', released: '2017-03-03', background_image: null, genres: [] }
    ]);
    renderWithProviders(<HomePage />);
    await screen.findByText('Game One');

    fireEvent.change(screen.getByLabelText('Search games'), {
      target: { value: 'zelda' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await screen.findByText('Zelda');

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(await screen.findByText('Game One')).toBeInTheDocument();
    expect(screen.getByText('Popular Games')).toBeInTheDocument();
  });
});