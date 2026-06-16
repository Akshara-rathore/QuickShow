import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    tmdbId: {
      type: Number,
      required: true,
      unique: true,
    },

    overview: {
      type: String,
      default: "",
    },

    poster_path: {
      type: String,
      required: true,
    },

    backdrop_path: {
      type: String,
      default: "",
    },

    release_date: {
      type: String,
      default: "",
    },

    vote_average: {
      type: Number,
      default: 0,
    },

    runtime: {
      type: Number,
      default: 120,
    },

    genres: [
      {
        name: String,
      },
    ],

    status: {
      type: String,
      enum: ["now_showing", "coming_soon"],
      default: "now_showing",
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;