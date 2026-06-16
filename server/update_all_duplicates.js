import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "./models/movie.js";

dotenv.config();

const moviesToFix = [
  {
    title: "Oppenheimer",
    poster_path: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/fm6KqXn3Z97YK2pYwRwwlHAlWpG.jpg",
    status: "now_showing",
    casts: [
      { name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "https://image.tmdb.org/t/p/w200/iS1zADaR3t71aX0M4y1B5q2qg1R.jpg" },
      { name: "Emily Blunt", character: "Kitty Oppenheimer", profile_path: "https://image.tmdb.org/t/p/w200/n81YZymXz9qKzB7O2hCj87wN39L.jpg" },
    ]
  },
  {
    title: "Dune: Part Two",
    poster_path: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2TokwaqGQ.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    status: "now_showing",
    casts: [
      { name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "https://image.tmdb.org/t/p/w200/BpeSGBZvdNPngRzQ4x5oVf2xN.jpg" },
      { name: "Zendaya", character: "Chani", profile_path: "https://image.tmdb.org/t/p/w200/hN8jZAM3sK1h7GvU8G7z7GvQ9xX.jpg" },
    ]
  },
  {
    title: "John Wick: Chapter 4",
    poster_path: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2u89.jpg",
    status: "now_showing",
    casts: [
      { name: "Keanu Reeves", character: "John Wick", profile_path: "https://image.tmdb.org/t/p/w200/rRdru6REr9i3WIHv2mntpcgx6iD.jpg" },
      { name: "Donnie Yen", character: "Caine", profile_path: "https://image.tmdb.org/t/p/w200/hTlhrrZMj8hZVvD17jguR8A5S3F.jpg" },
    ]
  }
];

const fixMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    for (const movie of moviesToFix) {
      const result = await Movie.updateMany(
        { title: movie.title },
        { 
          $set: { 
            poster_path: movie.poster_path, 
            backdrop_path: movie.backdrop_path,
            status: movie.status,
            casts: movie.casts
          } 
        }
      );
      console.log(`Movie updated: ${movie.title}, Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    }

    console.log("Movie fixing completed");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

fixMovies();
