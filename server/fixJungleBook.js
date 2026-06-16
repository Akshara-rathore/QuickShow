import 'dotenv/config';
import mongoose from 'mongoose';
import Movie from './models/Movie.js';
import Show from './models/Show.js';

await mongoose.connect(process.env.MONGODB_URI);

const poster =
https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOWf-qhH9A8dO4M_EwcPXIuTL1SbpinVTU9Q&s
const backdrop =
https://m.media-amazon.com/images/I/816Lz4OA8aL.jpg

const movieResult = await Movie.updateMany(
  { title: 'The Jungle Book' },
  {
    $set: {
      poster_path: poster,
      backdrop_path: backdrop,
    },
  }
);

const showResult = await Show.updateMany(
  { 'movie.title': 'The Jungle Book' },
  {
    $set: {
      'movie.poster_path': poster,
      'movie.backdrop_path': backdrop,
    },
  }
);

console.log('Movies updated:', movieResult.modifiedCount);
console.log('Shows updated:', showResult.modifiedCount);

await mongoose.disconnect();