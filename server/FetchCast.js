import axios from "axios";

const API_KEY = process.env.TMDB_API_KEY;

export const getMovieCast = async (title) => {
  try {
    // Search movie
    const movie = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: API_KEY,
          query: title,
        },
      }
    );

    if (!movie.data.results.length) return [];

    const movieId = movie.data.results[0].id;

    // Get credits
    const credits = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      {
        params: {
          api_key: API_KEY,
        },
      }
    );

    return credits.data.cast.slice(0, 5).map(actor => ({
      name: actor.name,
      character: actor.character,
      profile_path: actor.profile_path
        ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
        : "",
    }));

  } catch (err) {
    console.log(err);
    return [];
  }
};