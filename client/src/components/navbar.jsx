import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { assets } from '../assets/assets';
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react';
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="Logo" className="w-36 h-auto" />
      </Link>

      <div className="flex items-center gap-8">
        <nav className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full p-1.5">
          <Link 
            to="/" 
            className={`px-6 py-2 rounded-full transition-all ${
              isActive('/') ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/movies" 
            className={`px-6 py-2 rounded-full transition-all ${
              isActive('/movies') ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            Movies
          </Link>
          <Link 
            to="/favourites" 
            className={`px-6 py-2 rounded-full transition-all ${
              isActive('/favourites') ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            Favourite
          </Link>
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8 transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <XIcon className="absolute top-6 right-6 w-8 h-8 cursor-pointer" onClick={() => setIsOpen(false)} />
          
          <Link 
            onClick={() => setIsOpen(false)} 
            to="/" 
            className={`text-xl ${isActive('/') ? 'text-white' : 'text-gray-400'}`}
          >
            Home
          </Link>
          <Link 
            onClick={() => setIsOpen(false)} 
            to="/movies" 
            className={`text-xl ${isActive('/movies') ? 'text-white' : 'text-gray-400'}`}
          >
            Movies
          </Link>
          <Link 
            onClick={() => setIsOpen(false)} 
            to="/favourites" 
            className={`text-xl ${isActive('/favourites') ? 'text-white' : 'text-gray-400'}`}
          >
            Favourite
          </Link>
        </div>

        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer text-gray-300 hover:text-white transition-colors" />

        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary/90 transition rounded-full font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="My Bookings" labelIcon={<TicketPlus width={15} />} onClick={() => navigate('/my-bookings')} />
            </UserButton.MenuItems>
          </UserButton>
        )}

        <MenuIcon
          className="md:hidden w-8 h-8 cursor-pointer text-gray-300"
          onClick={() => setIsOpen(true)}
        />
      </div>
    </div>
  );
}

export default Navbar;
