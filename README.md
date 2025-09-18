# Analytics Tracker

---

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Pick one of the options to have MongoDB running:
   - Make sure MongoDB server is running locally (start it if needed).
   - Or start it in Docker container (make sure Docker is installed and running and no other MongoDB instance is running on the host):

     ```bash
     npm run db:up
     ```

3. Start the app (builds in the `prestart` script):

   ```bash
   npm start
   ```

---

### Routes

- / → redirects to /1.html
- /1.html
- /2.html
- /3.html

Base URL (default): http://localhost:50000

---

### Environment variables (optional)

You can override defaults by creating a `.env` file in the project root:

```env
WEB_PORT=50000# Port for the web server (/, /1.html, /2.html, /3.html)
MONGODB_URI=mongodb://127.0.0.1:27017# If using Docker, also update docker-compose.yml accordingly
MONGODB_DB=analyticstracker
MONGODB_COLLECTION=tracks
```

---

### Environment and tools

The app was verified locally with the following setup:

- OS: Windows 11 (x64)
- Node.js: 22.17.0 (npm 10.9.2)
- TypeScript: 5.9.2
- MongoDB Community Edition 8

---
