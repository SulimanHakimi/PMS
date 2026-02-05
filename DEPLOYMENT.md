# Production Deployment Guide

## Environment Setup

### Required Environment Variables
Create a `.env.local` file (for web) or configure environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
```

## Running the Application

### Web Version (Browser-based)
```bash
npm run dev       # Development
npm run build     # Production build
npm start         # Production server
```

### Desktop Version (Electron)
```bash
npm run electron  # Development
npm run build:electron  # Production build
```

## Production Checklist

- [x] Remove test/seed files
- [x] Remove seed-db handler
- [x] Configure MongoDB connection
- [x] Implement offline sync capability
- [x] Add authentication system
- [x] Implement CRUD operations for medicines and groups
- [ ] Set up proper password hashing (currently using plain text)
- [ ] Configure production MongoDB instance
- [ ] Set up backup strategy
- [ ] Configure SSL/TLS for production
- [ ] Add logging and monitoring
- [ ] Test offline sync thoroughly
- [ ] Create user documentation

## Security Notes

⚠️ **IMPORTANT**: The current authentication uses plain text passwords for demonstration. 
Before deploying to production:

1. Implement proper password hashing (bcrypt, argon2, etc.)
2. Add JWT or session-based authentication
3. Implement role-based access control
4. Enable HTTPS/SSL
5. Secure your MongoDB connection string
6. Add rate limiting
7. Implement input validation and sanitization

## Database Schema

### Medicine
- name: String (required)
- medicineId: String (required, unique)
- group: String (required)
- stock: Number (required, default: 0)
- description: String
- timestamps: createdAt, updatedAt

### Group
- name: String (required, unique)
- timestamps: createdAt, updatedAt

### User
- username: String (required, unique)
- password: String (required) ⚠️ Currently plain text
- role: String (default: 'user')
- timestamps: createdAt, updatedAt

## Offline Sync

The application supports offline operation:
- Actions are queued in localStorage when offline
- Automatically syncs when connection is restored
- Supports: add-medicine, update-medicine, delete-medicine, add-group, delete-group

## Support

For issues or questions, refer to the codebase documentation or contact the development team.
