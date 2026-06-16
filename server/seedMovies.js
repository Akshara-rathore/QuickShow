import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "./models/movie.js";

dotenv.config();

const movies = [
  {
    title: "The Jungle Book",
    tmdbId: 278927,
    overview: "A young boy raised by wolves begins a journey of self-discovery.",
    poster_path: "/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg",
    backdrop_path: "/eIOTsGg9FCVrBc4r2nXaV61JF4F.jpg",
    release_date: "2016-04-15",
    vote_average: 7.0,
    runtime: 106,
    genres: [{ name: "Adventure" }, { name: "Drama" }],
    status: "now_showing",
  },
  {
    title: "Avengers Endgame",
    tmdbId: 299534,
    overview: "The Avengers assemble once more to reverse the damage caused by Thanos.",
    poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    release_date: "2019-04-26",
    vote_average: 8.4,
    runtime: 181,
    genres: [{ name: "Action" }, { name: "Sci-Fi" }],
    status: "now_showing",
  },
  {
    title: "Interstellar",
    tmdbId: 157336,
    overview: "A team travels through a wormhole in search of a new home for humanity.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    release_date: "2014-11-07",
    vote_average: 8.6,
    runtime: 169,
    genres: [{ name: "Sci-Fi" }, { name: "Drama" }],
    status: "now_showing",
  },
  {
    title: "Inception",
    tmdbId: 27205,
    overview: "A skilled thief enters people's dreams to steal secrets and plant ideas.",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    release_date: "2010-07-16",
    vote_average: 8.4,
    runtime: 148,
    genres: [{ name: "Action" }, { name: "Sci-Fi" }],
    status: "now_showing",
  },
  {
    title: "The Dark Knight",
    tmdbId: 155,
    overview: "Batman faces the Joker, a criminal mastermind who brings chaos to Gotham.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    release_date: "2008-07-18",
    vote_average: 8.5,
    runtime: 152,
    genres: [{ name: "Action" }, { name: "Crime" }],
    status: "now_showing",
  },
  {
    title: "Joker",
    tmdbId: 475557,
    overview: "A failed comedian descends into madness and becomes Gotham's infamous villain.",
    poster_path: "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    backdrop_path: "/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    release_date: "2019-10-04",
    vote_average: 8.2,
    runtime: 122,
    genres: [{ name: "Crime" }, { name: "Drama" }],
    status: "now_showing",
  },
  {
    title: "Avatar",
    tmdbId: 19995,
    overview: "A marine on an alien planet becomes torn between his mission and a new world.",
    poster_path: "/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    backdrop_path: "/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg",
    release_date: "2009-12-18",
    vote_average: 7.6,
    runtime: 162,
    genres: [{ name: "Adventure" }, { name: "Fantasy" }],
    status: "now_showing",
  },
  {
    title: "Oppenheimer",
    tmdbId: 872585,
    overview: "The story of J. Robert Oppenheimer and the creation of the atomic bomb.",
    poster_path: "/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    backdrop_path: "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    release_date: "2023-07-21",
    vote_average: 8.1,
    runtime: 181,
    genres: [{ name: "Drama" }, { name: "History" }],
    status: "now_showing",
  },
  {
    title: "Spider-Man: No Way Home",
    tmdbId: 634649,
    overview: "Peter Parker faces villains from across the multiverse after a spell goes wrong.",
    poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop_path: "/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    release_date: "2021-12-17",
    vote_average: 8.0,
    runtime: 148,
    genres: [{ name: "Action" }, { name: "Adventure" }],
    status: "now_showing",
  },
  {
    title: "John Wick: Chapter 4",
    tmdbId: 603692,
    overview: "John Wick uncovers a path to defeating the High Table.",
    poster_path: "/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    backdrop_path: "/h8gHn0OzBoaefsYseUByqsmEDMY.jpg",
    release_date: "2023-03-24",
    vote_average: 7.7,
    runtime: 169,
    genres: [{ name: "Action" }, { name: "Thriller" }],
    status: "now_showing",
  },
];

const seedMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    for (const movie of movies) {
      await Movie.findOneAndUpdate(
        { tmdbId: movie.tmdbId },
        movie,
        { upsert: true, new: true }
      );

      console.log(`Seeded: ${movie.title}`);
    }

    console.log("Movie seeding completed");
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedMovies();