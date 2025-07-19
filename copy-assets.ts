import fs from "fs"
import path from "path"

// Define the source and destination paths
const sourceFolder = path.join(__dirname, "docs") // Path to the source docs folder
const destFolder = path.join(__dirname, "dist", "docs") // Destination folder

// Allowed file types to copy (filtering by file extension)
const allowedFileTypes = [".yml", ".md"]

// Function to copy a file from source to destination
function copyFile(src: string, dest: string) {
  fs.copyFileSync(src, dest)
  console.log(`Copied file: ${src} to ${dest}`)
}

// Function to recursively copy contents of a folder, with file filtering
function copyFolder(src: string, dest: string) {
  // Ensure destination folder exists
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
    console.log(`Created folder: ${dest}`)
  }

  // Read all files and subfolders in the source folder
  const items = fs.readdirSync(src)

  items.forEach((item) => {
    const srcItem = path.join(src, item)
    const destItem = path.join(dest, item)
    const stat = fs.statSync(srcItem)

    if (stat.isDirectory()) {
      // If it's a directory, recursively copy the folder
      copyFolder(srcItem, destItem)
    } else {
      // If it's a file, check if the file extension is in the allowed list
      const ext = path.extname(item).toLowerCase() // Get the file extension
      if (allowedFileTypes.includes(ext)) {
        // If the file type is allowed, copy the file
        copyFile(srcItem, destItem)
      }
    }
  })
}

// Remove the existing destination folder (to replace its contents)
if (fs.existsSync(destFolder)) {
  fs.rmSync(destFolder, { recursive: true, force: true })
  console.log(`Removed existing folder: ${destFolder}`)
}

// Start the copying process
copyFolder(sourceFolder, destFolder)
console.log("Filtered contents of docs folder copied to dist/docs")
