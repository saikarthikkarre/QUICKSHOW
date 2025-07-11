import express from "express";
import { getFavourites, getUserBookings, updateFavourite } from "../controllers/usercontroller.js";

const userRouter = express.Router();

userRouter.get("/booking", getUserBookings);
userRouter.post("/update-favourite", updateFavourite); // ✅ Fixed typo in route
userRouter.get("/favourites", getFavourites);

export default userRouter;
