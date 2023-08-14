import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLn-_LdRt7KbPQC2cDKLO58GA601dboRA",
  authDomain: "tokopedia-play.firebaseapp.com",
  projectId: "tokopedia-play",
  storageBucket: "tokopedia-play.appspot.com",
  messagingSenderId: "329305934073",
  appId: "1:329305934073:web:5ed8499dc49fe9c9a1fa28"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
