import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import GameCard from './GameCard';

const mockGame = {
  id: 1,
  name: 'Test Game',
  released: '2020-01-01',
  background_image: 'https://example.com/image.jpg',
  genres: [{ id: 1, name: 'Action' }],
  rating: 4.5
};

describe('GameCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders the game information', () => {
    renderWithProviders(<GameCard game={mockGame} />);

    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('Released: 2020-01-01')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByAltText('Test Game')).toBeInTheDocument();
  });

  test('links to the game details page', () => {
    renderWithProviders(<GameCard game={mockGame} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/games/1');
  });

  test('shows a placeholder when there is no image', () => {
    renderWithProviders(<GameCard game={{ ...mockGame, background_image: null }} />);

    expect(screen.getByText('No image')).toBeInTheDocument();
  });

  test('toggles between add and remove when the button is clicked', () => {
    renderWithProviders(<GameCard game={mockGame} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add to Backlog' }));
    expect(screen.getByRole('button', { name: 'Remove from Backlog' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Remove from Backlog' }));
    expect(screen.getByRole('button', { name: 'Add to Backlog' })).toBeInTheDocument();
  });
});