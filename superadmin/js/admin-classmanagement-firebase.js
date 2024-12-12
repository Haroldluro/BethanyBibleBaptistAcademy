import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, updateDoc, getDoc, getDocs, doc, collection, getCountFromServer, DocumentReference, writeBatch } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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

      gradeLevel.querySelector('#editbtn').setAttribute("data-id", doc.id);
      gradeLevel.querySelector('#editstudentsbtn').setAttribute("data-id", doc.id);
      gradeLevel.classList.remove("hidden");
      tableST.append(gradeLevel);
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

getGradeLevelDetails();

// Variables
const editBtn = document.querySelectorAll("#editbtn");
const editStudentsBtn = document.querySelectorAll("#editstudentsbtn");
const addSection = document.getElementById("add-section");
const addSubject = document.getElementById("add-subject");
const sectionTableTemplate = document.querySelector('[section-template-table]');
const subjectTableTemplate = document.querySelector('[subject-template-table]');
const gradeSectionTemplate = document.querySelector('[grade-template-section]');
const studentTableTemplate = document.querySelector('[student-template-table]');
const applyBtn = document.querySelector("#save-changes");
const closeBtn = document.querySelector("#close-popup");
const applyBtnStudent = document.querySelector("#save-changes-students");
const closeBtnStudent = document.querySelector("#close-popup-students");

// Display Class Details
async function displayClassDetails(id) {
  const gradeLevelRef = doc(db, "gradeLevel", id);
  const gradeLevelSnap = await getDoc(gradeLevelRef);

  const tableGT = document.getElementById("tableGR");
  const tableSubject = document.getElementById("tableSubject");

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
    deleteBtn.addEventListener("click", function () {
      deleteBtn.parentNode.closest("tr").remove();
    })

    tableGT.append(section);
  }

  // Iterate through all keys in the Subjects array
  subjects.forEach(myFunction);

  async function myFunction(item) {
    const subjectData = await getDoc(item);
    const subjectClone = subjectTableTemplate.content.cloneNode(true).children[0];

    subjectClone.querySelector("#combobox-subject").value = subjectData.id;

    const deleteBtn = subjectClone.querySelector("#delete-btn");
    deleteBtn.addEventListener("click", function () {
      deleteBtn.parentNode.closest("tr").remove();
    })

    tableSubject.append(subjectClone);
  }

  window.location = "#edit";
}

// Display Class Students
async function displayClassStudents(id) {
  const gradeLevelRef = doc(db, "gradeLevel", id);
  const gradeLevelSnap = await getDoc(gradeLevelRef);

  const comboBoxSection = document.getElementById('combobox-section');
  const selectTeacher = document.getElementById("combobox-section");

  const sections = gradeLevelSnap.data().sections;
  const section = gradeSectionTemplate;

  comboBoxSection.innerHTML = "";
  const sectionClone = section.content.cloneNode(true).children[0];
  comboBoxSection.append(sectionClone);

  // Iterate through all keys in the Sections array
  for (const i of sections) {
    const sectionClone = section.content.cloneNode(true).children[0];
    sectionClone.value = i.sectionName;
    sectionClone.innerHTML = i.sectionName;
    sectionClone.setAttribute("teacher-id", i.teacher)

    comboBoxSection.append(sectionClone);
  }

  // on combo box change
  comboBoxSection.onchange = async (event) => {
    if (event.target.selectedIndex == 0) return;
    var section = event.target.value;

    const teacher_id = event.target.options[event.target.selectedIndex].getAttribute("teacher-id");

    const docRef = doc(db, "teacher", teacher_id);
    const docSnap = await getDoc(docRef);

    // Set Teacher
    document.getElementById("teacherName").innerHTML = docSnap.data()["firstName"] + " " + docSnap.data()["lastName"];
    document.getElementById("teacherLabel").classList.remove("hidden");

    // Queries
    const studentsRef = collection(db, "students");
    const queryInSection = query(studentsRef, where("gradeLevel", "==", id), where("section", "==", section), orderBy("lastName"));
    const queryNotInSection = query(studentsRef, where("gradeLevel", "==", id), where("section", "!=", section), orderBy("section"), orderBy("lastName"));

    // Variables
    const studentTable = document.getElementById("tableStudent");

    // Clear Table
    studentTable.innerHTML = "";

    // Query InSection Students
    const inSectionSnapshot = await getDocs(queryInSection);
    inSectionSnapshot.forEach((doc) => {
      const studentClone = studentTableTemplate.content.cloneNode(true).children[0];

      studentClone.querySelector("#checkbox").checked = true;
      studentClone.querySelector("#checkbox").setAttribute("data-id", doc.id);
      studentClone.querySelector("#studentName").innerHTML = doc.data()["firstName"] + " " + doc.data()["lastName"];
      studentClone.querySelector("#studentSection").innerHTML = doc.data()["section"];

      studentTable.append(studentClone);
    });

    // Query NotInSection Students
    const notInSectionSnapshot = await getDocs(queryNotInSection);
    notInSectionSnapshot.forEach((doc) => {
      const studentClone = studentTableTemplate.content.cloneNode(true).children[0];

      if (doc.data()["section"]) {
        studentClone.querySelector("#checkbox").checked = true;
        studentClone.querySelector("#checkbox").disabled = true;
      }
      studentClone.querySelector("#checkbox").setAttribute("data-id", doc.id);
      studentClone.querySelector("#studentName").innerHTML = doc.data()["firstName"] + " " + doc.data()["lastName"];
      studentClone.querySelector("#studentSection").innerHTML = doc.data()["section"];

      studentTable.append(studentClone);
    });
  }
}

// Push Edits for Class
async function classEdit(id) {
  const docRef = doc(db, "gradeLevel", id);

  var sectionsArr = [];
  var subjectsArr = [];
  const tbody_teacher = document.getElementById("tableGR");
  const tbody_subjects = document.getElementById("tableSubject");

  // Gets the updated Teacher Data
  for (let row of tbody_teacher.rows) {
    var sectionName = row.querySelector("#section-name").value;
    var teacher = row.querySelector("#combobox-teacher").value;

    if (sectionName == '' && teacher == '') continue;
    const section = {
      sectionName: sectionName,
      teacher: teacher
    }

    sectionsArr.push(section);
  }

  // Gets the updated Subjects Data
  for (let row of tbody_subjects.rows) {
    var subject = row.querySelector("#combobox-subject").value;
    if (subject == '') continue;
    subjectsArr.push(doc(db, "subjects", subject));
  }

  await updateDoc(docRef, {
    sections: sectionsArr,
    subjects: subjectsArr
  });

  location.href = "#";
  location.reload();
}

// Push Edits for Students
async function studentEdit(id) {
  
  const tbody_subjects = document.getElementById("tableStudent");

  const batch = writeBatch(db);

  // Gets the updated Subjects Data
  for (let row of tbody_subjects.rows) {
    const checkbox = row.querySelector("#checkbox");
    const studentSection = row.querySelector("#studentSection").innerHTML;
    const sectionSelected = document.getElementById("combobox-section").value;

    if (studentSection != sectionSelected && studentSection != "") continue;
    if (checkbox.checked == false && studentSection == "") continue;
    if (checkbox.checked == true && studentSection == sectionSelected) continue;
    
    const data_id = checkbox.getAttribute("data-id");
    const sfRef = doc(db, "students", data_id);
    
    if (checkbox.checked) {
      batch.update(sfRef, { "section": sectionSelected });
    } else {
      batch.update(sfRef, { "section": "" });
    }
  }

  await batch.commit();

  location.href = "#";
  location.reload();
}

// Populate Teacher Dropdown
teacherSnapshot.docs.map((doc) => {
  const template = document.getElementById("section-template");
  const comboBox = template.content.querySelector("#combobox-teacher");
  const comboBoxTemplate = comboBox.querySelector("#template-teacher");

  const clone = comboBoxTemplate.cloneNode(true);
  clone.value = doc.id;
  clone.innerHTML = doc.data()["firstName"] + " " + doc.data()["lastName"];

  comboBox.appendChild(clone);
})

// Populate Subjects Dropdown
subjectsSnapshot.docs.map((doc) => {
  const template = document.getElementById("subject-template");
  const comboBox = template.content.querySelector("#combobox-subject");
  const comboBoxTemplate = comboBox.querySelector("#template-subject");

  const clone = comboBoxTemplate.cloneNode(true);
  clone.value = doc.id;
  clone.innerHTML = doc.data()["name"];

  comboBox.appendChild(clone);
})

// Add Row to Section
function addRowSection() {
  const table = document.getElementById("tableGR");
  const grade = sectionTableTemplate.content.cloneNode(true).children[0];
  grade.querySelector("#section-name").value = "";
  grade.querySelector("#combobox-teacher").value = "";

  const deleteBtn = grade.querySelector("#delete-btn");
  deleteBtn.addEventListener("click", function () {
    deleteBtn.parentNode.closest("tr").remove();
  })

  table.append(grade);
}

// Add Row to Subject
function addRowSubject() {
  const table = document.getElementById("tableSubject");
  const grade = subjectTableTemplate.content.cloneNode(true).children[0];

  const deleteBtn = grade.querySelector("#delete-btn");
  deleteBtn.addEventListener("click", function () {
    deleteBtn.parentNode.closest("tr").remove();
  })

  table.append(grade);
}

// Add Event Listener to Edit Button
editBtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {
      const reqId = btn.getAttribute("data-id");
      console.log("Request ID:", reqId);
      displayClassDetails(reqId);
      applyBtn.addEventListener("click", async (event) => {
        classEdit(reqId);
      })

      closeBtn.addEventListener("click", function () {
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

// Add Event Listener to Students Button
editStudentsBtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {
      const reqId = btn.getAttribute("data-id");
      console.log("Request ID:", reqId);
      displayClassStudents(reqId);
      applyBtnStudent.addEventListener("click", async (event) => {
        studentEdit(reqId);
      })

      closeBtnStudent.addEventListener("click", function () {
        location.href = "#";
        location.reload();
      })

    } catch (e) {
      console.error("Error fetching document:", e);
    }
  })
});