import { clerkClient, getAuth } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    console.log('protectAdmin userId:', userId);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthenticated" });
    }

    const user = await clerkClient.users.getUser(userId);
    console.log('protectAdmin user role:', user.privateMetadata?.role);
    if (!user || user.privateMetadata?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorised - admin only" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("protectAdmin error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
