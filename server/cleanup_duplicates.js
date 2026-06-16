import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "./models/movie.js";
import Show from "./models/Show.js";

dotenv.config();

const cleanupDuplicates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for cleanup.");

    // 1. Get all movies and group by title
    const movies = await Movie.find({});
    const movieGroups = {};

    movies.forEach(m => {
      const title = m.title.trim();
      if (!movieGroups[title]) movieGroups[title] = [];
      movieGroups[title].push(m);
    });

    for (const title in movieGroups) {
      const group = movieGroups[title];
      
      if (group.length > 1) {
        console.log(`Found ${group.length} duplicates for "${title}"`);
        
        // 2. Score them to find the "best" document to keep
        // Prioritize: valid poster, valid backdrop, has casts
        group.sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;
          
          if (a.poster_path && a.poster_path.startsWith('http') && !a.poster_path.includes('via.placeholder')) scoreA += 1;
          if (a.backdrop_path && a.backdrop_path.startsWith('http') && !a.backdrop_path.includes('via.placeholder')) scoreA += 1;
          if (a.casts && a.casts.length > 0) scoreA += 2;
          
          if (b.poster_path && b.poster_path.startsWith('http') && !b.poster_path.includes('via.placeholder')) scoreB += 1;
          if (b.backdrop_path && b.backdrop_path.startsWith('http') && !b.backdrop_path.includes('via.placeholder')) scoreB += 1;
          if (b.casts && b.casts.length > 0) scoreB += 2;
          
          return scoreB - scoreA; // descending order, highest score first
        });

        const keptMovie = group[0];
        const duplicateIds = group.slice(1).map(m => m._id);

        console.log(`  -> Keeping ID: ${keptMovie._id}`);
        console.log(`  -> Deleting IDs: ${duplicateIds.join(', ')}`);

        // 3. Update Shows collection to point to the kept movie ID
        // This ensures no Bookings or Shows are broken by the deletion!
        const updateResult = await Show.updateMany(
          { movie: { $in: duplicateIds } },
          { $set: { movie: keptMovie._id } }
        );
        console.log(`  -> Updated ${updateResult.modifiedCount} Shows to reference the correct movie.`);

        // 4. Delete the duplicate movies
        const deleteResult = await Movie.deleteMany({ _id: { $in: duplicateIds } });
        console.log(`  -> Deleted ${deleteResult.deletedCount} duplicate movies.\n`);
      }
    }

    console.log("Cleanup completed successfully.");
    process.exit();
  } catch (error) {
    console.error("Error during cleanup:", error);
    process.exit(1);
  }
};

cleanupDuplicates();
