import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, getDocs, collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { query, where } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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
const gradeDropdown = document.getElementById("gradeLevelDropdown");
const studentsContainer = document.getElementById("studentsContainer");

// Handle grade selection
async function getStudentDetails() {
  try {
    querySnapshot.forEach((doc) => {
      const tableER = document.getElementById("tableST");
      const tableERTemplate = document.getElementById("templateST");
      const cloneNode = tableERTemplate.cloneNode(true);


      cloneNode.querySelector("#STID").innerHTML = doc.data()["studentID"];
      cloneNode.querySelector("#STName").innerHTML = doc.data()["lastName"] + ", " + doc.data()["firstName"];

      cloneNode.querySelector("#STGrade").innerHTML = doc.data()["gradeLevel"];
      cloneNode.classList.remove("hidden");
      tableER.appendChild(cloneNode);
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

getStudentDetails();


gradeDropdown.addEventListener("change", async () => {
  const selectedGrade = gradeDropdown.value;

  if (!selectedGrade) {
    studentsContainer.innerHTML = "<p>Please select a grade level.</p>";
    return;
  }

  try {
    // Query Firestore for students of the selected grade
    const collectionRef = collection(db, "students");
    const gradeQuery = query(collectionRef, where("gradeLevel", "==", selectedGrade));
    const querySnapshot = await getDocs(gradeQuery);

    // Clear the container
    studentsContainer.innerHTML = "";

    if (querySnapshot.empty) {
      studentsContainer.innerHTML = "<p>No students found for this grade.</p>";
    } else {
      querySnapshot.forEach((doc) => {
        const student = doc.data(); // Correct method to access document data
        const studentDiv = document.createElement("div");
        studentDiv.className = "student";
        studentDiv.innerHTML = `<p>Name: ${student.FirstName} ${student.LastName}</p><p>Grade Level: ${student.GradeLevel}</p>`;
        studentsContainer.appendChild(studentDiv);
      });
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    studentsContainer.innerHTML = "<p>Error loading students. Please try again later.</p>";
  }
});

