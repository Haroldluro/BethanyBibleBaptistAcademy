import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, updateDoc, getDoc, getDocs, doc, collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
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
const db = getFirestore(app);
const studentCollectionRef = collection(db, "students");

// DOM elements
const studentNameElement = document.getElementById("studentName");
const studentIDElement = document.getElementById("studentID");
const gradesTableElement = document.getElementById("tableST");
const templateRow = document.querySelector("template[student-template]").content.querySelector("tr");
const leftBtn = document.getElementById("leftbtn");
const rightBtn = document.getElementById("rightbtn");

let studentDetails = []; // Array to store student details
let currentIndex = 0; // Current index of displayed student

async function displayStudentsForTeacher(uid) {
  try {
    // Fetch teacher details
    const teacherDocRef = doc(db, "users", uid);
    const teacherDocSnap = await getDoc(teacherDocRef);

    if (!teacherDocSnap.exists()) {
      throw new Error("Teacher document not found.");
    }

    const { teacherID } = teacherDocSnap.data();

    const teacherDetailsDocRef = doc(db, "teacher", teacherID);
    const teacherDetailsDocSnap = await getDoc(teacherDetailsDocRef);

    if (!teacherDetailsDocSnap.exists()) {
      throw new Error("Additional teacher details not found.");
    }

    // Get gradeLevelHandled and sectionHandled
    const { gradeLevelHandled, sectionHandled } = teacherDetailsDocSnap.data();

    if (!sectionHandled) {
      throw new Error("Section handled is not defined.");
    }

    console.log(`Grade Level: ${gradeLevelHandled}, Section: ${sectionHandled}`);

    // Query students with the same section
    const q = query(studentCollectionRef, where("section", "==", sectionHandled));
    const studentQuerySnapshot = await getDocs(q);

    if (studentQuerySnapshot.empty) {
      studentNameElement.textContent = "No students found in this section.";
      studentIDElement.textContent = "";
      gradesTableElement.innerHTML = "";
      return;
    }

    // Populate studentDetails array
    studentDetails = studentQuerySnapshot.docs.map((doc) => {
      const { studentID, firstName, lastName } = doc.data();
      return {
        studentID: studentID || "Unknown",
        studentName: `${lastName}, ${firstName}` || "Unknown"
      };
    });

    currentIndex = 0; // Reset to first student
    updateDisplayedStudent();

    console.log("Student details fetched successfully.");
  } catch (error) {
    console.error("Error fetching students or teacher details:", error);
    alert("Failed to load student or teacher details.");
  }
}

// Fetch and display grades for the current student
async function fetchAndDisplayGrades(studentID) {
  try {
    const gradesDocRef = doc(db, "grades", studentID);
    const gradesDocSnap = await getDoc(gradesDocRef);

    if (!gradesDocSnap.exists()) {
      gradesTableElement.innerHTML = "<tr><td colspan='6'>Grades not found.</td></tr>";
      return;
    }

    const gradesData = gradesDocSnap.data().Grades;

    // Clear existing rows
    gradesTableElement.innerHTML = "";

    // Sort subjects alphabetically
    const sortedSubjects = Object.keys(gradesData).sort();

    for (const subject of sortedSubjects) {
      const { first, second, third, fourth } = gradesData[subject];

      // Clone the template row and populate it with grade data
      const row = templateRow.cloneNode(true);
      row.querySelector("#subject").textContent = subject;
      row.querySelector("#first").value = first || "";
      row.querySelector("#second").value = second || "";
      row.querySelector("#third").value = third || "";
      row.querySelector("#fourth").value = fourth || "";
      row.querySelector("#final").value = calculateFinalGrade(first, second, third, fourth);

      gradesTableElement.appendChild(row);
    }

    console.log("Grades displayed successfully.");
  } catch (error) {
    console.error("Error fetching grades:", error);
    gradesTableElement.innerHTML = "<tr><td colspan='6'>Failed to load grades.</td></tr>";
  }
}


// Calculate the final grade as an average of the four quarters
function calculateFinalGrade(first, second, third, fourth) {
  const grades = [first, second, third, fourth].map(Number).filter((g) => !isNaN(g));
  if (grades.length === 0) return "";
  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return (sum / grades.length).toFixed(2); // Return the average
}

// Update displayed student based on currentIndex
function updateDisplayedStudent() {
  if (studentDetails.length === 0) {
    studentNameElement.textContent = "No students available.";
    studentIDElement.textContent = "";
    gradesTableElement.innerHTML = "<tr><td colspan='6'>No data available.</td></tr>";
  } else {
    const currentStudent = studentDetails[currentIndex];
    studentNameElement.textContent = currentStudent.studentName;
    studentIDElement.textContent = currentStudent.studentID;

    // Fetch and display grades for the current student
    fetchAndDisplayGrades(currentStudent.studentID);
  }
}

// Button click event listeners
rightBtn.addEventListener("click", () => {
  if (studentDetails.length > 0) {
    currentIndex = (currentIndex + 1) % studentDetails.length; // Loop to the beginning
    updateDisplayedStudent();

  }
});

leftBtn.addEventListener("click", () => {
  if (studentDetails.length > 0) {
    currentIndex = (currentIndex - 1 + studentDetails.length) % studentDetails.length; // Loop to the end
    updateDisplayedStudent();

  }
});

// Listen for authentication changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.uid);
    displayStudentsForTeacher(user.uid);
  } else {
    console.log("No user is logged in.");
    window.location.href = "/landing/login.html";
  }
});

// Add a reference to the "Apply" button
const applyBtn = document.getElementById("apply-btn");

// Function to save the updated grades to Firestore
async function saveUpdatedGrades() {
  if (studentDetails.length === 0) {
    alert("No student selected.");
    return;
  }

  const currentStudent = studentDetails[currentIndex];
  const studentID = currentStudent.studentID;

  // Prepare grades data from the table
  const gradesData = {};
  const rows = gradesTableElement.querySelectorAll("tr");
  rows.forEach((row) => {
    const subject = row.querySelector("#subject").textContent;
    const first = row.querySelector("#first").value;
    const second = row.querySelector("#second").value;
    const third = row.querySelector("#third").value;
    const fourth = row.querySelector("#fourth").value;

    gradesData[subject] = {
      first: first || null,
      second: second || null,
      third: third || null,
      fourth: fourth || null,
    };
  });
  console.log(gradesData);
  try {
    // Update the grades document in Firestore
    const gradesDocRef = doc(db, "grades", studentID);
    await updateDoc(gradesDocRef, { Grades: gradesData });

    console.log("Grades updated successfully.");
    alert("Grades saved successfully.");
  } catch (error) {
    console.error("Error updating grades:", error);
    alert("Failed to save grades.");
  }
}

// Attach event listener to the "Apply" button
applyBtn.addEventListener("click", saveUpdatedGrades);
