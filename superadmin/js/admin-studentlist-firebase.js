import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, getDoc, getDocs, doc, collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
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
const studentCollectionRef = collection(db, "students");
const studentSnapshot = await getDocs(studentCollectionRef);
const gradeCollectionRef = collection(db, "grades");
const gradeSnapshot = await getDocs(gradeCollectionRef);

let studentDetails = [];
const tableTemplate = document.querySelector('[student-template]');
const tableST = document.getElementById("tableST");

async function getStudentDetails() {
  try {
    studentDetails = studentSnapshot.docs.map((doc) => {
      const student = tableTemplate.content.cloneNode(true).children[0];
      student.querySelector("#STID").innerHTML = doc.data()["studentID"];
      student.querySelector("#STName").innerHTML = doc.data()["lastName"] + ", " + doc.data()["firstName"];
      student.querySelector("#STGrade").innerHTML = doc.data()["gradeLevel"];
      student.querySelector('#gradesbtn').setAttribute("data-id", doc.data()["studentID"]);
      student.querySelector('#deletebtn').setAttribute("data-id", doc.data()["studentID"]);
      student.querySelector('#accountsbtn').setAttribute("data-id", doc.data()["studentID"]);
      student.classList.remove("hidden");
      tableST.append(student);
      return {
        studentID: doc.data()["studentID"] || "",
        Name: doc.data()["lastName"] + ", " + doc.data()["firstName"] || "",
        gradeLevel: doc.data()["gradeLevel"] || "",
        element: student
      };
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

getStudentDetails();

const gradebtn = document.querySelectorAll("#gradesbtn");
const gradeTableTemplate = document.querySelector('[grade-template-table]');



gradebtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {
      const reqId = btn.getAttribute("data-id");
      console.log("Request ID:", reqId);

      const docRef = doc(db, "grades", reqId);
      const docSnap = await getDoc(docRef);
      const tableGT = document.getElementById("tableGR");

      if (docSnap.exists()) {
        const data = docSnap.data();
        const grade = gradeTableTemplate.content.cloneNode(true).children[0];
        console.log(grade);
        const grades = docSnap.data().Grades;

        // Iterate through all keys in the Grades map
        for (const [subject, innerMap] of Object.entries(grades)) {
          grade.querySelector("#subject").innerHTML = subject;
          tableGT.append(grade);
          // Access fields within each inner map
          for (const [key, value] of Object.entries(innerMap)) {
            let i = 1;
            grade.querySelector(`#grade${i}`).value = value;
            i++;
            tableGT.append(grade);
          }
        }

      } else {
        console.log("No such document!");
      }

    } catch (e) {
      console.error("Error fetching document:", e);
    }
  })
});
