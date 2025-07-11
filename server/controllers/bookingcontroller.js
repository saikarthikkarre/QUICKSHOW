import Booking from "../models/booking.js";
import Show from "../models/show.js";

const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    if (!showId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return false;
    }

    const showData = await Show.findById(showId);
    if (!showData) return false;
    
    const occupiedSeats = showData.occupiedSeats;
    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);
    return !isAnySeatTaken;
  } catch (error) {
    console.error("Error checking seat availability:", error);
    return false;
  }
};

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;

    if (!showId || !selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid booking data: showId and selectedSeats (array) are required" 
      });
    }

    const showData = await Show.findById(showId).populate("movie");
    if (!showData) {
      return res.status(404).json({ 
        success: false, 
        message: "Show not found" 
      });
    }

    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.status(400).json({ 
        success: false, 
        message: "Selected seats are not available" 
      });
    }

    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    selectedSeats.forEach((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified("occupiedSeats");
    await showData.save();

    res.json({ 
      success: true, 
      message: "Booking created successfully",
      bookingId: booking._id 
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error creating booking" 
    });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    if (!showId) {
      return res.status(400).json({ 
        success: false, 
        message: "Show ID is required" 
      });
    }

    const showData = await Show.findById(showId);
    if (!showData) {
      return res.status(404).json({ 
        success: false, 
        message: "Show not found" 
      });
    }

    const occupiedSeats = Object.keys(showData.occupiedSeats);
    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.error("Error getting occupied seats:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error fetching occupied seats" 
    });
  }
};
