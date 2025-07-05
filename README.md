### Step 1: Install pnpm

If you haven't already installed `pnpm`, you can do so globally using npm:

```bash
npm install -g pnpm
```

### Step 2: Create a Workspace

1. **Create a new directory for your workspace**:

   ```bash
   mkdir xtopay-projects
   cd xtopay-projects
   ```

2. **Initialize a new pnpm workspace**:

   ```bash
   pnpm init
   ```

   This will create a `package.json` file. You can modify it to include the workspace configuration:

   ```json
   {
     "name": "xtopay-projects",
     "private": true,
     "workspaces": [
       "frontend",
       "backend"
     ]
   }
   ```

### Step 3: Create the Next.js Frontend Project

1. **Create the frontend directory**:

   ```bash
   mkdir frontend
   cd frontend
   ```

2. **Initialize a new Next.js project**:

   ```bash
   pnpm create next-app .
   ```

   Follow the prompts to set up your Next.js application.

3. **Install any additional dependencies** (if needed):

   ```bash
   pnpm add axios
   ```

4. **Go back to the workspace root**:

   ```bash
   cd ..
   ```

### Step 4: Create the Node.js Backend Project

1. **Create the backend directory**:

   ```bash
   mkdir backend
   cd backend
   ```

2. **Initialize a new Node.js project**:

   ```bash
   pnpm init
   ```

   Follow the prompts to set up your Node.js application.

3. **Install necessary dependencies** (e.g., Express):

   ```bash
   pnpm add express
   ```

4. **Create a simple server** in `backend/index.js`:

   ```javascript
   const express = require('express');
   const app = express();
   const PORT = process.env.PORT || 3001;

   app.use(express.json());

   app.get('/', (req, res) => {
     res.send('Hello from the backend API!');
   });

   app.listen(PORT, () => {
     console.log(`Server is running on http://localhost:${PORT}`);
   });
   ```

5. **Go back to the workspace root**:

   ```bash
   cd ..
   ```

### Step 5: Create a Script to Run Both Projects

1. **In the workspace root, modify the `package.json`** to include a script that runs both projects:

   ```json
   {
     "name": "xtopay-projects",
     "private": true,
     "workspaces": [
       "frontend",
       "backend"
     ],
     "scripts": {
       "dev": "concurrently \"pnpm --filter frontend dev\" \"pnpm --filter backend start\""
     }
   }
   ```

   Make sure to install `concurrently`:

   ```bash
   pnpm add -D concurrently
   ```

2. **Add a start script in the backend's `package.json`**:

   ```json
   {
     "scripts": {
       "start": "node index.js"
     }
   }
   ```

3. **Add a dev script in the frontend's `package.json`**:

   ```json
   {
     "scripts": {
       "dev": "next dev"
     }
   }
   ```

### Step 6: Run Both Projects

Now you can run both the Next.js frontend and the Node.js backend with a single command:

```bash
pnpm run dev
```

This command will start both the frontend and backend servers concurrently. You should see output indicating that both servers are running, and you can access the frontend at `http://localhost:3000` and the backend at `http://localhost:3001`. 

### Summary

You have successfully created a pnpm workspace with a Next.js frontend and a Node.js backend, and you can run both projects with a single command. Adjust the code and configurations as needed for your specific requirements!