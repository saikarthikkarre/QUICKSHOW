import React from "react";
import Navbar from "./components/navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Movies from "./pages/movies";
import MovieDetails from "./pages/movieDetails";
import SeatLayout from "./pages/seatlayout";
import MyBooking from "./pages/mybooking";
import Favourite from "./pages/favourite";
import { Toaster } from "react-hot-toast";
import Footer from "./components/footer";
import AddShows from "./pages/Admin/Addshows";
import Dashboard from "./pages/Admin/Dashboard";
import ListShows from "./pages/Admin/Listshows";
import ListBookings from "./pages/Admin/Listbookings";
import Layout from "./pages/Admin/layout";
import { Outlet } from "react-router-dom";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBooking />} />
        <Route path="/favourites" element={<Favourite />} />
        <Route path="/admin/*" element={<Layout />}>
          <Route index path="dashboard" element={<Dashboard />} />
          <Route path="addshows" element={<AddShows />} />
          <Route path="listshows" element={<ListShows />} />
          <Route path="listbookings" element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;