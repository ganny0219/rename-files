// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDgYppJiQP6ICDT4ALxWpvyg3Smm-wQlc",
  authDomain: "belajarnextjs.firebaseapp.com",
  databaseURL:
    "https://belajarnextjs-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "belajarnextjs",
  storageBucket: "belajarnextjs.appspot.com",
  messagingSenderId: "566926833040",
  appId: "1:566926833040:web:f982f214ba9e9ee2562f15",
  measurementId: "G-J369RFC121",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
export default app;
