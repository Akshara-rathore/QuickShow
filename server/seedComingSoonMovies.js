import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "./models/movie.js";

dotenv.config();

const comingSoonMovies = [
  {
    title: "Avatar 3",
    overview: "Jake Sully returns for another epic adventure on Pandora.",
    poster_path: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg",
    release_date: "2026-12-18",
    vote_average: 8.2,
    runtime: 170,
    genres: [{ name: "Adventure" }, { name: "Fantasy" }],
    status: "coming_soon",
  },
  {
    title: "Spider-Man Beyond",
    overview: "Miles Morales enters a dangerous new multiverse journey.",
    poster_path: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    release_date: "2026-08-10",
    vote_average: 8.5,
    runtime: 145,
    genres: [{ name: "Action" }, { name: "Adventure" }],
    status: "coming_soon",
  },
  {
    title: "Batman Legacy",
    overview: "Bruce Wayne faces Gotham's darkest threat yet.",
    poster_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    release_date: "2026-11-05",
    vote_average: 8.4,
    runtime: 160,
    genres: [{ name: "Action" }, { name: "Crime" }],
    status: "coming_soon",
  },
  {
    title: "John Wick 5",
    overview: "John Wick returns for one final mission.",
    poster_path: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/h8gHn0OzBoaefsYseUByqsmEDMY.jpg",
    release_date: "2026-09-22",
    vote_average: 8.0,
    runtime: 168,
    genres: [{ name: "Action" }, { name: "Thriller" }],
    status: "coming_soon",
  },

  // Broken image fix movies
  {
    title: "Oppenheimer",
    poster_path: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    status: "now_showing",
  },
  {
    title: "Dune: Part Two",
    poster_path: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    status: "coming_soon",
  },
  {
    title: "John Wick: Chapter 4",
    poster_path: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/h8gHn0OzBoaefsYseUByqsmEDMY.jpg",
    status: "now_showing",
  },
];

const seedComingSoonMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    for (const movie of comingSoonMovies) {
      await Movie.findOneAndUpdate(
        { title: movie.title },
        { $set: movie },
        { upsert: true, new: true }
      );

      console.log(`Updated/Added: ${movie.title}`);
    }

    console.log("Movies seeding completed");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedComingSoonMovies();