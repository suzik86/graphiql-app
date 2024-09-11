import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { notification } from "antd";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCATqAxM-RJFlKSr-bBMPqYk49lIPIUxAI",
  authDomain: "graphiql-app-auth-5631a.firebaseapp.com",
  projectId: "graphiql-app-auth-5631a",
  storageBucket: "graphiql-app-auth-5631a.appspot.com",
  messagingSenderId: "550391746822",
  appId: "1:550391746822:web:e2adef27ce804dd9528e87",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    notification.error({
      message: (err as Error).message || "An error occured while logging in",
    });
  }
};

const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err: unknown) {
    notification.error({
      message: (err as Error).message || "An error occured while registering",
    });
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    notification.info({
      message: "Password reset link sent!",
    });
  } catch (err: unknown) {
    notification.error({
      message:
        (err as Error).message ||
        "An error occured while sending the password reset email",
    });
  }
};

const logout = () => {
  localStorage.removeItem("pathnames");
  signOut(auth);
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
