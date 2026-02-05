# Pharmacy Management System (PMS)

A comprehensive pharmacy management system built with Next.js and Electron, supporting both web and desktop deployments with offline capabilities.

## Features

✅ **Inventory Management**
- Complete CRUD operations for medicines
- Medicine grouping and categorization
- Stock level tracking and shortage alerts
- Real-time inventory updates

✅ **Offline Support**
- Automatic action queueing when offline
- Background sync when connection restored
- Seamless user experience

✅ **Multi-Platform**
- Web application (browser-based)
- Desktop application (Electron)
- Shared codebase and database

✅ **RTL Support**
- Full Dari language support
- Right-to-left layout
- Localized UI components

✅ **Dashboard**
- Real-time statistics
- Medicine shortage alerts
- Quick access to key features

## Technology Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Node.js, MongoDB, Mongoose
- **Desktop**: Electron
- **Icons**: Lucide React
- **Offline Storage**: LocalStorage

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd PMS
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env.local` file:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Run the application

**Web Version:**
```bash
npm run dev
```
Open http://localhost:3000

**Desktop Version:**
```bash
npm run electron
```

## Project Structure

```
PMS/
├── src/
│   ├── app/              # Next.js pages and routes
│   ├── components/       # React components
│   ├── lib/              # Utilities (IPC, DB, offline sync)
│   └── models/           # Mongoose models (web)
├── electron/
│   ├── main.js           # Electron main process
│   ├── db-handlers.js    # Database handlers
│   └── models/           # Mongoose models (electron)
├── public/               # Static assets
└── scripts/              # Build scripts

```

## Database Models

### Medicine
- Medicine name and ID
- Group/category
- Stock quantity
- Description and usage instructions
- Timestamps

### Group
- Group name
- Timestamps

### User
- Username
- Password (⚠️ needs hashing for production)
- Role
- Timestamps

## Development

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run electron` - Start Electron app
- `npm run lint` - Run ESLint

### Key Features Implementation

**Offline Sync:**
- Located in `src/lib/offline-sync.js`
- Queues mutations in localStorage
- Auto-syncs on reconnection

**IPC Communication:**
- Located in `src/lib/ipc.js`
- Handles Electron IPC and Web API fallback
- Automatic offline detection

**Database Connection:**
- Web: `src/lib/db.js`
- Electron: `electron/db-handlers.js`

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

### Important Security Notes

⚠️ Before deploying to production:
1. Implement password hashing
2. Add proper authentication (JWT/sessions)
3. Enable HTTPS/SSL
4. Secure MongoDB connection
5. Add input validation
6. Implement rate limiting

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly (web and desktop)
4. Submit a pull request

## License

[Your License Here]

## Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ for pharmacy management**
