import React from "react";
import { dummyShowsData } from "../assets/assets";
import Moviecard from "../components/Moviecard";
import BlurCircle from "../components/Blurcircle";

const Movies = () => {
  return dummyShowsData.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="130px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>
      <h1>Now Showing</h1>
      <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8">
        {dummyShowsData.map((movie) => (
          <Moviecard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">No Movies Available</h1>
    </div>
  );
};

export default Movies;