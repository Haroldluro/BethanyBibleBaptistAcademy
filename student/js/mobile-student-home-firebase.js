import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQrgbw4TlLtLbex-BiEk58nA4l_zoDAmo",
  authDomain: "bbba-96d01.firebaseapp.com",
  projectId: "bbba-96d01",
  storageBucket: "bbba-96d01.firebasestorage.app",
  messagingSenderId: "9762028958",
  appId: "1:9762028958:web:4b10cd0c5458b098e56a8f",
  measurementId: "G-8YJS0ZTJ4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get references to the HTML elements
const studentFNameEl = document.querySelector("#studentFName");
const studentIDEl = document.querySelector("#studentID");
const gradeLevelEl = document.querySelector("#gradeLevel");
const sectionEl = document.querySelector("#section");

// Fetch and display student details
const loadStudentDetails = async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const uid = user.uid;

        // Step 1: Get LRN from the "users" table
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);


        if (!userDocSnap.exists()) {
          throw new Error("User document not found.");
        }

        const lrn = userDocSnap.data().lrn;

 


        // Step 2: Get student details from the "students" table
        const studentDocRef = doc(db, "students", lrn);
        const studentDocSnap = await getDoc(studentDocRef);

        if (!studentDocSnap.exists()) {
          throw new Error("Student document not found.");
        }

        const { firstName, gradeLevel, section, studentID } = studentDocSnap.data();

        // Step 3: Display the student details on the page
        studentFNameEl.textContent = `${firstName}`;
        studentIDEl.textContent = studentID;
        gradeLevelEl.textContent = gradeLevel;
        sectionEl.textContent = section;

        console.log("Student details displayed successfully.");
      } catch (error) {
        console.error("Error fetching student details:", error);
        alert("Failed to load student details.");
      }
    } else {
      console.log("No user is logged in.");
      alert("Please log in to view your details.");
    }
  });
};

// Call the function to load student details
loadStudentDetails();
