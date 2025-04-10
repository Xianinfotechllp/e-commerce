import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
import vendorModel from "../model/vendorModel.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check in both user and vendor collections
    let user = await userModel.findById(decoded._id).select('-password');
    if (!user) {
      user = await vendorModel.findById(decoded._id).select('-password');
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};;

export const isVendor = (req, res, next) => {
  if (req.user && req.user.role === 1) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Vendors only.' });
  }
};

export const isUser = (req, res, next) => {
  if (req.user && req.user.role === 0) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Users only.' });
  }
};
