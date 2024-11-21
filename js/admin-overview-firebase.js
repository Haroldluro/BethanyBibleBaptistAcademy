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
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});

const db = getFirestore(app);
const studentRef = collection(db, "students");
const studentSnapshot = await getCountFromServer(studentRef);
document.getElementById("totalStudent").innerHTML = studentSnapshot.data().count

const teacherRef = collection(db, "teachers");
const teacherSnapshot = await getCountFromServer(teacherRef);
document.getElementById("totalTeachers").innerHTML = teacherSnapshot.data().count

const enrollmentRef = collection(db, "enrollmentRequest");
const enrollmentSnapshot = await getCountFromServer(enrollmentRef);
document.getElementById("enrollmentRequest").innerHTML = enrollmentSnapshot.data().count

// const itemRef = collection(db, "itemRequest");
// const itemSnapshot = await getCountFromServer(itemRef);
// document.getElementById("itemRequest").innerHTML = itemSnapshot.data().count

getDocs(studentRef).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    const tablePWA = document.getElementById("tablePWA");
    const tablePWATemplate = document.getElementById("templatePWA");
    const cloneNode = tablePWATemplate.cloneNode(true);

    console.log();

    cloneNode.querySelector("#PWAName").innerHTML = doc.data()["LastName"] + ", " + doc.data()["FirstName"];
    cloneNode.querySelector("#PWAGrade").innerHTML = "Grade " + doc.data()["GradeLevel"]

    cloneNode.classList.remove("hidden");
    tablePWA.appendChild(cloneNode);
  });
});
