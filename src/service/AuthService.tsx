import { app } from './FirebaseSetup';
import {
  getAuth,
  Auth,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password).catch((error) => {
    console.error(error);
    alert(error.message);
  });
};

const logInAnonymously = async () => {
  await signInAnonymously(auth).catch((error) => {
    console.error(error);
    alert(error.message);
  });
};

const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCred) => {
      const user = userCred.user;
      await setDoc(doc(db, `users/${user.uid}`), {
        uid: user.uid,
        name,
        email,
      });
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
};

const sendPasswordReset = async (email: string) => {
  await sendPasswordResetEmail(auth, email)
    .then(() => {
      alert('Password reset link sent!');
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  logInAnonymously,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
