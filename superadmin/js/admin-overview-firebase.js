import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, getDoc, getDocs, collection, query, where, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
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

const teacherRef = collection(db, "teacher");
const teacherSnapshot = await getCountFromServer(teacherRef);
document.getElementById("totalTeachers").innerHTML = teacherSnapshot.data().count

const enrollmentRef = collection(db, "enrollmentsDetails");
const enrollmentQuery = query(enrollmentRef, where("status", "==", "Pending"));
const enrollmentSnapshot = await getCountFromServer(enrollmentQuery);
document.getElementById("enrollmentRequest").innerHTML = enrollmentSnapshot.data().count

const itemRef = collection(db, "itemRequest");
const itemSnapshot = await getCountFromServer(itemRef);
document.getElementById("itemRequest").innerHTML = itemSnapshot.data().count


getDocs(studentRef).then((querySnapshot) => {
  querySnapshot.forEach(async (docSnapshot) => {
    const studentData = docSnapshot.data();
    const tablePWA = document.getElementById("tablePWA");
    const tablePWATemplate = document.getElementById("templatePWA");
    const cloneNode = tablePWATemplate.cloneNode(true);

    // Retrieve GradeLevel reference
    const gradeLevelRef = studentData["GradeLevel"];
    let gradeLevelName = "Unknown"; // Default value in case fetching fails

    if (gradeLevelRef) {
      try {
        const gradeLevelDoc = await getDoc(gradeLevelRef);
        if (gradeLevelDoc.exists()) {
          gradeLevelName = gradeLevelDoc.data().name; // Fetch the `name` field
        }
      } catch (error) {
        console.error("Error fetching grade level:", error);
      }
    }

    // Populate the template with student data
    cloneNode.querySelector("#PWAName").innerHTML =
      studentData["LastName"] + ", " + studentData["FirstName"];
    cloneNode.querySelector("#PWAGrade").innerHTML = gradeLevelName;

    cloneNode.classList.remove("hidden");
    tablePWA.appendChild(cloneNode);
  });
});