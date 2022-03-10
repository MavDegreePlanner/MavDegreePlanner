import { app } from './FirebaseSetup';
import {
  getAuth,
  Auth,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { setUserData } from './DatabaseService';
import { UserData } from '../models/UserData';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

/**
 * Firebase Auth instance
 */
const auth: Auth = getAuth(app);

/**
 * Log in the user with Firebase Auth
 * @param email 
 * @param password 
 */
const logInWithEmailAndPassword = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password).catch((error) => {
    console.error(error);
    alert(error.message);
  });
};

/**
 * Log in without creating an account. Note that this account will be forever unaccessible if logged out.
 * 
 * Anonymous accounts can be converted to normal accounts (Not implemented)
 */
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
  onError?: (error: any) => void | PromiseLike<any>
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
  onError,
}: RegisterInterface) :Promise<UserCredential | null> => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password)
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
      return userCred;
    })
    .catch((error: any) => {
      onError?.call(this, error) ?? alert(error.message);
      return null;
    });
  
  return userCred;
};

/**
 * Send a password reset email to the requested email
 * @param email 
 * @param onSent 
 * @param onError 
 */
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

/**
 * Log out the current user
 */
const logout = async () => {
  await signOut(auth);
};

export {
  auth,
  logInWithEmailAndPassword,
  logInAnonymously,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
