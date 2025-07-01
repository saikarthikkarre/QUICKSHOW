import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Blurcircle from "../components/BlurCircle";
import {Heart, StarIcon} from "lucide-react";
import timeformat from "../lib/timeformat";
import Dateselect from "../components/dateselect";

const MovieDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);

  async function getShow() {
    const show = dummyShowsData.find(show => show._id === id);
    setShow({
      movie: show,
      dateTime: dummyDateTimeData
    });
  }

  useEffect(() => {
    getShow();
  }, [id]);

  return show ? (
    <>
      <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          <img src={show.movie.poster_path} alt="" className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover" />
          <div className="relative flex flex-col gap-3">
            <Blurcircle top="100px" left="100px" />
            <p className="text-primary">English</p>
            <h1>{show.movie.title}</h1>
            <div className="flex items-center gap-2 text-gray-300">
              <StarIcon className="w-5 h-5 text-primary fill-primary" />
              {show.movie.vote_average.toFixed(1)} User Rating
            </div>
            <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">{show.movie.overview}</p>
            <p>
              {timeformat(show.movie.runtime)} | {show.movie.genres.map(genre => genre.name).join(", ")} | {show.movie.release_date.split("-")[0]}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95" href="#dateselect">Buy Tickets</a>
              <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
                <Heart className={"w-5 h-5"} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="text-lg font-medium mt-20">Your Favourite Cast</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4"></div>
      <div className="flex items-center gap-4 w-max px-4">{show.movie.casts.slice(0,12).map((cast,index) => (
        <div key={index} className="flex flex-col items-center">
          <img src={cast.profile_path} alt="" className="rounded-full h-20 md:h-20 aspect-square object-cover"/>
          <p className="font-medium text-xs mt-3">{cast.name}</p>
        </div>
      ))}</div>
      <Dateselect dateTime={show.dateTime} id={id} />
    </>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">Loading....</h1>
    </div>
  );
};

export default MovieDetails;