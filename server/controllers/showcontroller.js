import axios from "axios";
import Movie from "../models/movie.js";
import Show from "../models/show.js";

export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get("https://api.themoviedb.org/3/movie/now_playing", {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
      }
    });

    const movies = data.results;
    res.json({ success: true, movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    if (!movieId || !showsInput || !showPrice) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: movieId, showsInput, or showPrice" 
      });
    }

    let existingMovie = await Movie.findById(movieId);

    if (!existingMovie) {
      try {
        const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
          })
        ]);

        const movieApiData = movieDetailsResponse.data;
        const movieCredits = movieCreditsResponse.data;

        const movieDetails = {
          _id: movieId,
          title: movieApiData.title,
          overview: movieApiData.overview,
          poster_path: movieApiData.poster_path,
          backdrop_path: movieApiData.backdrop_path,
          genres: movieApiData.genres,
          casts: movieCredits.cast,
          release_date: movieApiData.release_date,
          original_language: movieApiData.original_language,
          tagline: movieApiData.tagline || "",
          vote_average: movieApiData.vote_average,
          runtime: movieApiData.runtime
        };

        existingMovie = await Movie.create(movieDetails);
      } catch (error) {
        return res.status(404).json({ 
          success: false, 
          message: "Movie not found in TMDB database" 
        });
      }
    }

    const showsToCreate = [];

    showsInput.forEach((show) => {
      const showDate = show.date;
      if (!showDate || !Array.isArray(show.time)) {
        throw new Error("Invalid show input format");
      }

      show.time.forEach((time) => {
        if (!time) {
          throw new Error("Invalid time format");
        }
        const dateTimeString = `${showDate}T${time}`;
        const showDateTime = new Date(dateTimeString);
        
        if (isNaN(showDateTime.getTime())) {
          throw new Error("Invalid date/time format");
        }

        showsToCreate.push({
          movie: movieId,
          showDateTime,
          showPrice,
          occupiedSeats: {}
        });
      });
    });

    if (showsToCreate.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No valid shows to create" 
      });
    }

    await Show.insertMany(showsToCreate);
    res.json({ success: true, message: "Show added successfully" });
  } catch (error) {
    console.error("Error in addShow:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Unexpected error occurred while adding show"
    });
  }
};

export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    if (!shows) {
      return res.status(404).json({ 
        success: false, 
        message: "No shows found" 
      });
    }

    const uniqueMap = new Map();
    shows.forEach((s) => {
      if (!uniqueMap.has(s.movie._id.toString())) {
        uniqueMap.set(s.movie._id.toString(), s.movie);
      }
    });

    res.json({ success: true, shows: Array.from(uniqueMap.values()) });
  } catch (error) {
    console.error("Error in getShows:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error fetching shows" 
    });
  }
};

export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({ 
        success: false, 
        message: "Movie ID is required" 
      });
    }

    const movieDoc = await Movie.findById(movieId);
    if (!movieDoc) {
      return res.status(404).json({ 
        success: false, 
        message: "Movie not found" 
      });
    }

    const shows = await Show.find({ 
      movie: movieId, 
      showDateTime: { $gte: new Date() } 
    });

    const dateTime = {};
    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({ time: show.showDateTime, showId: show._id });
    });

    res.json({ 
      success: true, 
      movie: movieDoc, 
      showDateTime: dateTime 
    });
  } catch (error) {
    console.error("Error in getShow:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching show details"
    });
  }
};
