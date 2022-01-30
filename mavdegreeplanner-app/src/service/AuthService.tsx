import { app } from './FirebaseSetup';
import {
  getAuth,
  Auth,
  signInAnonymously as signInAnon,
  signInWithEmailAndPassword as signInWithEmailPassword,
  createUserWithEmailAndPassword as createUserWithEmailPassword,
  signOut as fSignOut,
} from 'firebase/auth';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

const auth: Auth = getAuth(app);

export class AuthService {
  static get instance(): AuthService {
    if (AuthService._instance === undefined) {
      AuthService._instance = new AuthService();
    }

    return AuthService._instance;
  }

  private static _instance: AuthService;

  AuthService() {}

  /**
   * Signs out the current user.
   *
   * @public
   */
  async signOut(): Promise<void> {
    await fSignOut(auth).catch(
      this._handleFirebaseError('AuthService.signOut')
    );
  }

  /**
   * Signs out the current user.
   *
   * @public
   */
  async logOut(): Promise<void> {
    await this.signOut();
  }

  /**
   * Asynchronously signs in as an anonymous user.
   *
   * @remarks
   * If there is already an anonymous user signed in, that user will be returned; otherwise, a
   * new anonymous user identity will be created and returned.
   *
   * @public
   */
  async signInAnonymously(): Promise<string> {
    let message = await signInAnon(auth)
      .then(this._handleAuthenticated())
      .catch(this._handleFirebaseError('AuthService.signInAnonymously'));

    return message;
  }

  /**
   * Asynchronously signs in as an anonymous user.
   *
   * @remarks
   * If there is already an anonymous user signed in, that user will be returned; otherwise, a
   * new anonymous user identity will be created and returned.
   *
   * @public
   */
  async logInAnonymously(): Promise<string> {
    return await this.signInAnonymously();
  }

  /**
   * Asynchronously signs in using an email and password.
   *
   * @remarks
   * Returns with an error message if the email address and password do not match.
   *
   * Note: The user's password is NOT the password used to access the user's email account. The
   * email address serves as a unique identifier for the user, and the password is used to access
   * the user's account in your Firebase project. See also: {@link createUserWithEmailAndPassword}.
   *
   * @public
   */
  async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<string> {
    let message = await signInWithEmailPassword(auth, email, password)
      .then(this._handleAuthenticated())
      .catch(
        this._handleFirebaseError('AuthService.signInWithEmailAndPassword')
      );

    return message;
  }

  /**
   * Asynchronously signs in using an email and password.
   *
   * @remarks
   * Returns with an error message if the email address and password do not match.
   *
   * Note: The user's password is NOT the password used to access the user's email account. The
   * email address serves as a unique identifier for the user, and the password is used to access
   * the user's account in your Firebase project. See also: {@link createUserWithEmailAndPassword}.
   *
   * @public
   */
  async logInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<string> {
    return await this.signInWithEmailAndPassword(email, password);
  }

  /**
   * Creates a new user account associated with the specified email address and password.
   *
   * @remarks
   * On successful creation of the user account, this user will also be signed in to your application.
   *
   * User account creation can fail if the account already exists or the password is invalid.
   *
   * Note: The email address acts as a unique identifier for the user and enables an email-based
   * password reset. This function will create a new user account and set the initial user password.
   *
   * @public
   */
  async createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<string> {
    let message = await createUserWithEmailPassword(auth, email, password)
      .then(this._handleAuthenticated())
      .catch(this._handleFirebaseError('AuthService.signInAnonymously'));

    return message;
  }

  /**
   * Creates a new user account associated with the specified email address and password.
   *
   * @remarks
   * On successful creation of the user account, this user will also be signed in to your application.
   *
   * User account creation can fail if the account already exists or the password is invalid.
   *
   * Note: The email address acts as a unique identifier for the user and enables an email-based
   * password reset. This function will create a new user account and set the initial user password.
   *
   * @public
   */
  async signUpUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<string> {
    return await this.createUserWithEmailAndPassword(email, password);
  }

  private _handleFirebaseError(methodName: string): (reason: any) => string {
    return (error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(methodName + errorCode + ': ' + errorMessage);
      return errorMessage;
    };
  }

  private _handleAuthenticated(): () => string {
    return () => {
      // Signed in
      return 'Successfully signed in';
    };
  }
}
