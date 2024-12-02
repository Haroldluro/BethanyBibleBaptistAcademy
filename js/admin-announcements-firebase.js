import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getFirestore,
  updateDoc,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
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

async function displayTableAnnouncements() {
  try {
    querySnapshot.forEach((doc) => {
      const tableAN = document.getElementById("tableAN");
      const tableANTemplate = document.getElementById("templateAN");
      const cloneNode = tableANTemplate.cloneNode(true);

      // Format the timestamp for display
      const time = doc.data()["createdOn"].toDate();
      const formattedTime = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(time);

      cloneNode.querySelector("#ANCreatedOn").innerHTML = formattedTime;
      cloneNode.querySelector("#ANTitle").innerHTML = doc.data()["title"];

      // Set announcementID as a data attribute in the anchor tag
      cloneNode.querySelector("#ANview").setAttribute("data-announcementID", doc.data()["announcementID"]);
      cloneNode.querySelector("#ANDelete").setAttribute("data-announcementID", doc.data()["announcementID"]);
      cloneNode.classList.remove("hidden");
      tableAN.appendChild(cloneNode);
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

modalDeleteBtn.addEventListener("click", async (event) => {
  try {
    // Retrieve the ID of the row/document to be deleted
    const parentRow = document.querySelector(".highlighted-row"); // Assuming you add a specific class when a row is selected
    if (!parentRow) {
      console.error("No row selected for deletion.");
      return;
    }

    // Get the announcementID from the row element (this will match the document's ID in Firestore)
    const reqId = parentRow.querySelector("#ANview").getAttribute("data-announcementID");

    console.log("Request ID to delete:", reqId);

    // Reference to the Firestore document using the document ID (announcementID)
    const docRef = doc(db, "announcements", reqId);

    // Archive the document (you can also delete the document if necessary)
    await updateDoc(docRef, {
      status: "Archived",
    });

    // Optionally remove the row from the table
    parentRow.remove();
    console.log(`Document with ID ${reqId} successfully archived.`);
  } catch (e) {
    console.error("Error archiving document:", e);
  }
});




const delbtn = document.querySelectorAll("#ANDelete");
delbtn.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    // Clear previous highlights
    document.querySelectorAll(".highlighted-row").forEach((row) => {
      row.classList.remove("highlighted-row");

    });

    // Highlight the current row
    const parentRow = event.target.closest("tr");
    if (parentRow) {
      parentRow.classList.add("highlighted-row");

    }
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


