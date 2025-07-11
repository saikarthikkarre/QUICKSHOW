import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import Movies from "./pages/movies";
import MovieDetails from "./pages/movieDetails";
import SeatLayout from "./pages/seatlayout";
import MyBooking from "./pages/mybooking";
import Favourite from "./pages/favourite";
import AddShows from "./pages/Admin/Addshows";
import Dashboard from "./pages/Admin/Dashboard";
import ListShows from "./pages/Admin/Listshows";
import ListBookings from "./pages/Admin/Listbookings";
import Layout from "./pages/Admin/layout";
import { useAppContext } from "./context/appcontext";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { user, isAdmin } = useAppContext();

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

        <Route
          path="/admin/*"
          element={
            !user ? (
              <div className="min-h-screen flex justify-center items-center">
                <SignIn redirectUrl="/admin/dashboard" />
              </div>
            ) : isAdmin === undefined ? (
              <div className="min-h-screen flex justify-center items-center">
                Loading...
              </div>
            ) : !isAdmin ? (
              <Navigate to="/" replace />
            ) : (
              <Layout />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
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
