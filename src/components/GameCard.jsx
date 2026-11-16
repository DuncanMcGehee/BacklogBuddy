import { Link } from 'react-router-dom';
import { useBacklog } from '../context/BacklogContext';

function GameCard({ game }) {
  const { addToBacklog, removeFromBacklog, isInBacklog } = useBacklog();
  const saved = isInBacklog(game.id);

  const handleClick = () => {
    if (saved) {
      removeFromBacklog(game.id);
    } else {
      addToBacklog(game);
    }
  };

  const genres = game.genres?.map(genre => genre.name).join(', ');

  return (
    <div className="game-card">
      <Link to={`/games/${game.id}`} className="game-card-link">
        {game.background_image ? (
          <img src={game.background_image} alt={game.name} className="game-image" />
        ) : (
          <div className="game-image game-image-placeholder">No image</div>
        )}
        <div className="game-info">
          <h3 className="game-title">{game.name}</h3>
          <p className="game-meta">Released: {game.released || 'TBA'}</p>
          {genres && <p className="game-meta">{genres}</p>}
          {game.rating > 0 && <p className="game-meta">⭐ {game.rating}</p>}
        </div>
      </Link>
      <div className="game-actions">
        <button
          onClick={handleClick}
          className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`}
        >
          {saved ? 'Remove from Backlog' : 'Add to Backlog'}
        </button>
      </div>
    </div>
  );
}

export default GameCard;