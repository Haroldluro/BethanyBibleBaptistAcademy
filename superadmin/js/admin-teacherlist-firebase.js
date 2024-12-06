import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, getDocs, collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
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
const collectionRef = collection(db, "teacher");
const querySnapshot = await getDocs(collectionRef);

let teacherDetails = [];
const tableTemplate = document.querySelector('[teacher-template]');
const tableTT = document.getElementById("tableTT");




async function getTeacherDetails() {
  try {
    tableTT.innerHTML = "";

    teacherDetails = querySnapshot.docs.map((doc) => {
      const teacher = tableTemplate.content.cloneNode(true).children[0];
      teacher.querySelector("#TTID").innerHTML = doc.data()["teacherID"];
      teacher.querySelector("#TTName").innerHTML = doc.data()["lastName"] + ", " + doc.data()["firstName"];
      teacher.querySelector("#TTGrade").innerHTML = doc.data()["gradeLevelHandled"];
      teacher.querySelector("#TTView").setAttribute("data-id", doc.data()["teacherID"]);
      // teacher.querySelector("#TTDelete").setAttribute("data-id", doc.data()["teacherID"]);
      // teacher.querySelector("#TTAccept").setAttribute("data-id", doc.data()["teacherID"]);
      teacher.classList.remove("hidden");
      tableTT.append(teacher);
      return {
        teacherID: doc.data()["teacherID"] || "",
        name: doc.data()["lastName"] + ", " + doc.data()["firstName"] || "",
        gradeLevel: doc.data()["gradeLevel"] || "",
        element: teacher
      };
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

getTeacherDetails();

async function getMaxTeacherID() {
  const collectionRef = collection(db, "teacher");
  const querySnapshot = await getDocs(collectionRef);
  let maxID = 0;

  querySnapshot.forEach((doc) => {
    const teacherID = doc.data()["teacherID"];
    if (teacherID) {
      const num = parseInt(teacherID.replace("T-", ""));
      if (num > maxID) {
        maxID = num;
      }
    }
  });

  return maxID;
}

document.getElementById("create-teacher-btn").addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent default anchor behavior

  const fields = [
    { field: document.getElementById("lNameInp"), name: "Last Name", validator: (value) => value.trim() !== "" },
    { field: document.getElementById("fNameInp"), name: "First Name", validator: (value) => value.trim() !== "" },
    { field: document.getElementById("mNameInp"), name: "Middle Name", validator: (value) => value.trim() !== "" },
    { field: document.getElementById("sexInp"), name: "Sex", validator: (value) => value.trim() !== "" },
    { field: document.getElementById("birthDateInp"), name: "Birthdate", validator: (value) => value.trim() !== "" },
    {
      field: document.getElementById("mobNumInp"),
      name: "Mobile Number",
      validator: (value) => /^\d{11}$/.test(value.trim()), // Mobile number should have exactly 11 digits
    },
    {
      field: document.getElementById("emailInp"),
      name: "Email Address",
      validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), // Basic email validation
    },
    {
      field: document.getElementById("gradetohandle"),
      name: "Grade Level Handled",
      validator: (value) => value.trim() !== "", // Ensure a value is selected
    },
  ];

  for (const { field, name, validator } of fields) {
    if (!validator(field.value)) {
      alert(`Invalid or missing input in the ${name} field.`);
      field.focus();
      return; // Stop execution if a field fails validation
    }
  }

  try {
    const maxID = await getMaxTeacherID(); // Wait for the function to complete
    const newTeacherID = "T-" + String(maxID + 1).padStart(3, "0"); // Generate a new teacher ID
    alert(`New Teacher ID: ${newTeacherID}`);

    // Assign teacher data to variables
    const lastName = document.getElementById("lNameInp").value.trim();
    const firstName = document.getElementById("fNameInp").value.trim();
    const middleName = document.getElementById("mNameInp").value.trim();
    const sex = document.getElementById("sexInp").value.trim();
    const birthDate = document.getElementById("birthDateInp").value.trim();
    const mobileNumber = document.getElementById("mobNumInp").value.trim();
    const email = document.getElementById("emailInp").value.trim();
    const gradeLevelHandled = document.getElementById("gradetohandle").value.trim();

    // Proceed with form submission or adding the teacher to Firestore
    const teacherData = {
      teacherID: newTeacherID,
      lastName,
      firstName,
      middleName,
      sex,
      birthDate,
      mobileNumber,
      email,
      gradeLevelHandled,
    };

    // Add teacher data to Firestore
    const teacherCollectionRef = collection(db, "teacher");
    await setDoc(doc(teacherCollectionRef, newTeacherID), teacherData);

    const auth = getAuth();
    const userEmail = `${lastName.toLowerCase()}${firstName.toLowerCase()}@bethanybaptist.com`; // Corrected email format
    const password = "Teacher123";
    const role = "teacher";

    try {
      // Step 1: Create Authentication Account
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
      const user = userCredential.user; // Firebase Auth UID
      console.log("Account created for:", user.email);

      // Step 4: Create entry in the `users` collection
      const usersRef = doc(db, "users", user.uid); // Use the Firebase Auth UID as document ID
      await setDoc(usersRef, {
        emailAddress: user.email,
        role: role,
        teacherID: newTeacherID,
        createdAt: new Date().toISOString(),
        isActive: true, // Optional: Indicates account status
      });
      console.log("User entry added to 'users' collection");

      // Optional: Notify user or admin
      alert(`Account successfully created for ${firstName} ${lastName}`);
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account. Please check the details and try again.");
    }

  } catch (error) {
    console.error("Error creating teacher:", error);
    alert("An error occurred while creating the teacher.");
  }
});


const viewBtn = document.querySelectorAll("#TTView");

viewBtn.forEach((btn) => {
  btn.addEventListener("click", async () => {
    try {
      const reqId = btn.getAttribute("data-id");

      // Fetch teacher details
      const docRef = doc(db, "teacher", reqId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Populate input fields
        lNameInpe.value = data.lastName || "";
        fNameInpe.value = data.firstName || "";
        mNameInpe.value = data.middleName || "";
        sexInpe.value = data.sex || "";
        birthDateInpe.value = data.birthDate || "";
        mobNumInpe.value = data.mobileNumber || "";
        emailInpe.value = data.email || "";
        gradetohandlee.value = data.gradeLevelHandled || "";

        // Attach the teacher ID to the "Edit" button
        document.getElementById("updatebtn").setAttribute("data-edit-id", reqId);

      }
    } catch (e) {
      console.error("Error fetching document:", e);
    }
  });



});


const updateBtn = document.getElementById("updatebtn");
updateBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  // Get the teacher ID from a hidden input or attribute
  const teacherID = document.getElementById("updatebtn").getAttribute("data-edit-id");
  if (!teacherID) {
    alert("No teacher selected for editing!");
    return;
  }

  const fields = [
    { field: lNameInpe, name: "Last Name", validator: (value) => value.trim() !== "" },
    { field: fNameInpe, name: "First Name", validator: (value) => value.trim() !== "" },
    { field: mNameInpe, name: "Middle Name", validator: (value) => value.trim() !== "" },
    { field: sexInpe, name: "Sex", validator: (value) => value.trim() !== "" },
    { field: birthDateInpe, name: "Birthdate", validator: (value) => value.trim() !== "" },
    {
      field: mobNumInpe,
      name: "Mobile Number",
      validator: (value) => /^\d{11}$/.test(value.trim()), // Mobile number should have exactly 11 digits
    },
    {
      field: emailInpe,
      name: "Email Address",
      validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), // Basic email validation
    },
    {
      field: gradetohandlee,
      name: "Grade Level Handled",
      validator: (value) => value.trim() !== "", // Ensure a value is selected
    },
  ];

  // Validate input fields
  for (const { field, name, validator } of fields) {
    if (!validator(field.value)) {
      alert(`Invalid or missing input in the ${name} field.`);
      field.focus();
      return; // Stop execution if a field fails validation
    }
  }

  // Prepare teacher data for update
  const teacherData = {
    lastName: lNameInpe.value.trim(),
    firstName: fNameInpe.value.trim(),
    middleName: mNameInpe.value.trim(),
    sex: sexInpe.value.trim(),
    birthDate: birthDateInpe.value.trim(),
    mobileNumber: mobNumInpe.value.trim(),
    email: emailInpe.value.trim(),
    gradeLevelHandled: gradetohandlee.value.trim(),
  };

  try {
    // Update the teacher document in Firestore
    const teacherDocRef = doc(db, "teacher", teacherID);
    await updateDoc(teacherDocRef, teacherData);

    alert("Teacher updated successfully!");

    // Optionally clear the form after editing
    // fields.forEach(({ field }) => (field.value = ""));
    // document.getElementById("updatebtn").removeAttribute("data-edit-id");
    const closeButton = document.querySelector(".close-btn");
    if (closeButton) {
      closeButton.click();  // Simulate the click event on the close button
    }
    // Refresh the teacher table
    await getTeacherDetails();
  } catch (error) {
    console.error("Error updating teacher data:", error);
    alert("An error occurred while updating teacher data.");
  }
});

document.querySelector('.filter-btn').addEventListener('click', (e) => {
  e.preventDefault();
  console.log("Filter button clicked");
  const dropdownMenu = document.querySelector('.dropdown-menu');
  dropdownMenu.classList.toggle('show'); // Toggle visibility of the menu
});

// Function to handle sorting and filtering
function applyFilter(filterType) {
  console.log("Applying filter:", filterType); // For debugging purposes

  const rows = Array.from(document.querySelectorAll("#tableTT .tablerow"));

  if (filterType === 'ascName') {
    rows.sort((a, b) => {
      const nameA = a.querySelector("#TTName").textContent;
      const nameB = b.querySelector("#TTName").textContent;
      return nameA.localeCompare(nameB); // Sort ascending by name
    });
  } else if (filterType === 'descName') {
    rows.sort((a, b) => {
      const nameA = a.querySelector("#TTName").textContent;
      const nameB = b.querySelector("#TTName").textContent;
      return nameB.localeCompare(nameA); // Sort descending by name
    });
  }
  // Append the sorted rows back into the table
  const tbody = document.querySelector("#tableTT");
  rows.forEach(row => tbody.appendChild(row)); // Reorder the rows in the table
}

// Event listeners for filter options
document.querySelectorAll('.dropdown-menu li a').forEach((filter) => {
  filter.addEventListener('click', (e) => {
    e.preventDefault();
    const filterType = filter.getAttribute('data-filter');
    applyFilter(filterType); // Call the applyFilter function

    // Close the dropdown after the filter is applied
    document.querySelector('.dropdown-menu').classList.remove('show');
  });
});