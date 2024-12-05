import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";

// Firebase Authentication imports
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Firestore imports
import {
  getFirestore,
  updateDoc,
  doc,
  orderBy,
  limit,
  setDoc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDQrgbw4TlLtLbex-BiEk58nA4l_zoDAmo",
  authDomain: "bbba-96d01.firebaseapp.com",
  projectId: "bbba-96d01",
  storageBucket: "bbba-96d01.firebasestorage.app",
  messagingSenderId: "9762028958",
  appId: "1:9762028958:web:4b10cd0c5458b098e56a8f",
  measurementId: "G-8YJS0ZTJ4C"
};

const LRNInp = document.getElementById('LRNInp');
const lNameInp = document.getElementById('lNameInp');
const fNameInp = document.getElementById('fNameInp');
const mNameInp = document.getElementById('mNameInp');
const sexInp = document.getElementById('sexInp');
const birthDateInp = document.getElementById('birthDateInp');
const religionInp = document.getElementById('religionInp');
const mobNumInp = document.getElementById('mobNumInp');
const emailInp = document.getElementById('emailInp');
const houseNumInp = document.getElementById('houseNumInp');
const cityInp = document.getElementById('cityInp');
const provinceInp = document.getElementById('provinceInp');

const fathNameInp = document.getElementById('fathNameInp');
const fathOccInp = document.getElementById('fathOccInp');
const fathMobNumInp = document.getElementById('fathMobNumInp');
const fathEmailInp = document.getElementById('fathEmailInp');

const mothNameInp = document.getElementById('mothNameInp');
const mothOccInp = document.getElementById('mothOccInp');
const mothMobNumInp = document.getElementById('mothMobNumInp');
const mothEmailInp = document.getElementById('mothEmailInp');

const guarNameInp = document.getElementById('guarNameInp');
const guarRelatsionshipInp = document.getElementById('guarRelatsionshipInp');
const guarMobNumInp = document.getElementById('guarMobNumInp');
const guarEmailInp = document.getElementById('guarEmailInp');

const lastSchoolInp = document.getElementById('lastSchoolInp');
const grade = document.getElementById('grade');
const tableTemplate = document.querySelector('[student-template]');
const tableER = document.getElementById("tableER");
let student = [];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const collectionRef = collection(db, "enrollmentsDetails");
const querySnapshot = await getDocs(query(collectionRef, where("status", "==", "Pending")));
let studentDetails = [];

async function displayTableDetails() {
  try {
    studentDetails = querySnapshot.docs.map((doc) => {
      const student = tableTemplate.content.cloneNode(true).children[0];
      student.querySelector("#ERID").innerHTML = doc.data()["LRN"];
      student.querySelector("#ERLastName").innerHTML = doc.data()["lastName"];
      student.querySelector("#ERFirstName").innerHTML = doc.data()["firstName"];
      student.querySelector("#ERGrade").innerHTML = doc.data()["gradeLevel"];
      student.querySelector("#ERView").setAttribute("data-id", doc.data()["LRN"]);
      student.querySelector("#ERDelete").setAttribute("data-id", doc.data()["LRN"]);
      student.classList.remove("hidden");
      tableER.append(student);
      return { LRN: doc.data()["LRN"] || "", lastName: doc.data()["lastName"] || "", firstName: doc.data()["firstName"] || "", gradeLevel: doc.data()["gradeLevel"] || "", element: student };
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

displayTableDetails();

const searchBtn = document.getElementById("searchbtn");
const searchInput = document.getElementById("searchinput");

searchInput.addEventListener("input", async (event) => {
  const searchTerm = event.target.value.toLowerCase();
  console.log(studentDetails);
  studentDetails.forEach((student) => {
    const isMatch = student.LRN.includes(searchTerm) || student.lastName.toLowerCase().includes(searchTerm) || student.firstName.toLowerCase().includes(searchTerm);
    student.element.classList.toggle("hidden", !isMatch);
  })
});

const accptBtn = document.getElementById("acceptbtn");
const modalDeleteBtn = document.getElementById("modalDeleteBtn");
const delbtn = document.querySelectorAll("#ERDelete");
const rejBtn = document.getElementById("rejectbtn");
const viewBtn = document.querySelectorAll("#ERView");

viewBtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {

      const reqId = btn.getAttribute("data-id");
      console.log("Request ID:", reqId);

      // Fetch document from Firestore
      const docRef = doc(db, "enrollmentsDetails", reqId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Document Data:", data);

        // Populate input fields
        LRNInp.value = data.LRN || "";
        lNameInp.value = data.lastName || "";
        fNameInp.value = data.firstName || "";
        mNameInp.value = data.middleName || "";
        sexInp.value = data.sex || "";
        birthDateInp.value = data.birthDate || "";
        religionInp.value = data.religion || "";
        mobNumInp.value = data.mobileNumber || "";
        emailInp.value = data.email || "";
        houseNumInp.value = data.address.houseNumber || "";
        cityInp.value = data.address.city || "";
        provinceInp.value = data.address.province || "";
        fathNameInp.value = data.father.name || "";
        fathOccInp.value = data.father.occupation || "";
        fathMobNumInp.value = data.father.mobileNumber || "";
        fathEmailInp.value = data.father.email || "";
        mothNameInp.value = data.mother.name || "";
        mothOccInp.value = data.mother.occupation || "";
        mothMobNumInp.value = data.mother.mobileNumber || "";
        mothEmailInp.value = data.mother.email || "";
        guarNameInp.value = data.guardian.name || "";
        guarRelatsionshipInp.value = data.guardian.relationship || "";
        guarMobNumInp.value = data.guardian.mobileNumber || "";
        guarEmailInp.value = data.guardian.email || "";
        lastSchoolInp.value = data.lastSchool || "";
        grade.value = data.gradeLevel || "";
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.error("Error fetching document:", e);
    }
  });
});

delbtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {

      const reqIdElement = btn.getAttribute("data-id");

      const reqId = reqIdElement.textContent.trim();
      console.log("Request ID:", reqId);

      // Fetch document from Firestore
      const docRef = doc(db, "enrollmentsDetails", reqId);
      console.log(docRef)
      modalDeleteBtn.addEventListener("click", async (event) => {
        updateDoc(docRef, {
          status: "Rejected"
        })
      });
    } catch (e) {
      console.error("Error fetching document:", e);
    }
  })
})

rejBtn.addEventListener("click", async (event) => {
  try {

    const lrnValue = LRNInp.value;

    // Fetch document from Firestore
    const docRef = doc(db, "enrollmentsDetails", lrnValue);

    console.log(docRef)
    updateDoc(docRef, {
      status: "Rejected"
    })
  } catch (e) {
    console.error("Error fetching document:", e);
  }
})

accptBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const fields = [
    { field: LRNInp, name: "LRN", validator: (value) => /^\d{12}$/.test(value.trim()) },
    { field: lNameInp, name: "Last Name", validator: (value) => value.trim() !== "" },
    { field: fNameInp, name: "First Name", validator: (value) => value.trim() !== "" },
    { field: mNameInp, name: "Middle Name", validator: (value) => value.trim() !== "" },
    { field: sexInp, name: "Sex", validator: (value) => value.trim() !== "" },
    { field: birthDateInp, name: "Birth Date", validator: (value) => value.trim() !== "" },
    { field: religionInp, name: "Religion", validator: (value) => value.trim() !== "" },
    {
      field: mobNumInp,
      name: "Mobile Number",
      validator: (value) => /^\d{11}$/.test(value), // Must be exactly 11 digits
    },
    {
      field: emailInp,
      name: "Email",
      validator: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), // Simple email format check
    },
    { field: houseNumInp, name: "House Number", validator: (value) => value.trim() !== "" },
    { field: cityInp, name: "City", validator: (value) => value.trim() !== "" },
    { field: provinceInp, name: "Province", validator: (value) => value.trim() !== "" },
    { field: fathNameInp, name: "Father's Name", validator: (value) => value.trim() !== "" },
    { field: fathOccInp, name: "Father's Occupation", validator: (value) => value.trim() !== "" },
    {
      field: fathMobNumInp,
      name: "Father's Mobile Number",
      validator: (value) => /^\d{11}$/.test(value), // Must be exactly 11 digits
    },
    {
      field: fathEmailInp,
      name: "Father's Email",
      validator: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), // Simple email format check
    },
    { field: mothNameInp, name: "Mother's Name", validator: (value) => value.trim() !== "" },
    { field: mothOccInp, name: "Mother's Occupation", validator: (value) => value.trim() !== "" },
    {
      field: mothMobNumInp,
      name: "Mother's Mobile Number",
      validator: (value) => /^\d{11}$/.test(value), // Must be exactly 11 digits
    },
    {
      field: mothEmailInp,
      name: "Mother's Email",
      validator: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), // Simple email format check
    },
    { field: guarNameInp, name: "Guardian's Name", validator: (value) => value.trim() !== "" },
    {
      field: guarRelatsionshipInp,
      name: "Guardian's Relationship",
      validator: (value) => value.trim() !== "",
    },
    {
      field: guarMobNumInp,
      name: "Guardian's Mobile Number",
      validator: (value) => /^\d{11}$/.test(value), // Must be exactly 11 digits
    },
    {
      field: guarEmailInp,
      name: "Guardian's Email",
      validator: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), // Simple email format check
    },
    { field: lastSchoolInp, name: "Last School", validator: (value) => value.trim() !== "" },
    { field: grade, name: "Grade Level", validator: (value) => value.trim() !== "" },
  ];

  for (const { field, name, validator } of fields) {
    if (!validator(field.value)) {
      alert(`Invalid or missing input in the ${name} field.`);
      field.focus();
      return; // Stop execution if a field fails validation
    }
  }

  try {


    // Collect data from form fields
    const enrollmentData = {
      LRN: LRNInp.value,
      lastName: lNameInp.value,
      firstName: fNameInp.value,
      middleName: mNameInp.value,
      sex: sexInp.value,
      birthDate: birthDateInp.value,
      religion: religionInp.value,
      mobileNumber: mobNumInp.value,
      email: emailInp.value,
      address: {
        houseNumber: houseNumInp.value,
        city: cityInp.value,
        province: provinceInp.value,
      },
      father: {
        name: fathNameInp.value,
        occupation: fathOccInp.value,
        mobileNumber: fathMobNumInp.value,
        email: fathEmailInp.value,
      },
      mother: {
        name: mothNameInp.value,
        occupation: mothOccInp.value,
        mobileNumber: mothMobNumInp.value,
        email: mothEmailInp.value,
      },
      guardian: {
        name: guarNameInp.value,
        relationship: guarRelatsionshipInp.value,
        mobileNumber: guarMobNumInp.value,
        email: guarEmailInp.value,
      },
      lastSchool: lastSchoolInp.value,
      gradeLevel: grade.value,
      status: "Approved",
      enrollmentDate: serverTimestamp(),
    };
    const docRef = doc(db, "enrollmentsDetails", LRNInp.value);
    await setDoc(docRef, enrollmentData);

    const auth = getAuth();
    const email = `${lNameInp.value.toLowerCase()}${fNameInp.value.toLowerCase()}@bethanybaptist.com`;
    const password = "Student123";
    const lrn = LRNInp.value;
    const role = "student";

    try {
      // Step 1: Create Authentication Account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Firebase Auth UID
      console.log("Account created for:", user.email);

      // Step 2: Create entry in the `users` collection
      const usersRef = doc(db, "users", user.uid); // Use the Firebase Auth UID as document ID
      await setDoc(usersRef, {
        emailAddress: user.email,
        role: role,
        lrn: lrn,
        createdAt: new Date().toISOString(),
        isActive: true, // Optional: Indicates account status
      });
      console.log("User entry added to 'users' collection");

      // Optional: Notify user or admin
      alert(`Account successfully created for ${fNameInp.value} ${lNameInp.value}`);
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account. Please check the details and try again.");
    }

    try {
      const studentData = {
        firstName: fNameInp.value.trim(),
        lastName: lNameInp.value.trim(),
        gradeLevel: grade.value,
        enrolledOn: serverTimestamp(),
        teacher: "",
      };

      // Use LRN as document ID for students table
      const studentDocRef = doc(db, "students", lrnInp.value);
      await setDoc(studentDocRef, studentData);

      alert("Student accepted and account created successfully!");
    } catch (error) {
      console.error("Error creating student data:", error);
      alert("Failed to process the enrollment. Please try again.");
    }

  } catch (e) {
    console.error("Error fetching document:", e);
  }
});
//try lang to harold hehe



// Event listener for modalDeleteBtn
modalDeleteBtn.addEventListener("click", async (event) => {
  try {
    // Retrieve the ID of the row/document to be deleted
    const parentRow = document.querySelector(".highlighted-row"); // Assuming you add a specific class when a row is selected
    if (!parentRow) {
      console.error("No row selected for deletion.");
      return;
    }
    const reqIdElement = parentRow.querySelector("#ERID");

    if (!reqIdElement) {
      console.error("Request ID not found in the selected row.");
      return;
    }

    const reqId = reqIdElement.textContent.trim();
    console.log("Request ID to delete:", reqId);

    // Reference to the Firestore document
    const docRef = doc(db, "enrollmentsDetails", reqId);

    // Archive the document
    await updateDoc(docRef, {
      status: "Rejected",
    });

    // Optionally remove the row from the table
    parentRow.remove();
    console.log(`Document with ID ${reqId} successfully archived.`);
  } catch (e) {
    console.error("Error archiving document:", e);
  }
});

// Optional: Highlight the row when the delete button is clicked
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



