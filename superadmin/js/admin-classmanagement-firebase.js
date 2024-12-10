import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, updateDoc,getDoc, getDocs, doc,collection, getCountFromServer, DocumentReference } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
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
const teacherCollectionRef = collection(db, "teacher");
const teacherSnapshot = await getDocs(teacherCollectionRef);
const subjectsCollectionRef = collection(db, "subjects");
const subjectsSnapshot = await getDocs(subjectsCollectionRef);


let gradeLevelDetails = [];
const tableTemplate = document.querySelector('[gradeLevel-template]');
const tableST = document.getElementById("tableGL");

async function getGradeLevelDetails() {
  try {
    gradeLevelDetails = gradeLevelSnapshot.docs.map((doc) => {
      const gradeLevel = tableTemplate.content.cloneNode(true).children[0];
      gradeLevel.querySelector("#GLID").innerHTML = doc.data()["name"];
      gradeLevel.querySelector("#GLName").innerHTML = doc.data().sections.length;
      gradeLevel.querySelector("#GLSubjects").innerHTML = doc.data().subjects.length;

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
const addSubject = document.getElementById("add-subject");
const sectionTableTemplate = document.querySelector('[section-template-table]');
const subjectTableTemplate = document.querySelector('[subject-template-table]');
const applyBtn = document.querySelector("#save-changes");
const closeBtn = document.querySelector("#close-popup");

async function displayClassDetails(id) {
  const gradeLevelRef = doc(db, "gradeLevel", id);
  const gradeLevelSnap = await getDoc(gradeLevelRef);

  const tableGT = document.getElementById("tableGR");
  const tableSubject = document.getElementById("tableSubject")
  
  const sections = gradeLevelSnap.data().sections;
  const subjects = gradeLevelSnap.data()["subjects"];
  
  tableGT.innerHTML = "";
  
  document.getElementById("grade-level").innerHTML = gradeLevelSnap.data().name
  // Iterate through all keys in the Sections array
  for (const i of sections) {
    const section = sectionTableTemplate.content.cloneNode(true).children[0];
    section.querySelector("#section-name").value = i.sectionName;
    section.querySelector("#combobox-teacher").value = i.teacher;

    const deleteBtn = section.querySelector("#delete-btn");
    deleteBtn.addEventListener("click", function(){
      deleteBtn.parentNode.closest("tr").remove();
    })

    tableGT.append(section);
  }
  
  for (var subject of subjects) {
    const subjectData = await getDoc(subject);
    const subjectClone = subjectTableTemplate.content.cloneNode(true).children[0];

    subjectClone.querySelector("#combobox-subject").value = subjectData.id;

    const deleteBtn = subjectClone.querySelector("#delete-btn");
    deleteBtn.addEventListener("click", function(){
      deleteBtn.parentNode.closest("tr").remove();
    })

    tableSubject.append(subjectClone);
  }
}

async function classEdit(id) {
  console.log(id);
  const docRef = doc(db, "gradeLevel", id);

  var sectionsArr = [];
  var subjectsArr = [];
  const tbody_teacher = document.getElementById("tableGR");
  const tbody_subjects = document.getElementById("tableSubject");

  for (let row of tbody_teacher.rows) {
    var sectionName = row.querySelector("#section-name").value;
    var teacher = row.querySelector("#combobox-teacher").value;
    
    if(sectionName == '' && teacher == '') continue;
    const section = {
      sectionName: sectionName,
      teacher: teacher
    }
    
    sectionsArr.push(section);
  }

  for (let row of tbody_subjects.rows) {
    var subject = row.querySelector("#combobox-subject").value;
    if (subject == '') continue;
    subjectsArr.push(doc(db, "subjects", subject));
  }

  console.log(subjectsArr)
  
  await updateDoc(docRef, {
    sections: sectionsArr,
    subjects: subjectsArr
  });

  location.href = "#"
  location.reload();
}

teacherSnapshot.docs.map((doc) => {
  const template = document.getElementById("section-template");
  const comboBox = template.content.querySelector("#combobox-teacher");
  const comboBoxTemplate = comboBox.querySelector("#template-teacher");

  const clone = comboBoxTemplate.cloneNode(true);
  clone.value = doc.id;
  clone.innerHTML = doc.data()["firstName"] + " " + doc.data()["lastName"];

  comboBox.appendChild(clone);
})

subjectsSnapshot.docs.map((doc) => {
  const template = document.getElementById("subject-template");
  const comboBox = template.content.querySelector("#combobox-subject");
  const comboBoxTemplate = comboBox.querySelector("#template-subject");

  const clone = comboBoxTemplate.cloneNode(true);
  clone.value = doc.id;
  clone.innerHTML = doc.data()["name"];

  comboBox.appendChild(clone);
})

function addRowSection() {
  const table = document.getElementById("tableGR");
  const grade = sectionTableTemplate.content.cloneNode(true).children[0];
    grade.querySelector("#section-name").value = "";
    grade.querySelector("#combobox-teacher").value = "";

    const deleteBtn = grade.querySelector("#delete-btn");
    deleteBtn.addEventListener("click", function(){
      deleteBtn.parentNode.closest("tr").remove();
    })

    table.append(grade);
}

function addRowSubject() {
  const table = document.getElementById("tableSubject");
  const grade = subjectTableTemplate.content.cloneNode(true).children[0];

    const deleteBtn = grade.querySelector("#delete-btn");
    deleteBtn.addEventListener("click", function(){
      deleteBtn.parentNode.closest("tr").remove();
    })

    table.append(grade);
}

gradeBtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {
      const reqId = btn.getAttribute("data-id");
      console.log("Request ID:", reqId);
      displayClassDetails(reqId);
      applyBtn.addEventListener("click", async (event) => {
        classEdit(reqId);
      })

      closeBtn.addEventListener("click", function(){
        location.href = "#";
        location.reload();
      })

      addSection.addEventListener("click", addRowSection);
      addSubject.addEventListener("click", addRowSubject);

    } catch (e) {
      console.error("Error fetching document:", e);
    }
  })
});


