import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "./models/movie.js";
import Show from "./models/Show.js";
import Booking from "./models/Booking.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const movies = await Movie.find({});
  console.log("MOVIES IN DB:");
  movies.forEach(m => console.log(`Title: "${m.title}", Casts: ${m.casts?.length || 0}, Poster: ${m.poster_path}, ID: ${m._id}`));

  const bookings = await Booking.find({}).populate({
    path: 'show',
    populate: { path: 'movie' }
  });
  console.log("\nTOTAL BOOKINGS:", bookings.length);
  if(bookings.length > 0) {
     console.log("Sample Booking User ID:", bookings[0].user);
     console.log("Has show:", !!bookings[0].show);
     if (bookings[0].show) console.log("Has show.movie:", !!bookings[0].show.movie);
  }
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
