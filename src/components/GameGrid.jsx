import GameCard from './GameCard';

function GameGrid({ games }) {
  if (games.length === 0) {
    return <p className="message">No games found.</p>;
  }

  return (
    <div className="games-grid">
      {games.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

export default GameGrid;