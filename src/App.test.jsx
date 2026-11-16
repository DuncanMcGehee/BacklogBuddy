import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

vi.mock('./services/rawgService', () => ({
  getPopularGames: vi.fn().mockResolvedValue([]),
  searchGames: vi.fn(),
  getGameById: vi.fn()
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  test('renders the header navigation', async () => {
    render(<App />);

    expect(screen.getByText('🎮 BacklogBuddy')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /My Backlog/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    await screen.findByText('No games found.');
  });

  test('shows the RAWG credit link in the footer', async () => {
    render(<App />);

    expect(screen.getByRole('link', { name: 'RAWG' })).toHaveAttribute(
      'href',
      'https://rawg.io'
    );
    await screen.findByText('No games found.');
  });

  test('navigates to the About page', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: 'About' }));

    expect(await screen.findByText('About BacklogBuddy')).toBeInTheDocument();
  });

  test('shows the 404 page for unknown routes', () => {
    window.history.pushState({}, '', '/xyz');
    render(<App />);

    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });
});