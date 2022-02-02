import { initializeApp, FirebaseApp } from 'firebase/app';
import { extractStringEnvVar } from './EnvUtil';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: extractStringEnvVar('REACT_APP_FIREBASE_API_KEY'),
  authDomain: extractStringEnvVar('REACT_APP_FIREBASE_AUTH_DOMAIN'),
  projectId: extractStringEnvVar('REACT_APP_FIREBASE_PROJECT_ID'),
  storageBucket: extractStringEnvVar('REACT_APP_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: extractStringEnvVar(
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID'
  ),
  appId: extractStringEnvVar('REACT_APP_FIREBASE_APP_ID'),
};

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);
