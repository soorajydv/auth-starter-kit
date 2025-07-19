import dotenv from "dotenv"
import app from "./app"
import { connectDB } from "./configs/database"

// Load environment variables based on NODE_ENV
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

// Set default NODE_ENV if not set
process.env.NODE_ENV = process.env.NODE_ENV || "development"

// Get port from environment variables
const PORT = process.env.PORT || 5000

// Start server
const startServer = async () => {
  try {
    await connectDB()

    const server = app.listen(PORT as number,"0.0.0.0", () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    })

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION! Shutting down...")
      console.error(err)

      // Close server & exit process
      server.close(() => {
        process.exit(1)
      })
    })

    // Handle SIGTERM signal
    process.on("SIGTERM", () => {
      console.log("SIGTERM RECEIVED. Shutting down gracefully")
      server.close(() => {
        console.log("Process terminated!")
      })
    })
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

startServer()
