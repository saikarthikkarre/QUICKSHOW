import { Inngest } from "inngest";
import User from "../models/user.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        _id: id,
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url || "",
      };

      const data = await User.create(userData);
      console.log("User created successfully:", data);
    } catch (error) {
      console.error("User creation failed:", error.message);
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      const { id } = event.data;
      await User.findByIdAndDelete(id);
    } catch (error) {
      console.error("User deletion failed:", error.message);
    }
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url || "",
      };

      await User.findByIdAndUpdate(id, userData);
    } catch (error) {
      console.error("User update failed:", error.message);
    }
  }
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];
