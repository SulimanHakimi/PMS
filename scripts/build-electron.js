const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const API_DIR = path.join('src', 'app', 'api');
const BACKUP_DIR = path.join('src', 'app', 'api_backup');

console.log('Building for Electron...');

// Rename api folder to exclude from static export
if (fs.existsSync(API_DIR)) {
    console.log('Temporarily hiding API routes...');
    // Ensure backup dir doesn't exist (clean up previous failed builds)
    if (fs.existsSync(BACKUP_DIR)) {
        fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
    }
    fs.renameSync(API_DIR, BACKUP_DIR);
}

try {
    // Run next build
    console.log('Running Next.js Build...');
    execSync('npx cross-env APP_ENV=electron next build --webpack', { stdio: 'inherit' });
    console.log('Build successful.');
} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
} finally {
    // Restore api folder
    if (fs.existsSync(BACKUP_DIR)) {
        console.log('Restoring API routes...');
        fs.renameSync(BACKUP_DIR, API_DIR);
    }
}
