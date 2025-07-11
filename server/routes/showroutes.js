import express from "express";
import { addShow, getNowPlayingMovies, getShows, getShow } from "../controllers/showcontroller.js";
import { protectAdmin } from "../middleware/auth.js";

const ShowRouter = express.Router();

ShowRouter.get("/now-playing",  getNowPlayingMovies);
ShowRouter.post("/add",  addShow);

ShowRouter.get("/all", getShows);
ShowRouter.get("/:movieId", getShow);

export default ShowRouter;
