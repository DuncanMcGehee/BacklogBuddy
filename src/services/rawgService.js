const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = import.meta.env.VITE_RAWG_BASE_URL;

export async function getPopularGames() {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&ordering=-added&page_size=20`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }

  const data = await response.json();
  return data.results;
}

export async function searchGames(query) {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=20`
  );

  if (!response.ok) {
    throw new Error('Failed to search games');
  }

  const data = await response.json();
  return data.results;
}

export async function getGameById(id) {
  const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);

  if (!response.ok) {
    throw new Error('Failed to fetch game details');
  }

  return await response.json();
}