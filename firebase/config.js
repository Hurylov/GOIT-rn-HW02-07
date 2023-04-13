import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCjgtCnQjVCZKC9asHPsowxOqLFkmDKscw",
  authDomain: "native-b5e69.firebaseapp.com",
  projectId: "native-b5e69",
  storageBucket: "native-b5e69.appspot.com",
  messagingSenderId: "892224413451",
  appId: "1:892224413451:web:97d858ebae6bdc20c2cc0e",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage };
