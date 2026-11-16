import { useState } from 'react';
import { Link } from 'react-router-dom';
import BacklogItem from '../components/BacklogItem';
import { useBacklog } from '../context/BacklogContext';
import { STATUSES } from '../utils/statuses';

function BacklogPage() {
  const { entries } = useBacklog();
  const [filter, setFilter] = useState('All');

  const visibleEntries =
    filter === 'All' ? entries : entries.filter(entry => entry.status === filter);

  const getCount = (status) => {
    return status === 'All'
      ? entries.length
      : entries.filter(entry => entry.status === status).length;
  };

  return (
    <div>
      <div className="page-header">
        <h2>My Backlog</h2>
        <p>Track what you want to play, are playing, and have finished</p>
      </div>

      {entries.length === 0 ? (
        <p className="message">
          Your backlog is empty. <Link to="/">Browse games</Link> to add some!
        </p>
      ) : (
        <>
          <div className="filter-buttons">
            {['All', ...STATUSES].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
              >
                {status} ({getCount(status)})
              </button>
            ))}
          </div>

          {visibleEntries.length === 0 ? (
            <p className="message">No games with the status "{filter}".</p>
          ) : (
            <div className="backlog-list">
              {visibleEntries.map(entry => (
                <BacklogItem key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BacklogPage;