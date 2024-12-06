import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, getDocs, collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
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

    // Proceed with form submission or adding the teacher to Firestore
    const teacherData = {
      teacherID: newTeacherID,
      lastName: document.getElementById("lNameInp").value.trim(),
      firstName: document.getElementById("fNameInp").value.trim(),
      middleName: document.getElementById("mNameInp").value.trim(),
      sex: document.getElementById("sexInp").value.trim(),
      birthDate: document.getElementById("birthDateInp").value.trim(),
      mobileNumber: document.getElementById("mobNumInp").value.trim(),
      email: document.getElementById("emailInp").value.trim(),
      gradeLevelHandled: document.getElementById("gradetohandle").value.trim(),
    };

    // Replace `addDoc` and `teacherCollectionRef` with your actual Firestore setup
    const teacherCollectionRef = collection(db, "teacher");
    await setDoc(doc(teacherCollectionRef, newTeacherID), teacherData);

    alert("Teacher created successfully!");
  } catch (error) {
    console.error("Error creating teacher:", error);
    alert("An error occurred while creating the teacher.");
  }
});

const viewBtn = document.querySelectorAll("#TTView");

viewBtn.forEach((btn) => {
  console.log("Clicked");
  btn.addEventListener("click", async (event) => {
    try {
      const reqId = btn.getAttribute("data-id");
      console.log("Request ID:", reqId);

      // Fetch document from Firestore
      const docRef = doc(db, "teacher", reqId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Document Data:", data);

        // Populate input fields
        lNameInpe.value = data.lastName || "";
        fNameInpe.value = data.firstName || "";
        mNameInpe.value = data.middleName || "";
        sexInpe.value = data.sex || "";
        birthDateInpe.value = data.birthDate || "";
        mobNumInpe.value = data.mobileNumber || "";
        emailInpe.value = data.email || "";
        gradetohandlee.value = data.gradeLevelHandled || "";
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.error("Error fetching document:", e);
    }
  });



});



