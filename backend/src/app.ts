import express, { Express } from 'express';
import cors from 'cors';
import session from 'express-session';
import 'dotenv/config';


const app: Express = express();



const startServer = async () => {
  console.log("Starting server...");

  const PORT = process.env.PORT || 5001; 

  // Setup the session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false, // Only save sessions when necessary
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));


  // Middleware to parse JSON requests
  app.use(express.json());

  // Middleware to handle CORS -> to allow requests from the frontend
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

  //Routes
  app.use("/api", require("./routes/MoodRoutes"));
  console.log("Routes mounted");

  
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running on: ${process.env.BACKEND_SERVER_URL ?? `http://localhost:${PORT}`}`);
  });
  
};


startServer();
export default startServer;
