fetch("http://localhost:5000/api/movies")
  .then(res => res.json())
  .then(data => {
    console.log("Success:", data.success);
    console.log("Movies count:", data.movies?.length);
    if (data.movies && data.movies.length > 0) {
      const oppenheimer = data.movies.find(m => m.title === "Oppenheimer");
      if (oppenheimer) {
        console.log("Oppenheimer poster:", oppenheimer.poster_path);
        console.log("Oppenheimer casts length:", oppenheimer.casts?.length);
      }
    }
  })
  .catch(err => console.error("Error:", err));
