import { clerkClient } from "@clerk/express";
import Booking from "../models/booking.js";
import Movie from "../models/movie.js";

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.auth().userId;

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: { path: "movie" }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const updateFavourite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);
    let favourites = user.privateMetadata?.favourites || [];

    if (!favourites.includes(movieId)) {
      favourites.push(movieId);
    } else {
      favourites = favourites.filter((item) => item !== movieId);
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { favourites }
    });

    res.json({ success: true, message: "Favourites updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getFavourites = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const user = await clerkClient.users.getUser(userId);

    const favourites = user.privateMetadata?.favourites || [];

    const movies = await Movie.find({ _id: { $in: favourites } });

    res.json({ success: true, movies });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
