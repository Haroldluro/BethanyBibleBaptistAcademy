import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, updateDoc,getDoc, getDocs, doc,collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
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
    const uid = user.uid;
  } else {

  }
});

const db = getFirestore(app);
const studentCollectionRef = collection(db, "gradeLevel");
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
      student.querySelector("#STID").innerHTML = doc.data()["name"];
      student.querySelector("#STName").innerHTML = doc.data().sections.length;

      console.log();
      student.querySelector('#editbtn').setAttribute("data-id", doc.data()["studentID"]);
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

// const gradeBtn = document.querySelectorAll("#gradesbtn");
// const gradeTableTemplate = document.querySelector('[grade-template-table]');
// const applyBtn = document.querySelector("#save-changes");

// async function displayGradeDetails(id) {
//   const docRef = doc(db, "grades", id);
//   const docSnap = await getDoc(docRef);
//   const tableGT = document.getElementById("tableGR");
  
//   const grades = docSnap.data().Grades;
//   tableGT.innerHTML = "";
  
//   // Iterate through all keys in the Grades map
//   for (const [subject, innerMap] of Object.entries(grades)) {
//     const grade = gradeTableTemplate.content.cloneNode(true).children[0];
//     grade.querySelector("#subject").innerHTML = subject;
//     grade.querySelector("#first").value = innerMap.first;
//     grade.querySelector("#second").value = innerMap.second;
//     grade.querySelector("#third").value = innerMap.third;
//     grade.querySelector("#forth").value = innerMap.fourth;
//     const str1 = innerMap.first;
//     const str2 = innerMap.second;
//     const str3 = innerMap.third;
//     const str4 = innerMap.fourth;
//     const num1 = +str1;
//     const num2 = +str2;
//     const num3 = +str3;
//     const num4 = +str4;
//     const finalGrade = (num1 + num2 + num3 + num4) / 4;
//     grade.querySelector("#final").value = finalGrade;
//     tableGT.append(grade);
//   }
// }

// async function gradesEdit(id) {
//   const docRef = doc(db, "grades", id);
//   const docSnap = await getDoc(docRef);

//   const grades = docSnap.data().Grades;
//   for (let row of tbody.rows) {
//     const subjectName = row.cells[0].textContent;
//     for (const [subject, innerMap] of Object.entries(grades)){
//       const first = grade.querySelector("#first").value;
//       const second = grade.querySelector("#second").value;
//       const third = grade.querySelector("#third").value;
//       const fourth = grade.querySelector("#forth").value;
  
//     }
//   }
  
//   await updateDoc();
// }

// gradeBtn.forEach((btn) => {
//   btn.addEventListener("click", async (event) => {
//     try {
//       const reqId = btn.getAttribute("data-id");
//       console.log("Request ID:", reqId);
//       displayGradeDetails(reqId);
//       applyBtn.addEventListener("click", async (event) => {
//         gradesEdit(reqId);
//       })

//     } catch (e) {
//       console.error("Error fetching document:", e);
//     }
//   })
// });
