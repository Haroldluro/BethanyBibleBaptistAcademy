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
const loadGradesDetails = async () => {
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

        // Step 2: Get studentID from the "students" table
        const studentDocRef = doc(db, "students", lrn);
        const studentDocSnap = await getDoc(studentDocRef);

        if (!studentDocSnap.exists()) {
          throw new Error("Student document not found.");
        }

        const { studentID } = studentDocSnap.data();

        // Step 3: Get grades from the "grades" table
        const gradeDocRef = doc(db, "grades", studentID);
        const gradeDocSnap = await getDoc(gradeDocRef);

        if (!gradeDocSnap.exists()) {
          throw new Error("Grades document not found.");
        }

        const gradesData = gradeDocSnap.data().Grades;

        // Step 4: Sort grades alphabetically by subject
        const sortedGrades = Object.entries(gradesData).sort(([subjectA], [subjectB]) =>
          subjectA.localeCompare(subjectB)
        );

        // Step 5: Calculate the average of "first" grades
        let totalFirstGrades = 0;
        let totalSecondGrades = 0;
        let totalThirdGrades = 0;
        let totalFourthGrades = 0;
        let subjectsFirstCount = 0;
        let subjectsSecondCount = 0;
        let subjectsThirdCount = 0;
        let subjectsFourthCount = 0;

        // Step 6: Dynamically populate grades on the page
        const templateRow = document.querySelector("#templateGD");
        const gradesContainer = document.querySelector(".subject-grades");
        gradesContainer.innerHTML = "";

        for (const [subject, subjectGrades] of sortedGrades) {
          const firstGrade = parseFloat(subjectGrades.first);
          const secondGrade = parseFloat(subjectGrades.second);
          const thirdGrade = parseFloat(subjectGrades.third);
          const fourthGrade = parseFloat(subjectGrades.fourth);
          if (!isNaN(firstGrade)) {
            totalFirstGrades += firstGrade;
            subjectsFirstCount++;
          }
          if (!isNaN(secondGrade)) {
            totalSecondGrades += secondGrade;
            subjectsSecondCount++;
          }
          if (!isNaN(thirdGrade)) {
            totalThirdGrades += thirdGrade;
            subjectsThirdCount++;
          }
          if (!isNaN(fourthGrade)) {
            totalFourthGrades += fourthGrade;
            subjectsFourthCount++;
          }

          const rowClone = templateRow.cloneNode(true); // Clone the template row
          rowClone.querySelector("#subject").textContent = subject; // Set subject name
          rowClone.querySelector("#grade").textContent = subjectGrades.fourth; // Set "first" grade
          rowClone.style.display = "flex"; // Make sure the row is visible
          gradesContainer.appendChild(rowClone); // Append to container
        }

        // Step 7: Calculate and display the average
        const averageFirstGrade = subjectsFirstCount > 0 ? Math.round(totalFirstGrades / subjectsFirstCount) : "N/A";
        const averageSecondGrade = subjectsSecondCount > 0 ? Math.round(totalSecondGrades / subjectsSecondCount) : "N/A";
        const averageThirdGrade = subjectsThirdCount > 0 ? Math.round(totalThirdGrades / subjectsThirdCount) : "N/A";
        const averageFourthGrade = subjectsFourthCount > 0 ? Math.round(totalFourthGrades / subjectsFourthCount) : "N/A";

        document.getElementById("first").innerHTML = `${averageFirstGrade}`;
        document.getElementById("second").innerHTML = `${averageSecondGrade}`;
        document.getElementById("third").innerHTML = `${averageThirdGrade}`;
        document.getElementById("fourth").innerHTML = `${averageFourthGrade}`;

        console.log("Grades displayed successfully.");
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
// Call the function to load grades details
loadGradesDetails();
