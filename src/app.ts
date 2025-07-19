// Import packages
import express, { Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import morgan from "morgan"
import path from "path"
import session from "express-session"
import passport from "passport"
import { rateLimit } from "express-rate-limit"

// Import files
import routes from "./routes"
import errorHandler from "./middleware/error-handler"
import { swaggerDocs } from "./configs/swagger.config"
import { FRONTEND_URL, PORT } from "./configs/env.cofig"
import { configurePassport } from "./configs/passport.config"

// Initialize express app
const app = express()

// Middleware
app.use(cors({ credentials: true, origin: [ FRONTEND_URL ]}));
app.use(helmet())
app.use(morgan("dev"))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Set public dir
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// Setup swagger
swaggerDocs(app, PORT as number);

// Rate limiting for all routes
app.use(rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10000, // Limit each IP to 10000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        message: "Too many requests from this IP, please try again after 5 minutes",
        limitType: "ip",
        retryAfter: 5 * 60,
      });
    },
  })
);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "Server is running" })
})

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "Server is healthy" })
})

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret',
  resave: false,
  saveUninitialized: false
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// API routes
app.use("/api/v1", routes)

// Error handling middleware
app.use(errorHandler as any)

export default app
