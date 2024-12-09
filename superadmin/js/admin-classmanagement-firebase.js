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
const gradeLevelCollectionRef = collection(db, "gradeLevel");
const gradeLevelSnapshot = await getDocs(gradeLevelCollectionRef);
const gradeCollectionRef = collection(db, "grades");
const gradeSnapshot = await getDocs(gradeCollectionRef);

let gradeLevelDetails = [];
const tableTemplate = document.querySelector('[gradeLevel-template]');
const tableST = document.getElementById("tableGL");

async function getGradeLevelDetails() {
  try {
    gradeLevelDetails = gradeLevelSnapshot.docs.map((doc) => {
      const gradeLevel = tableTemplate.content.cloneNode(true).children[0];
      gradeLevel.querySelector("#GLID").innerHTML = doc.data()["name"];
      gradeLevel.querySelector("#GLName").innerHTML = doc.data().sections.length;

      console.log();
      gradeLevel.querySelector('#editbtn').setAttribute("data-id", doc.id);
      gradeLevel.classList.remove("hidden");
      tableST.append(gradeLevel);
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

getGradeLevelDetails();

const gradeBtn = document.querySelectorAll("#editbtn");
const addSection = document.getElementById("add-section");
const gradeTableTemplate = document.querySelector('[grade-template-table]');
const applyBtn = document.querySelector("#save-changes");
const closeBtn = document.querySelector("#close-popup");

async function displayGradeDetails(id) {
  const docRef = doc(db, "gradeLevel", id);
  const docSnap = await getDoc(docRef);
  const tableGT = document.getElementById("tableGR");
  
  const grades = docSnap.data().sections;
  tableGT.innerHTML = "";
  
  document.getElementById("grade-level").innerHTML = docSnap.data().name
  // Iterate through all keys in the Grades map
  for (const i of grades) {
    const grade = gradeTableTemplate.content.cloneNode(true).children[0];
    grade.querySelector("#section-name").value = i.sectionName;
    grade.querySelector("#teacher").value = i.teacher;

    const deleteBtn = grade.querySelector("#delete-btn");
    deleteBtn.addEventListener("click", function(){
      deleteBtn.parentNode.closest("tr").remove();
    })

    tableGT.append(grade);
  }
  
}

async function gradesEdit(id) {
  console.log(id);
  const docRef = doc(db, "gradeLevel", id);

  var sectionsArr = [];
  const tbody = document.getElementById("tableGR")
  for (let row of tbody.rows) {
    var sectionName = row.querySelector("#section-name").value;
    var teacher = row.querySelector("#teacher").value;
    
    if(sectionName == '' && teacher == '') continue;
    const section = {
      sectionName: sectionName,
      teacher: teacher
    }
    
    sectionsArr.push(section);
  }
  
  await updateDoc(docRef, {
    sections: sectionsArr
  });

  location.href = "#"
  location.reload();
}

function addRow() {
  const tableGT = document.getElementById("tableGR");
  const grade = gradeTableTemplate.content.cloneNode(true).children[0];
    grade.querySelector("#section-name").value = "";
    grade.querySelector("#teacher").value = "";

    const deleteBtn = grade.querySelector("#delete-btn");
    deleteBtn.addEventListener("click", function(){
      deleteBtn.parentNode.closest("tr").remove();
    })

    tableGT.append(grade);
}

gradeBtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {
      const reqId = btn.getAttribute("data-id");
      console.log("Request ID:", reqId);
      displayGradeDetails(reqId);
      applyBtn.addEventListener("click", async (event) => {
        gradesEdit(reqId);
      })

      closeBtn.addEventListener("click", function(){
        location.href = "#";
        location.reload();
      })

      addSection.addEventListener("click", addRow)

    } catch (e) {
      console.error("Error fetching document:", e);
    }
  })
});

