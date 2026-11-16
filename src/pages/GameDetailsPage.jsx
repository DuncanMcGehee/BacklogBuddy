import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useBacklog } from '../context/BacklogContext';
import { getGameById } from '../services/rawgService';

function GameDetailsPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToBacklog, removeFromBacklog, isInBacklog } = useBacklog();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getGameById(id);
        setGame(data);
      } catch (err) {
        setError('Failed to load this game. Please try again later.');
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div>
        <ErrorMessage message={error} />
        <Link to="/" className="back-link">← Back to Browse</Link>
      </div>
    );
  }

  const saved = isInBacklog(game.id);
  const genres = game.genres?.map(genre => genre.name).join(', ');
  const platforms = game.platforms?.map(item => item.platform.name).join(', ');

  const handleClick = () => {
    if (saved) {
      removeFromBacklog(game.id);
    } else {
      addToBacklog(game);
    }
  };

  return (
    <div className="details-page">
      <Link to="/" className="back-link">← Back to Browse</Link>
      <div className="details-layout">
        {game.background_image && (
          <img src={game.background_image} alt={game.name} className="details-image" />
        )}
        <div className="details-info">
          <h2>{game.name}</h2>
          <p className="game-meta">Released: {game.released || 'TBA'}</p>
          {genres && <p className="game-meta">Genres: {genres}</p>}
          {platforms && <p className="game-meta">Platforms: {platforms}</p>}
          {game.rating > 0 && <p className="game-meta">⭐ {game.rating}</p>}
          {game.metacritic && <p className="game-meta">Metacritic: {game.metacritic}</p>}
          <button
            onClick={handleClick}
            className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`}
          >
            {saved ? 'Remove from Backlog' : 'Add to Backlog'}
          </button>
        </div>
      </div>
      {game.description_raw && (
        <div className="details-description">
          <h3>About</h3>
          <p>{game.description_raw}</p>
        </div>
      )}
    </div>
  );
}

export default GameDetailsPage;