import express from "express";
import cors from "cors";
// route imports
import productRoutes from "./routes/adminRoutes/productRoutes.js";
import couponRoutes from "./routes/adminRoutes/couponRoutes.js"
import vendorRoutes from "./routes/vendorRoutes/vendorRoutes.js";
import cartRoutes from "./routes/cartRoutes/cartRoutes.js"
import userRoutes from "./routes/user/userRoutes.js"
import reviewRoutes from "./routes/reviewRoutes/reviewRoutes.js"
import orderRoutes from "./routes/OrderRoutes/orderRouter.js"


import connectDb from "./db/database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
connectDb()



// Middleware
app.use(express.json());
// cors
const allowedOrigins = [
  "http://localhost:5173",
  "https://ecom-frontend-vvd8.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use("/uploads", express.static("uploads")); // Serve images

// Routes admin
app.use("/api/products", productRoutes);
app.use("/api/coupons", couponRoutes);
// route cart
app.use('/api/cart', cartRoutes);
// route user
app.use('/api/users', userRoutes);
// routes vendor
app.use("/api/vendors", vendorRoutes);
// routes review
app.use("/api/reviews", reviewRoutes);
// oreder Routes
app.use("/api/orders",orderRoutes)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
