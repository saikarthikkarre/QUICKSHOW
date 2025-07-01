import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import { ClockIcon } from "lucide-react";
import formatISODate from "../lib/isoTimeformat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { ArrowRightIcon } from "lucide-react";

const SeatLayout = () => {
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const navigate = useNavigate();

  const getShow = async () => {
    const foundShow = dummyShowsData.find((show) => show._id === id);
    if (foundShow) {
      setShow({
        movie: foundShow,
        dateTime: dummyDateTimeData,
      });
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select a time first", {
        icon: "⚠️",
      });
    }

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("Please select only up to 5 seats", {
        icon: "⚠️",
      });
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-nowrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer ${
                selectedSeats.includes(seatId) ? "bg-primary text-white" : ""
              }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  useEffect(() => {
    getShow();
  }, []);

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {show.dateTime[date]?.map((item) => (
            <div
              key={item.time}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                selectedTime?.time === item.time
                  ? "bg-primary text-white"
                  : "hover:bg-primary/20"
              }`}
              onClick={() => setSelectedTime(item)}
            >
              <ClockIcon className="w-4 h-4" />
              <p>{formatISODate(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="0" right="0" />
        <h1 className="text-xl font-semibold mb-2">Select Your Seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        <div className="flex flex-col items-center text-xs text-gray-300 gap-6 mt-10">
          <div className="flex flex-col items-center">
            {["A", "B"].map((row) => renderSeats(row, 9))}
          </div>

          <div className="grid grid-cols-2 gap-16">
            <div className="flex flex-col min-w-[250px]">
              {["C", "D"].map((row) => renderSeats(row, 9))}
            </div>
            <div className="flex flex-col min-w-[250px]">
              {["E", "F"].map((row) => renderSeats(row, 9))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-16">
            <div className="flex flex-col min-w-[250px]">
              {["G", "H"].map((row) => renderSeats(row, 9))}
            </div>
            <div className="flex flex-col min-w-[250px]">
              {["I", "J"].map((row) => renderSeats(row, 9))}
            </div>
          </div>

<button
  onClick={() => navigate('/my-bookings')}
  className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
>
  Proceed to Checkout
  <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
</button>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default SeatLayout;
