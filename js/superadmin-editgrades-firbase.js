import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, getDocs, collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
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
    console.log(user);
    
    const uid = user.uid;
  } else {
    
  }
});

const db = getFirestore(app);
const collectionRef = collection(db, "students");
const querySnapshot = await getDocs(collectionRef);

async function getStudentDetails() {
  try {
    querySnapshot.forEach((doc) => {
      const tableER = document.getElementById("tableER");
      const tableERTemplate = document.getElementById("templateER");
      const cloneNode = tableERTemplate.cloneNode(true);

      cloneNode.querySelector("#ERID").innerHTML = doc.data()["StudentNumber"];
      cloneNode.querySelector("#ERLastName").innerHTML = doc.data()["LastName"];
      cloneNode.querySelector("#ERFirstName").innerHTML = doc.data()["FirstName"];
      cloneNode.querySelector("#ERGrade").innerHTML = "Grade " + doc.data()["GradeLevel"]
      cloneNode.classList.remove("hidden");
      tableER.appendChild(cloneNode);
    });
  } catch (e) {
    console.error("Error adding document: ", e);
}};

getStudentDetails();