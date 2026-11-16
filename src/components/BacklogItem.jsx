import { Link } from 'react-router-dom';
import { useBacklog } from '../context/BacklogContext';
import { STATUSES } from '../utils/statuses';

function BacklogItem({ entry }) {
  const { updateStatus, removeFromBacklog } = useBacklog();

  return (
    <div className="backlog-item">
      {entry.background_image ? (
        <img src={entry.background_image} alt={entry.name} className="backlog-image" />
      ) : (
        <div className="backlog-image game-image-placeholder">No image</div>
      )}
      <div className="backlog-info">
        <h3 className="game-title">
          <Link to={`/games/${entry.id}`}>{entry.name}</Link>
        </h3>
        <p className="game-meta">Released: {entry.released || 'TBA'}</p>
        <label htmlFor={`status-${entry.id}`} className="form-label">Status</label>
        <select
          id={`status-${entry.id}`}
          value={entry.status}
          onChange={(e) => updateStatus(entry.id, e.target.value)}
          className="form-select"
        >
          {STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <button onClick={() => removeFromBacklog(entry.id)} className="btn btn-secondary">
          Remove
        </button>
      </div>
    </div>
  );
}

export default BacklogItem;