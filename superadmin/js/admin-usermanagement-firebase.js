import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, getDoc, getDocs, doc, collection, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
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
const admin = getAuth();
 



// Firestore collections
const usersCollectionRef = collection(db, "users"); // Main user collection
const studentCollectionRef = collection(db, "students"); // Student details
const teacherCollectionRef = collection(db, "teacher"); // Teacher details
const userDocs = await getDocs(usersCollectionRef);
// HTML references
const tableTemplate = document.querySelector('[user-template]');
const tableUM = document.getElementById("tableUM");
let user = []
// Function to fetch and display user accounts
async function displayUserAccounts() {
  try {
    user = userDocs.docs.map(async(Doc) => { 
      const userData = Doc.data();
      const userElement = tableTemplate.content.cloneNode(true).children[0];
      userElement.querySelector("#UMID").innerHTML = userData.lrn || userData.teacherID || "N/A";
      userElement.querySelector("#UMName").innerHTML =
          `${Doc.data()?.lastName ||"Unknown"}, ${Doc.data()?.firstName ||"Unknown"}`;
      const userrole = userElement.querySelector("#UMUserRole");
      if (userData.role == "student"&& userData.isActive == true) {
        userrole.querySelector(".student").classList.remove("hidden");
      } else if (userData.role == "teacher"&& userData.isActive == true) {
        userrole.querySelector(".teacher").classList.remove("hidden");
      }else if (userData.role == "superadmin"&& userData.isActive == true) {
        userrole.querySelector(".admin").classList.remove("hidden");
      }
      else if (userData.isActive == false) {
        userrole.querySelector(".locked").classList.remove("hidden");
      }
      userElement.querySelector("#lockbtn").setAttribute("data-id", Doc.id);
      userElement.classList.remove("hidden");
      tableUM.append(userElement);
      
      return { lrn: userData.lrn || "", teacherID: userData.teacherID || "", lastName: userData.lastName || "", firstName: userData.firstName || "", role: userData.role || "", element: userElement };
      
    });
  } catch (error) {
    console.error("Error fetching user accounts:", error);
  }
}
displayUserAccounts();
console.log(tableUM); 

const lockBtn = document.querySelectorAll("#lockbtn");
const deleteBtn = document.querySelector("#deletebtn");
console.log(lockBtn);
async function lockAccount(id){
  console.log(id);
  const userDocsRef = doc(db, "users", id)
  updateDoc(userDocsRef, {
    isActive: false
  })
  
};


lockBtn.forEach((btn) =>{
  btn.addEventListener("click", async(event) => {
    const reqid = btn.getAttribute("data-id");
    const userDocsRef = doc(db, "users", reqid);
    const email = userDocsRef.data().emailAddress;
    console.log(email);
    deleteBtn.addEventListener("click", async(event) => {
      getUserEmail(email);
      lockAccount(reqid);
    });
  })
});









// document.querySelector('.filter-btn').addEventListener('click', (e) => {
//   e.preventDefault();
//   const dropdownMenu = document.querySelector('.dropdown-menu');
//   dropdownMenu.classList.toggle('show'); // Toggle visibility of the menu
// });

// // Function to handle sorting and filtering
// function applyFilter(filterType) {
//   console.log("Applying filter:", filterType); // For debugging purposes

//   const rows = Array.from(document.querySelectorAll("#tableUM .tablerow"));

//   // Reset visibility of all rows before applying filters
//   rows.forEach(row => (row.style.display = ""));

//   if (filterType === 'ascName') {
//     rows.sort((a, b) => {
//       const nameA = a.querySelector("#UMName").textContent.trim();
//       const nameB = b.querySelector("#UMName").textContent.trim();
//       return nameA.localeCompare(nameB); // Sort ascending by name
//     });
//   } else if (filterType === 'descName') {
//     rows.sort((a, b) => {
//       const nameA = a.querySelector("#UMName").textContent.trim();
//       const nameB = b.querySelector("#UMName").textContent.trim();
//       return nameB.localeCompare(nameA); // Sort descending by name
//     });
//   } else if (filterType === 'student') {
//     rows.forEach(row => {
//       const studentRole = row.querySelector(".student");
//       const teacherRole = row.querySelector(".teacher");

//       // If the 'student' paragraph is visible, show the row, otherwise hide it
//       if (studentRole && studentRole.classList.contains("hidden")) {
//         row.style.display = "none"; // Hide non-student rows
//       } else {
//         row.style.display = ""; // Show student rows
//       }
//     });
//   }

//   else if (filterType === 'teacher') {
//     rows.forEach(row => {
//       const teacherRole = row.querySelector(".teacher");
//       const studentRole = row.querySelector(".student");

//       // If the 'teacher' paragraph is visible, show the row, otherwise hide it
//       if (teacherRole && teacherRole.classList.contains("hidden")) {
//         row.style.display = "none"; // Hide non-teacher rows
//       } else {
//         row.style.display = ""; // Show teacher rows
//       }
//     });
//   }

//   // Append sorted rows back into the table only for sorting actions
//   if (filterType === 'ascName' || filterType === 'descName') {
//     const tbody = document.querySelector("#tableUM");
//     rows.forEach(row => tbody.appendChild(row)); // Reorder rows in the table
//   }
// }

// // Event listeners for filter options
// document.querySelectorAll('.dropdown-menu li a').forEach((filter) => {
//   filter.addEventListener('click', (e) => {
//     e.preventDefault();
//     const filterType = filter.getAttribute('data-filter');
//     applyFilter(filterType); // Call the applyFilter function

//     // Close the dropdown after the filter is applied
//     document.querySelector('.dropdown-menu').classList.remove('show');
//   });
// });




