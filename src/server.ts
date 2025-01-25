
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./infrastructure/route/userRoute"
import { createServer } from "http";
import { connectToDatabase } from "./infrastructure/config/dbConnection";
import path from 'path';
import fs from 'fs';

dotenv.config();
connectToDatabase();



const app = express();
const server = createServer(app);


const PORT = process.env.PORT || 8000;

app.use(
  cors({
    credentials: true,
    origin: "https://pic-stack-4bfq.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


 app.use('/uploads', express.static(uploadsDir));


app.use("/", router);



server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
