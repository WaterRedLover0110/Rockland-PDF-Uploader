
# PDF Upload System (Frontend & Backend Monorepo)

## Overview
This project is a **PDF upload system** that allows users to upload and view PDF files. It is built as a monorepo containing both **frontend** and **backend** services.

- **Frontend**: Developed using **React** and deployed on **Netlify**.
- **Backend**: Developed using **Serverless** (Node.js/Express) and deployed as **AWS Lambda** functions with **API Gateway**, **S3**, and **DynamoDB** for storage.

## Features
- Upload PDFs from the frontend.
- PDFs are stored securely in an S3 bucket.
- Metadata (file name, upload date) is saved in a DynamoDB table.
- View PDF files directly from the browser using a modal viewer.
- Different environments supported (local and production).

## Technology Stack
- **Frontend**: React, Axios, React-PDF, React-Modal, Netlify (for deployment)
- **Backend**: AWS Lambda, API Gateway, DynamoDB, S3, Serverless Framework
- **Styling**: Basic CSS for UI elements.

## Project Structure

```
/project-root
  /frontend
    /src/            # Frontend React code
    /public/         # Public assets for frontend
    .env             # Frontend environment file (ignored in Git)
    node_modules/    # Node.js dependencies for frontend
    build/           # Production build for frontend (Netlify deployment)
  /backend
    /src/            # Backend Lambda functions (Node.js/Express)
    .env             # Backend environment file (ignored in Git)
    node_modules/    # Node.js dependencies for backend
    .serverless/     # Serverless deployment output
    .webpack/        # Webpack output for packaging
  .gitignore         # Combined gitignore for both frontend and backend
  .git               # Root Git repository
  README.md          # Project documentation
```

## How to Run Locally

### Frontend (React)

1. Go to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the frontend development server:
   ```bash
   yarn start
   ```
   The app will run on `http://localhost:3000`.

### Backend (Serverless / AWS Lambda)

1. Go to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start Serverless offline for local development:
   ```bash
   yarn offline
   ```
   The API will run on `http://localhost:4000`.

### Environment Variables

Both frontend and backend require environment variables.

- **Frontend**: `.env` file located in `frontend/.env`
- **Backend**: `.env` file located in `backend/.env`

Example for the **frontend**:

```
REACT_APP_API_URL=http://localhost:4000/dev
```

Example for the **backend**:

```
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
DYNAMO_DB_TABLE=pdf-upload-history
S3_BUCKET=your-s3-bucket-name
```

## Deployment

### Frontend (Netlify)
1. Deploy the frontend to Netlify by linking the Git repository and configuring the build command (`yarn build`) and output directory (`frontend/build`).

2. Add the production environment variable (`REACT_APP_API_URL`) in the Netlify dashboard under **Build & Deploy** → **Environment**.

### Backend (Serverless)
1. Deploy the backend to AWS using Serverless:
   ```bash
   yarn deploy
   ```
2. Make sure that AWS credentials are configured properly using the AWS CLI or environment variables.

## Important Notes

- **CORS**: Make sure to configure CORS for the S3 bucket to allow the frontend to access uploaded PDFs.
- **Environment Switching**: The API URL in the frontend automatically switches between local development and production using environment variables.
- **Security**: Be sure to handle sensitive data like AWS keys in environment variables, and do not commit `.env` files to the repository.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
