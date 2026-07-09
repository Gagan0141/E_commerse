require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const mongodb = require("./config/mondb");

const app = express();

app.set("trust proxy", 1);
const navRoute = require("./routes/rouNav");
const productRoute = require("./routes/rouProduct");
const acatRoute = require("./routes/rouallCategories");

const userRoute = require("./routes/rouUsers");
const authRoute = require("./routes/rouAuth");

// const cookieParser = require("cookie-parser");

const reviewRoutes = require("./routes/rouReviews");
const wishlistRoute = require("./routes/rouWishlist");
const cartRoute = require("./routes/rouCart");
const routeAddress = require("./routes/routeAddress");
const orderRoute = require("./routes/rouOrder");
const adminDashboardRoutes = require("./routes/rouAdminDashboard");

// const app = express();
const port = 5000;
mongodb();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use("/api/admin", adminDashboardRoutes);
app.use("/api/nav", navRoute);
app.use("/api/cat", acatRoute);

app.use("/api/product", productRoute);

app.use("/api/review", reviewRoutes);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/cart", cartRoute);

app.use("/api/address", routeAddress);
app.use("/api/order", orderRoute);

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.send("backend running");
});

app.listen(port, () => {
  console.log(`backend running on port ${port}`);
});

// const input = process.argv[2];
// if (input) {
//     console.log(`Your Name is: ${input}`);
// } else {
//     console.log('No input provided.');
// }
