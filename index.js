const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer")
const fileUpload = require("express-fileupload")
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = 5000;
const authRouter = require("./routes/authRoute");
const imageRouter = require("./routes/uploadimage")
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const blogCatRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const coupenRouter = require("./routes/couponRoute");
const colorRouter = require("./routes/colorRoute");
const enquiryRouter = require("./routes/enqRoute");
const uploadRouter = require("./routes/uploadRoute");
const tiketRouter = require("./routes/ticketRoute");
const meetRouter = require("./routes/meetRoute");
const roleRouter = require("./routes/roleRoute");
const cookieParser = require("cookie-parser");
const adherentRouter=require('./routes/adhrentroutes');
const ProductImgRouter = require("./routes/productImgroutes")
const morgan = require("morgan");
const cors = require("cors");
dbConnect();
app.use(cors());

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/uploads" , express.static(__dirname + 'uploads'));
app.use(express.static('/uploads'))

app.use("/api/user", authRouter);
app.use("/api/images", imageRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogCatRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", coupenRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/ticket", tiketRouter);
app.use("/api/meet", meetRouter);
app.use("/api/role", roleRouter);
app.use('/adherent',adherentRouter);
app.use('/prodImg',ProductImgRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at PORT http://localhost:${PORT}`);
});
