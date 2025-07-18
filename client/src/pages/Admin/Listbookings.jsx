import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../../assets/assets";
import Title from "../../components/admin/title";
import { dateformat } from "../../lib/dateformat";

const ListBookings = () => {
    const currency = import.meta.env.VITE_CURRENCY;
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllBookings = async () => {
        // Simulating an API call
        setBookings(dummyBookingData);
        setLoading(false);
    };

    useEffect(() => {
        getAllBookings();
    }, []);

    return !loading ? (
        <>
            <Title text1="List" text2="Bookings" />
            <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
                <thead>
                    <tr className="bg-primary/20 text-left text-white">
                        <th className="p-2 font-medium pl-5">User Name</th>
                        <th className="p-2 font-medium">Movie Name</th>
                        <th className="p-2 font-medium">Show Time</th>
                        <th className="p-2 font-medium">Seats</th>
                        <th className="p-2 font-medium">Amount</th>
                    </tr>
                </thead>
                <tbody className="text-sm font-light">
                    {bookings.map((booking, index) => (
                        <tr key={index} className="border-b border-primary/20 bg-primary/5 even:bg-primary/10">
                            <td className="p-2 pl-5 min-w-45">{booking.user.name}</td>
                            <td className="p-2">{booking.show.movie.title}</td>
                            <td className="p-2">{new Date(booking.show.showDateTime).toLocaleString()}</td>
                            <td className="p-2">{booking.bookedSeats.join(", ")}</td>
                            <td className="p-2">{currency} {booking.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    ) : (
        <div>Loading...</div>
    );
};

export default ListBookings;
