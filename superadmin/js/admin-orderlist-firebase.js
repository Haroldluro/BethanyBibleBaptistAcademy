import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, getDocs, getDoc, collection, getCountFromServer, doc, setDoc, query, orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQrgbw4TlLtLbex-BiEk58nA4l_zoDAmo",
  authDomain: "bbba-96d01.firebaseapp.com",
  projectId: "bbba-96d01",
  storageBucket: "bbba-96d01.firebasestorage.app",
  messagingSenderId: "9762028958",
  appId: "1:9762028958:web:4b10cd0c5458b098e56a8f",
  measurementId: "G-8YJS0ZTJ4C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
  } else {

  }
});

const db = getFirestore(app);
const orderSnapshot = await getDocs(collection(db, "orders"));

// Variables
const orderListTemplate = document.querySelector('[orderList-template]');
const orderTable = document.getElementById("tableOrders");

orderSnapshot.forEach(async (doc) => {
  
  const stData = await getDoc(doc.data()["orderBy"]);

  const clone = orderListTemplate.content.cloneNode(true).children[0];

  clone.querySelector("#OLID").innerHTML = doc.id;
  clone.querySelector("#OLName").innerHTML = stData.data()["firstName"] + " " + stData.data()["lastName"];


  orderTable.append(clone);
});
