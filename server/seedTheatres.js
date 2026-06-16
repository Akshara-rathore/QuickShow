import dotenv from "dotenv";
import mongoose from "mongoose";
import Theatre from "./models/Theatre.js";
import Screen from "./models/Screen.js";

dotenv.config();

const theatres = [
  { name: "PVR Treasure Island", location: "Indore" },
  { name: "INOX C21 Mall", location: "Indore" },
  { name: "Cinepolis Phoenix Citadel", location: "Indore" },
  { name: "Carnival Cinemas", location: "Indore" },
  { name: "Miraj Cinemas", location: "Indore" },
  { name: "Velocity Cinema", location: "Indore" },
  { name: "Galaxy Multiplex", location: "Indore" },
  { name: "MovieTime Indore", location: "Indore" },
  { name: "Central Cinema", location: "Indore" },
  { name: "Silver Screen Cinemas", location: "Indore" },
];

const defaultSeatRows = [
  { row: "A", seats: ["1","2","3","4","5","6","7","8","9"] },
  { row: "B", seats: ["1","2","3","4","5","6","7","8","9"] },
  { row: "C", seats: ["1","2","3","4","5","6","7","8","9"] },
  { row: "D", seats: ["1","2","3","4","5","6","7","8","9"] },
  { row: "E", seats: ["1","2","3","4","5","6","7","8","9"] },
  { row: "F", seats: ["1","2","3","4","5","6","7","8","9"] },
  { row: "G", seats: ["1","2","3","4","5","6","7","8","9"] },
];

const defaultSeatTiers = [
  { name: "Platinum", priceOffset: 400, rows: ["F", "G"] },
  { name: "Gold", priceOffset: 250, rows: ["C", "D", "E"] },
  { name: "Silver", priceOffset: 150, rows: ["A", "B"] },
];

const seedTheatres = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    for (const theatreData of theatres) {

      let theatre = await Theatre.findOne({
        name: theatreData.name,
      });

      if (!theatre) {

        theatre = await Theatre.create(theatreData);

        console.log(`Added theatre: ${theatre.name}`);
      }

      const existingScreens = await Screen.find({
        theatre: theatre._id,
      });

      if (existingScreens.length === 0) {

        for (let i = 1; i <= 3; i++) {

          await Screen.create({
            name: `Screen ${i}`,
            theatre: theatre._id,
            seatRows: defaultSeatRows,
            seatTiers: defaultSeatTiers,
          });
        }

        console.log(`Added screens for ${theatre.name}`);
      }
    }

    console.log("Theatre seeding completed");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);
  }
};

seedTheatres();