import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getFirestore,
  updateDoc,
  doc,
  addDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
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
    console.log("User is signed out");
  }
});

const db = getFirestore(app);
const collectionRef = collection(db, "announcements");
const querySnapshot = await getDocs(query(collectionRef, where("status", "==", "Active")));

const tableAN = document.getElementById("tableAN");
const tableTemplate = document.querySelector("[announcement-template]");
let announcement = [];

async function displayTableAnnouncements() {
  try {
    announcement = querySnapshot.docs.map((doc) => {
      const anCloneNode = tableTemplate.content.cloneNode(true).children[0];
      // Format the timestamp for display
      const time = doc.data()["createdOn"].toDate();
      const formattedTime = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(time);

      anCloneNode.querySelector("#ANCreatedOn").innerHTML = formattedTime;
      anCloneNode.querySelector("#ANTitle").innerHTML = doc.data()["title"];

      // Set announcementID as a data attribute in the anchor tag
      anCloneNode.querySelector("#ANview").setAttribute("data-announcementID", doc.id);
      anCloneNode.querySelector("#ANDelete").setAttribute("data-announcementID", doc.id);
      anCloneNode.classList.remove("hidden");
      tableAN.appendChild(anCloneNode);
      return {title: doc.data()["title"] || "", time: formattedTime || "", element: anCloneNode };
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
displayTableAnnouncements();
const createdOn = document.getElementById("createdOn");
const updatedOn = document.getElementById("updatedOn");
const title = document.getElementById("title");
const details = document.getElementById("details");
const status = document.getElementById("status");
const ANviewButtons = document.querySelectorAll("#ANview"); // Select all buttons with class ANview

let currentAnnouncementID = null;  // Variable to store the current announcement ID

ANviewButtons.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {
      // Fetch the announcementID from the data attribute
      currentAnnouncementID = btn.getAttribute("data-announcementID");  // Save the announcementID
      console.log("Request ID:", currentAnnouncementID);

      // Fetch document from Firestore
      const docRef = doc(db, "announcements", currentAnnouncementID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Document Data:", data);

        // Set form fields with the fetched data
        title.value = data.title || "";
        details.value = data.details || "";

      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.error("Error fetching document:", e);
    }
  });
});


const accptBtn = document.getElementById("acceptbtn");
accptBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const fields = [
    { field: title, name: "Title", validator: (value) => value.trim() !== "" },
    { field: details, name: "Details", validator: (value) => value.trim() !== "" },

  ];

  // Validate the fields
  for (const { field, name, validator } of fields) {
    if (!validator(field.value)) {
      alert(`Invalid or missing input in the ${name} field.`);
      field.focus();
      return; // Stop execution if a field fails validation
    }
  }

  try {
    // Collect data from form fields
    const announcementData = {
      title: title.value,
      details: details.value,
      status: "Active",
      updatedOn: "",

    };

    if (!currentAnnouncementID) {
      alert("Announcement ID is missing.");
      return;
    }

    // Use the currentAnnouncementID to reference the document
    const docRef = doc(db, "announcements", currentAnnouncementID); // Use the saved announcementID here

    // Update the document with new data
    await updateDoc(docRef, announcementData);

    console.log("Document updated with ID: ", docRef.id);
    alert("Announcement updated successfully!");
  } catch (e) {
    console.error("Error updating document: ", e);
    alert("Failed to update announcement.");
  }
});


const modalDeleteBtn = document.getElementById("modalDeleteBtn");
const delbtn = document.querySelectorAll("#ANDelete");
delbtn.forEach((btn) => {
  btn.addEventListener("click", async(event) => {

    const reqIdElement = btn.getAttribute("data-announcementID");
    console.log("Request ID:", reqIdElement);

    // Fetch document from Firestore
    const docRef = doc(db, "announcements", reqIdElement);


    modalDeleteBtn.addEventListener("click", async (event) => {
      try {
        await updateDoc(docRef, {
          status: "Archived",
        });
    
      } catch (e) {
        console.error("Error archiving document:", e);
      }
    });
    
  });
});

const createbtn = document.getElementById("createbtn");
const createtitle = document.getElementById("createtitle");
const createdetails = document.getElementById("createdetails");

createbtn.addEventListener("click", async (event) => {
  event.preventDefault();

  // Validation for the input fields
  const fields = [
    { field: createtitle, name: "CreateTitle", validator: (value) => value.trim() !== "" },
    { field: createdetails, name: "CreateDetails", validator: (value) => value.trim() !== "" },
  ];

  for (const { field, name, validator } of fields) {
    if (!validator(field.value)) {
      alert(`Invalid or missing input in the ${name} field.`);
      field.focus();
      return; // Stop execution if a field fails validation
    }
  }

  try {
    // Collect data from form fields, including default values for status and updatedOn
    const announcementData = {
      title: createtitle.value.trim(),
      details: createdetails.value.trim(),
      createdOn: new Date(), // Store the current date as a timestamp
      status: "Active", // Default value for the status field
      updatedOn: "", // Empty string for the updatedOn field
    };

    // Reference to the "announcements" collection
    const collectionRef = collection(db, "announcements");

    // Create a new document with auto-generated ID
    const docRef = await addDoc(collectionRef, announcementData);

    console.log("Document created with ID: ", docRef.id);
    alert("Announcement created successfully!");

    // Optionally clear the form fields after submission
    createtitle.value = "";
    createdetails.value = "";
  } catch (e) {
    console.error("Error creating document: ", e);
    alert("Failed to create announcement.");
  }
});

const searchInput = document.getElementById("searchinput");

searchInput.addEventListener("input", async (event) => {
  const searchTerm = event.target.value.toLowerCase();
  console.log(announcement);
  announcement.forEach((ann) => {
    const isMatch = ann.title.toLowerCase().includes(searchTerm);
    ann.element.classList.toggle("hidden", !isMatch);
  })
});

