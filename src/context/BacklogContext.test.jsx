import { render, screen, fireEvent } from '@testing-library/react';
import { BacklogProvider, useBacklog } from './BacklogContext';

const game = {
  id: 1,
  name: 'Test Game',
  background_image: null,
  released: '2020-01-01'
};

function TestComponent() {
  const { entries, addToBacklog, updateStatus, removeFromBacklog } = useBacklog();

  return (
    <div>
      <p data-testid="count">{entries.length}</p>
      <p data-testid="status">{entries[0]?.status ?? 'none'}</p>
      <button onClick={() => addToBacklog(game)}>add</button>
      <button onClick={() => updateStatus(1, 'Playing')}>play</button>
      <button onClick={() => removeFromBacklog(1)}>remove</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <BacklogProvider>
      <TestComponent />
    </BacklogProvider>
  );
}

describe('BacklogContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('starts with an empty backlog', () => {
    renderWithProvider();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  test('adds a game with the Backlog status', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('add'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('status')).toHaveTextContent('Backlog');
  });

  test('does not add the same game twice', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('add'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  test('updates a game status', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('play'));

    expect(screen.getByTestId('status')).toHaveTextContent('Playing');
  });

  test('removes a game', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('remove'));

    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  test('saves the backlog to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('add'));

    const saved = JSON.parse(localStorage.getItem('backlogbuddy-entries'));
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe('Test Game');
  });

  test('loads saved entries from localStorage', () => {
    localStorage.setItem(
      'backlogbuddy-entries',
      JSON.stringify([{ ...game, status: 'Completed' }])
    );
    renderWithProvider();

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('status')).toHaveTextContent('Completed');
  });

  test('falls back to an empty backlog when saved data is invalid', () => {
    localStorage.setItem('backlogbuddy-entries', 'not valid json');
    renderWithProvider();

    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  test('throws when used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useBacklog must be used within BacklogProvider'
    );

    spy.mockRestore();
  });
});