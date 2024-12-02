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
const collectionRef = collection(db, "enrollmentsDetails");
const querySnapshot = await getDocs(collectionRef);

async function getEnrollmentDetails() {
  try {
    querySnapshot.forEach((doc) => {
      const tableER = document.getElementById("tableER");
      const tableERTemplate = document.getElementById("templateER");
      const cloneNode = tableERTemplate.cloneNode(true);

      cloneNode.querySelector("#ERID").innerHTML = doc.data()["LRN"];
      cloneNode.querySelector("#ERLastName").innerHTML = doc.data()["lastName"];
      cloneNode.querySelector("#ERFirstName").innerHTML = doc.data()["firstName"];
      cloneNode.querySelector("#ERGrade").innerHTML = "Grade " + doc.data()["gradeLevel"]
      cloneNode.classList.remove("hidden");
      tableER.appendChild(cloneNode);
    });
  } catch (e) {
    console.error("Error adding document: ", e);
}};

getEnrollmentDetails();

/* try */

 /*document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popup");
  const deleteModal = document.getElementById("deleteModal");
  const saveButton = document.getElementById("save-changes");
  const closeButtons = document.querySelectorAll(".close-popup, .close-btn, .cancel-btn");

  // Open Popup (Edit Button)
  document.querySelectorAll(".status_border.view").forEach((editButton) => {
      editButton.addEventListener("click", (e) => {
          e.preventDefault(); // Prevent default anchor action
          popup.classList.add("visible"); // Add class to make the popup visible
      });
  });

  // Close Popup
  closeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
          e.preventDefault();
          popup.classList.remove("visible");
          deleteModal.classList.remove("visible");
      });
  });

  // Save changes and close the popup
  saveButton.addEventListener("click", () => {
      // Save functionality (you can add your save logic here)
      console.log("Changes saved!");
      popup.classList.remove("visible"); // Close the popup
  });
}); */
