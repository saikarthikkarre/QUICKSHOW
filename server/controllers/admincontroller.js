import Booking from "../models/booking.js";
import Show from "../models/show.js";
import User from "../models/user.js";

export const isAdmin = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(401).json({ success: false, isAdmin: false });
    }

    const role = user.publicMetadata?.role;
    const isAdmin = role === "admin";

    res.json({ success: true, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, isAdmin: false });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const booking = await Booking.find({ isPaid: true });
    const activeShows = await Show.find({ showDateTime: { $gte: new Date() } }).populate("movie");
    const totalUser = await User.countDocuments();

    const DashboardData = {
      totalBookings: booking.length,
      totalRevenue: booking.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser,
    };

    res.json({ success: true, DashboardData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, DashboardData: null });
  }
};

export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    res.json({ success: true, shows });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user")
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
