import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, getDoc, getDocs, doc, collection } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQrgbw4TlLtLbex-BiEk58aA4l_zoDAmo",
  authDomain: "bbba-96d01.firebaseapp.com",
  projectId: "bbba-96d01",
  storageBucket: "bbba-96d01.firebasestorage.app",
  messagingSenderId: "9762028958",
  appId: "1:9762028958:web:4b10cd0c5458b098e56a8f",
  measurementId: "G-8YJS0ZTJ4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore collections
const usersCollectionRef = collection(db, "users"); // Main user collection
const studentCollectionRef = collection(db, "students"); // Student details
const teacherCollectionRef = collection(db, "teacher"); // Teacher details

// HTML references
const tableTemplate = document.querySelector('[user-template]');
const tableUM = document.getElementById("tableUM");

// Function to fetch and display user accounts
async function fetchUserAccounts() {
  try {
    // Fetch users collection
    const userDocs = await getDocs(usersCollectionRef);

    // Process each user document
    for (const userDoc of userDocs.docs) {

      const userData = userDoc.data(); // User data from "users" collection
      console.log(userData);
      let roleSpecificData;

      // Fetch data from the relevant collection based on the role
      if (userData.role == "student") {
        const studentDoc = await getDoc(doc(studentCollectionRef, userData.lrn));
        if (studentDoc.exists()) {
          roleSpecificData = studentDoc.data();
        }
      } else if (userData.role == "teacher") {

        const teacherDoc = await getDoc(doc(teacherCollectionRef, userData.teacherID));

        if (teacherDoc.exists()) {

          roleSpecificData = teacherDoc.data();
        }
      }

      // Log the data for debugging


      // Populate table if role-specific data is found
      if (roleSpecificData) {
        const userElement = tableTemplate.content.cloneNode(true).firstElementChild;

        if (userElement) {
          // Fill in the table row details
          userElement.querySelector("#UMID").innerHTML = userData.lrn || userData.teacherID || "N/A";
          userElement.querySelector("#UMName").innerHTML =
            `${roleSpecificData.lastName || "Unknown"}, ${roleSpecificData.firstName || "Unknown"}`;

          // Handle role-specific display
          const roleElement = userElement.querySelector("#UMUserRole");
          roleElement.querySelectorAll("p").forEach(p => p.classList.add("hidden")); // Hide all
          if (userData.role === "student") {
            roleElement.querySelector(".student")?.classList.remove("hidden");
          } else if (userData.role === "teacher") {
            roleElement.querySelector(".teacher")?.classList.remove("hidden");

          } else {
            roleElement.querySelector(".locked")?.classList.remove("hidden");
          }

          // Append populated row to the table
          userElement.classList.remove("hidden");
          tableUM.appendChild(userElement);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching user accounts:", error);
  }
}

// Fetch and display accounts on page load
fetchUserAccounts();
