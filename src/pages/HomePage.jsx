import { useState, useEffect } from 'react';
import GameGrid from '../components/GameGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getPopularGames, searchGames } from '../services/rawgService';

function HomePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = searchTerm
          ? await searchGames(searchTerm)
          : await getPopularGames();
        setGames(data);
      } catch (err) {
        setError('Failed to load games. Please try again later.');
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    setSearchTerm('');
  };

  return (
    <div>
      <div className="page-header">
        <h2>{searchTerm ? `Results for "${searchTerm}"` : 'Popular Games'}</h2>
        <p>Find games to add to your backlog</p>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a game..."
          aria-label="Search games"
          className="search-input"
        />
        <button type="submit" className="btn btn-primary">Search</button>
        {searchTerm && (
          <button type="button" onClick={handleClear} className="btn btn-secondary">
            Clear
          </button>
        )}
      </form>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && <GameGrid games={games} />}
    </div>
  );
}

export default HomePage;