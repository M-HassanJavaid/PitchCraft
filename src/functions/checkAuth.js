// checkUserAuth.js
import { onAuthStateChanged , getAuth} from 'firebase/auth';
import app from '../config/firebase';
const auth = getAuth(app)

/**
 * Checks if a user is authenticated when the website loads.
 * Returns a Promise that resolves with the user (or null if not signed in).
 */
export function checkUserAuth() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // stop listening after first call
        resolve(user || null);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
}
