import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, doc, updateDoc, getDoc, getDocs, collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
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

    const { teacherID } = teacherDocSnap.data();

    const teacherDetailsDocRef = doc(db, "teacher", teacherID);
    const teacherDetailsDocSnap = await getDoc(teacherDetailsDocRef);

    if (!teacherDetailsDocSnap.exists()) {
      throw new Error("Additional teacher details not found.");
    }

    const { firstName, lastName, gradeLevelHandled } = teacherDetailsDocSnap.data();
    sectionHandled = teacherDetailsDocSnap.data().sectionHandled; // Set sectionHandled

    // Display the teacher's details
    const teacherName = `${lastName}, ${firstName}`;
    document.querySelector("#gradelevel").textContent = gradeLevelHandled;
    document.querySelector("#section").textContent = sectionHandled;

    console.log("Teacher details displayed successfully.");
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    alert("Failed to load teacher details.");
  }

  try {
    if (!sectionHandled) {
      throw new Error("Section handled is not defined.");
    }

    const q = query(studentCollectionRef, where("section", "==", sectionHandled));
    const studentQuerySnapshot = await getDocs(q);

    studentDetails = await Promise.all(
      studentQuerySnapshot.docs.map(async (studentDoc) => {
        const studentData = studentDoc.data(); // Extract student data from Firestore document
        const studentID = studentData["studentID"];
        const student = tableTemplate.content.cloneNode(true).children[0];

        // Populate student data
        student.querySelector("#STID").innerHTML = studentID;
        student.querySelector("#STFName").innerHTML = `${studentData["lastName"]}, ${studentData["firstName"]}`;
        student.querySelector("#gradesbtn").setAttribute("data-id", studentID);

        // Fetch grades from the grades collection
        const gradesDocRef = doc(db, "grades", studentID); // Ensure `doc` is imported correctly

        const gradesDocSnap = await getDoc(gradesDocRef);

        if (!gradesDocSnap.exists()) {
          console.warn(`No grades found for studentID: ${studentID}`);
          student.querySelector("#firstg").innerHTML = "N/A";
          student.querySelector("#secondg").innerHTML = "N/A";
          student.querySelector("#thirdg").innerHTML = "N/A";
          student.querySelector("#fourthg").innerHTML = "N/A";
        } else {
          const gradesData = gradesDocSnap.data().Grades;


          let firstSum = 0, secondSum = 0, thirdSum = 0, fourthSum = 0;
          let subjectCount = 0;

          for (const subject in gradesData) {
            const subjectGrades = gradesData[subject];
            if (subjectGrades.first) firstSum += parseFloat(subjectGrades.first);
            if (subjectGrades.second) secondSum += parseFloat(subjectGrades.second);
            if (subjectGrades.third) thirdSum += parseFloat(subjectGrades.third);
            if (subjectGrades.fourth) fourthSum += parseFloat(subjectGrades.fourth);
            subjectCount++;
          }

          const firstAvg = subjectCount > 0 ? (firstSum / subjectCount).toFixed(2) : "N/A";
          const secondAvg = subjectCount > 0 ? (secondSum / subjectCount).toFixed(2) : "N/A";
          const thirdAvg = subjectCount > 0 ? (thirdSum / subjectCount).toFixed(2) : "N/A";
          const fourthAvg = subjectCount > 0 ? (fourthSum / subjectCount).toFixed(2) : "N/A";

          student.querySelector("#firstg").innerHTML = firstAvg;
          student.querySelector("#secondg").innerHTML = secondAvg;
          student.querySelector("#thirdg").innerHTML = thirdAvg;
          student.querySelector("#fourthg").innerHTML = fourthAvg;
        }

        student.classList.remove("hidden");
        tableST.append(student);

        return {
          studentID: studentID,
          Name: `${studentData["lastName"]}, ${studentData["firstName"]}`,
          gradeLevel: studentData["gradeLevel"] || "",
          element: student
        };
      })
    );

    console.log("Student details and grades fetched successfully.");
  } catch (error) {
    console.error("Error fetching student details or grades:", error);
    alert("Failed to load student details or grades.");
  }
}


const searchInput = document.getElementById("searchinput");

let debounceTimeout;

searchInput.addEventListener("input", (event) => {
  clearTimeout(debounceTimeout); // Clear the previous timeout
  const searchTerm = event.target.value.toLowerCase();

  debounceTimeout = setTimeout(async () => {
    try {
      // Clear the existing table rows
      tableST.innerHTML = ""; // Clear all rows before appending new ones

      if (searchTerm.trim() === "") {
        // If the search term is empty, reload all students
        await getTeacherDetails(uid);
        return;
      }

      // Query Firestore for students whose LRN, lastName, or firstName matches the search term
      const matchingStudents = [];
      const querySnapshot = await getDocs(studentCollectionRef);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const lrn = data["studentID"] || "";
        const lastName = data["lastName"] || "";
        const firstName = data["firstName"] || ""; // Fetch the status field

        // Check if the search term matches any of the student details and if the status is "Pending"
        if (
          (lrn.toLowerCase().includes(searchTerm) ||
            lastName.toLowerCase().includes(searchTerm) ||
            firstName.toLowerCase().includes(searchTerm)) &&
          section === sectionHandled
        ) {
          matchingStudents.push(doc);
        }
      });

      // Add only the matching students to the table
      matchingStudents.forEach((doc) => {
        const student = tableTemplate.content.cloneNode(true).children[0];
        student.querySelector("#STID").innerHTML = doc.data()["studentID"];
        student.querySelector("#STFName").innerHTML = doc.data()["lastName"] + ", " + doc.data()["firstName"];
        student.querySelector("#gradesbtn").setAttribute("data-id", doc.data()["studentID"]);
        student.classList.remove("hidden");


        tableST.append(student);
      });
    } catch (e) {
      console.error("Error searching Firebase:", e);
    }
  }, 200); // Delay of 300ms before executing the search
});


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
  gradeBtns.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      console.log("Button clicked");
      try {
        const reqId = btn.getAttribute("data-id");
        displayGradeDetails(reqId);
        applyBtn.addEventListener("click", async (event) => {
          gradesEdit(reqId);
          console.log("dumaan");
        });
      } catch (e) {
        console.error("Error fetching document:", e);
      }
    });
  });
}

document.querySelector('.filter-btn').addEventListener('click', (e) => {
  e.preventDefault();
  const dropdownMenu = document.querySelector('.dropdown-menu');
  dropdownMenu.classList.toggle('show'); // Toggle visibility of the menu
});

// Function to handle sorting and filtering
function applyFilter(filterType) {
  console.log("Applying filter:", filterType); // For debugging purposes

  const rows = Array.from(document.querySelectorAll("#tableST .tablerow"));

  if (filterType === 'ascName') {
    rows.sort((a, b) => {
      const nameA = a.querySelector("#STLName").textContent + a.querySelector("#STFName").textContent;
      const nameB = b.querySelector("#STLName").textContent + b.querySelector("#STFName").textContent;
      return nameA.localeCompare(nameB); // Sort ascending by name
    });
  } else if (filterType === 'descName') {
    rows.sort((a, b) => {
      const nameA = a.querySelector("#STLName").textContent + a.querySelector("#STFName").textContent;
      const nameB = b.querySelector("#STLName").textContent + b.querySelector("#STFName").textContent;
      return nameB.localeCompare(nameA); // Sort descending by name
    });
  } else if (filterType === 'ascID') {
    rows.sort((a, b) => {
      const IDA = a.querySelector("#STID").textContent;
      const IDB = b.querySelector("#STID").textContent;
      return IDA.localeCompare(IDB); // Sort ascending by name
    });
  } else if (filterType === 'descID') {
    rows.sort((a, b) => {
      const IDA = a.querySelector("#STID").textContent;
      const IDB = b.querySelector("#STID").textContent;
      return IDB.localeCompare(IDA); // Sort ascending by name
    });
  }
  // Append the sorted rows back into the table
  const tbody = document.querySelector("#tableST");
  rows.forEach(row => tbody.appendChild(row)); // Reorder the rows in the table
}

// Event listeners for filter options
document.querySelectorAll('.dropdown-menu li a').forEach((filter) => {
  filter.addEventListener('click', (e) => {
    e.preventDefault();
    const filterType = filter.getAttribute('data-filter');
    applyFilter(filterType); // Call the applyFilter function

    // Close the dropdown after the filter is applied
    document.querySelector('.dropdown-menu').classList.remove('show');
  });
});