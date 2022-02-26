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
  doc,
  Firestore,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { setUserData } from './DatabaseService';
import { UserData } from '../models/UserData';
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

interface RegisterInterface {
  email: string;
  password: string;
  name: string;
  major: string;
  startingSemester: string;
  startingYear: string;
}

/** Usage example:
 * 
 * ```
    registerWithEmailAndPasswordNamed({
      email: 'email@gmail.com',
      password: 'password',
      name: 'My Name',
      major: 'Software Engineering',
      startingSemester: 'Fall',
      startingYear: 2019,
    });
 * ```
 * @param email 
 * @param password 
 * @param name 
 * @param major 
 * @param startingSemester 
 * @param startingYear
 */
const registerWithEmailAndPassword = async ({
  email,
  password,
  name,
  major,
  startingSemester,
  startingYear,
}: RegisterInterface) => {
  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCred) => {
      const user = userCred.user;
      await setUserData(new UserData(
        user.uid,
        name,
        email,
        major,
        startingSemester,
        startingYear,
        [],
        [],
      ));
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
};

const sendPasswordReset = async (
  email: string,
  onSent?: ((value: void) => void | PromiseLike<void>) | null | undefined,
  onError?: ((reason: any) => void | PromiseLike<void>) | null | undefined
) => {
  await sendPasswordResetEmail(auth, email)
    .then(() => {
      onSent?.call(this) ?? alert('Password reset link sent!');
    })
    .catch((error) => {
      onError?.call(this, error)
    });
};

const logout = async () => {
  await signOut(auth);
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
