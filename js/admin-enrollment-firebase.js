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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const collectionRef = collection(db, "enrollmentsDetails");
const querySnapshot = await getDocs(collectionRef);

const accptBtn = document.getElementById("acceptbtn");
const rejBtn = document.getElementById("rejectbtn");
const viewBtn = document.querySelectorAll("#ERView")
const deleteBtn = document.querySelectorAll("#ERDelete");


async function displayTableDetails() {
  try {
    querySnapshot.forEach((doc) => {
      const tableER = document.getElementById("tableER");
      const tableERTemplate = document.getElementById("templateER");
      const cloneNode = tableERTemplate.cloneNode(true);

      cloneNode.querySelector("#ERID").innerHTML = doc.data()["LRN"];
      cloneNode.querySelector("#ERLastName").innerHTML = doc.data()["lastName"];
      cloneNode.querySelector("#ERFirstName").innerHTML = doc.data()["firstName"];
      cloneNode.querySelector("#ERGrade").innerHTML = doc.data()["gradeLevel"];
      cloneNode.querySelector("#ERView").id = doc.data()["LRN"];
      cloneNode.classList.remove("hidden");
      tableER.appendChild(cloneNode);
    });
  } catch (e) {
    console.error("Error adding document: ", e);
}};

viewBtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {
      // Get the corresponding ERID from the clicked button's row
      const parentRow = event.target.closest("td"); // Assuming the button is inside a table row
      const reqIdElement = parentRow.querySelector("#ERID");

      if (!reqIdElement) {
        throw new Error("Element with ID 'ERID' not found in this row.");
      }

      const reqId = reqIdElement.textContent.trim();
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
        houseNumInp.value = data.houseNumber || "";
        cityInp.value = data.city || "";
        provinceInp.value = data.province || "";
        fathNameInp.value = data.fatherName || "";
        fathOccInp.value = data.fatherOccupation || "";
        fathMobNumInp.value = data.fatherMobileNumber || "";
        fathEmailInp.value = data.fatherEmail || "";
        mothNameInp.value = data.motherName || "";
        mothOccInp.value = data.motherOccupation || "";
        mothMobNumInp.value = data.motherMobileNumber || "";
        mothEmailInp.value = data.motherEmail || "";
        guarNameInp.value = data.guardianName || "";
        guarRelatsionshipInp.value = data.guardianRelationship || "";
        guarMobNumInp.value = data.guardianMobileNumber || "";
        guarEmailInp.value = data.guardianEmail || "";
        lastSchoolInp.value = data.lastSchool || "";
        grade.value = data.grade || "";
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.error("Error fetching document:", e);
    }
  });
});



accptBtn.addEventListener("click", async(event) => {
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
      status: "Accepted",
      enrollmentDate: serverTimestamp(),
  };

    // Add data to Firestore

  const docRef = doc(db, "enrollmentsDetails", LRNInp.value);
  await setDoc(docRef, enrollmentData);
  console.log("Document written with ID: ", docRef.id);
  alert("Enrollment data saved successfully!");
  } catch (e) {
  console.error("Error adding document: ", e);
  alert("Failed to save enrollment data.");
  }

});

displayTableDetails();