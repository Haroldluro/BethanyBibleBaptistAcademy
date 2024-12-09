import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, updateDoc, getDoc, getDocs, doc, collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
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



const db = getFirestore(app);
const studentCollectionRef = collection(db, "students");


let studentDetails = [];
const tableTemplate = document.querySelector('[student-template]');
const tableST = document.getElementById("tableST");


async function getTeacherDetails(uid) {
  let sectionHandled = "";

  try {

    const teacherDocRef = doc(db, "users", uid);
    const teacherDocSnap = await getDoc(teacherDocRef);

    if (!teacherDocSnap.exists()) {
      throw new Error("Teacher document not found.");
    }

    const { teacherID, emailAddress, role, isActive } = teacherDocSnap.data();


    const teacherDetailsDocRef = doc(db, "teacher", teacherID);
    const teacherDetailsDocSnap = await getDoc(teacherDetailsDocRef);

    if (!teacherDetailsDocSnap.exists()) {
      throw new Error("Additional teacher details not found.");
    }

    const { firstName, lastName, gradeLevelHandled } = teacherDetailsDocSnap.data();
    sectionHandled = teacherDetailsDocSnap.data().sectionHandled; // Set sectionHandled

    // Step 3: Display the teacher's details
    const teacherName = `${lastName}, ${firstName}`;
    document.querySelector("#gradelevel").textContent = gradeLevelHandled;
    document.querySelector("#section").textContent = sectionHandled;

    console.log("Teacher details displayed successfully.");
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    alert("Failed to load teacher details.");
  }

  try {
    // Query students where section matches sectionHandled
    if (!sectionHandled) {
      throw new Error("Section handled is not defined.");
    }

    const q = query(studentCollectionRef, where("section", "==", sectionHandled));
    const studentQuerySnapshot = await getDocs(q);

    studentDetails = studentQuerySnapshot.docs.map((doc) => {
      const student = tableTemplate.content.cloneNode(true).children[0];
      student.querySelector("#STID").innerHTML = doc.data()["studentID"];
      student.querySelector("#STFName").innerHTML = doc.data()["firstName"];
      student.querySelector("#STLName").innerHTML = doc.data()["lastName"];
      student.querySelector("#gradesbtn").setAttribute("data-id", doc.data()["studentID"]);
      student.classList.remove("hidden");
      tableST.append(student);

      return {
        studentID: doc.data()["studentID"] || "",
        Name: doc.data()["lastName"] + ", " + doc.data()["firstName"] || "",
        gradeLevel: doc.data()["gradeLevel"] || "",
        element: student
      };
    });
    console.log("Student details fetched successfully.");
  } catch (error) {
    console.error("Error fetching students:", error);
    alert("Failed to load student details.");
  }
}





const gradeTableTemplate = document.querySelector('[grade-template-table]');
const applyBtn = document.querySelector("#save-changes");

async function displayGradeDetails(id) {

  const docRef = doc(db, "grades", id);
  const docSnap = await getDoc(docRef);
  const tableGT = document.getElementById("tableGR");

  const grades = docSnap.data().Grades;
  tableGT.innerHTML = "";

  // Iterate through all keys in the Grades map
  for (const [subject, innerMap] of Object.entries(grades)) {
    const grade = gradeTableTemplate.content.cloneNode(true).children[0];
    grade.querySelector("#subject").innerHTML = subject;
    grade.querySelector("#first").value = innerMap.first;
    grade.querySelector("#second").value = innerMap.second;
    grade.querySelector("#third").value = innerMap.third;
    grade.querySelector("#fourth").value = innerMap.fourth;
    const str1 = innerMap.first;
    const str2 = innerMap.second;
    const str3 = innerMap.third;
    const str4 = innerMap.fourth;
    const num1 = +str1;
    const num2 = +str2;
    const num3 = +str3;
    const num4 = +str4;
    const finalGrade = (num1 + num2 + num3 + num4) / 4;
    grade.querySelector("#final").value = finalGrade;
    tableGT.append(grade);
  }
}

async function gradesEdit(id) {
  const docRef = doc(db, "grades", id);
  const docSnap = await getDoc(docRef);
  const tableGT = document.getElementById("tableGR");
  let outterMap = new Map();
  let innerMap = new Map();

  // Assuming tableGT is the HTML table element
  for (let row of tableGT.rows) {
    const subjectName = row.cells[0].textContent;
    const first = row.cells[1].querySelector("#first").value;
    const second = row.cells[2].querySelector("#second").value;
    const third = row.cells[3].querySelector("#third").value;
    const fourth = row.cells[4].querySelector("#fourth").value;
    console.log(subjectName, first, second, third, fourth);
    const marks = {
      first,
      second,
      third,
      fourth
    };
    innerMap.set(subjectName, marks);
  }
  outterMap.set('Grades', Object.fromEntries(innerMap));
  const gradesObject = Object.fromEntries(outterMap);
  await updateDoc(docRef, gradesObject);
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.uid);
    // Fetch and display teacher details for the logged-in user
    getTeacherDetails(user.uid).then(() => {
      console.log("Teacher details displayed successfully.");

      // Attach event listeners to dynamically added buttons
      attachGradeButtonListeners();
    });
  } else {
    console.log("No user is logged in.");
    // Optionally, redirect to login page
    window.location.href = "/landing/login.html";
  }
});

function attachGradeButtonListeners() {
  const gradeBtns = document.querySelectorAll("#gradesbtn");
  console.log("Grade Buttons Found:", gradeBtns.length); // Check if buttons exist
  gradeBtns.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      console.log("Button clicked");
      try {
        const reqId = btn.getAttribute("data-id");
        console.log("Request ID:", reqId);
        displayGradeDetails(reqId);
        applyBtn.addEventListener("click", async (event) => {
          gradesEdit(reqId);
        });
      } catch (e) {
        console.error("Error fetching document:", e);
      }
    });
  });
}