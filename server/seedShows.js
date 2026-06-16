import dotenv from "dotenv";
import mongoose from "mongoose";

import Movie from "./models/movie.js";
import Show from "./models/Show.js";
import Theatre from "./models/theatre.js";
import Screen from "./models/Screen.js";

dotenv.config();

const timings = ["10:00", "14:00", "19:00"];

const seedShows = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const movies = await Movie.find({});

    // ONLY 3 theatres
    const theatres = await Theatre.find({}).limit(3);

    if (movies.length === 0) {
      console.log("No movies found");
      process.exit();
    }

    if (theatres.length === 0) {
      console.log("No theatres found");
      process.exit();
    }

    for (const movie of movies) {

      for (const theatre of theatres) {

        const screens = await Screen.find({
          theatre: theatre._id,
        });

        if (screens.length === 0) {
          console.log(`No screens found for ${theatre.name}`);
          continue;
        }

        // NEXT 7 DAYS
        for (let day = 0; day < 7; day++) {

          for (let i = 0; i < timings.length; i++) {

            const screen = screens[i % screens.length];

            const [hour, minute] = timings[i].split(":");

            const showDateTime = new Date();

            showDateTime.setDate(
              showDateTime.getDate() + day
            );

            showDateTime.setHours(
              Number(hour),
              Number(minute),
              0,
              0
            );

            const alreadyExists = await Show.findOne({
              "movie._id": movie._id,
              theatre: theatre._id,
              screen: screen._id,
              showDateTime,
            });

            if (!alreadyExists) {

              await Show.create({
                movie,
                theatre: theatre._id,
                screen: screen._id,
                showDateTime,
                showPrice: 150,
                occupiedSeats: {},
              });

              console.log(
                `Show added: ${movie.title} at ${theatre.name} ${timings[i]}`
              );
            }
          }
        }
      }
    }

    console.log("Shows seeding completed");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);
  }
};

seedShows();