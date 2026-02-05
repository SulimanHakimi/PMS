# Running Pharma One PMS

This guide explains how to set up, run, and build the Pharma One Pharmacy Management System (PMS).

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (LTS version recommended).
- **npm**: This project uses `npm` as the package manager.

## 1. Installation

Install the project dependencies:

```bash
npm install
```

## 2. Configuration

Set up your environment variables before running the application.

1. Create a file named `.env.local` in the root directory.
2. Add your MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string
```

> **Note**: A valid MongoDB URI is required for the application to function correctly.

## 3. Running the Application

### Development Mode

You can run the application in two modes: as a web application or as a desktop application (Electron).

**Web Application (Browser):**
To run specifically in the browser (useful for UI testing):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it.

**Desktop Application (Electron):**
To run the full desktop experience with Electron (recommended for development):
```bash
npm run electron-dev
```
This command starts the Next.js server and launches the Electron window.

## 4. Building for Production

**Build Desktop App (Electron):**
To generate the installer/executable for distribution:
```bash
npm run dist
```
The output files (installers/executables) will be located in the `dist` folder.

**Build Web App:**
To build the Next.js application for web deployment:
```bash
npm run build
```
