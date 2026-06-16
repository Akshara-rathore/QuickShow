import dotenv from "dotenv";
import mongoose from "mongoose";
import Booking from "./models/Booking.js";
import Show from "./models/Show.js";
import Movie from "./models/movie.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const bookings = await Booking.find({})
      .populate({
        path: 'show',
        populate: {
          path: 'movie',
          model: 'Movie'
        }
      })
      .sort({ createdAt: -1 });
  
  if (bookings.length > 0) {
    console.log("Found bookings:", bookings.length);
    const b = bookings[0];
    console.log("Amount:", b.amount);
    console.log("Has show:", !!b.show);
    if (b.show) {
       console.log("Has show.movie:", !!b.show.movie);
       if (b.show.movie) {
          console.log("Movie title:", b.show.movie.title);
          console.log("Movie poster:", b.show.movie.poster_path);
          console.log("Movie casts:", b.show.movie.casts?.length);
       }
    }
  } else {
    console.log("No bookings found.");
  }

  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
