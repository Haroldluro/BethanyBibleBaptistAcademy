import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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
const db = getFirestore(app);




const submitbtn = document.getElementById('submitBtn');

// Enrollment Form Elements
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
// Missing id corrected for province input:
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
// Corrected id for guardian's mobile and email inputs:
const guarMobNumInp = document.getElementById('guarMobNumInp');
const guarEmailInp = document.getElementById('guarEmailInp');

const lastSchoolInp = document.getElementById('lastSchoolInp');
const grade = document.getElementById('grade');

// Form Action Buttons
const clearBtn = document.getElementById('clearBtn');
const submitBtn = document.getElementById('submitBtn');

const enrollmentCollection = collection(db, "enrollmentDetails");

submitBtn.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent form submission

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
    };

      // Add data to Firestore
    const docRef = await addDoc(enrollmentCollection, enrollmentData);
    console.log("Document written with ID: ", docRef.id);
    alert("Enrollment data saved successfully!");
    } catch (e) {
    console.error("Error adding document: ", e);
    lert("Failed to save enrollment data.");
    }
});

clearBtn.addEventListener("click", () => {
    LRNInp.value = "";
    lNameInp.value = "";
    fNameInp.value = "";
    mNameInp.value = "";
    sexInp.value = "";
    birthDateInp.value = "";
    religionInp.value = "";
    mobNumInp.value = "";
    emailInp.value = "";
    houseNumInp.value = "";
    cityInp.value = "";
    provinceInp.value = "";
    fathNameInp.value = "";
    fathOccInp.value = "";
    fathMobNumInp.value = "";
    fathEmailInp.value = "";
    mothNameInp.value = "";
    mothOccInp.value = "";
    mothMobNumInp.value = "";
    mothEmailInp.value = "";
    guarNameInp.value = "";
    guarRelatsionshipInp.value = "";
    guarMobNumInp.value = "";
    guarEmailInp.value = "";
    lastSchoolInp.value = "";
    grade.value = "";
  });