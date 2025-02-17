import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCZeI6UQlMn3pkpWIFd74vbjLHVjqNZOz8",
  authDomain: "prime-visit.firebaseapp.com",
  projectId: "prime-visit",
  storageBucket: "prime-visit.appspot.com",
  messagingSenderId: "1033674518474",
  appId: "1:1033674518474:web:cd8802f5cbdf92e652e933",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support persistence.');
    }
  });
