import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";

// Firebase Authentication imports
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Firestore imports
import {
  getFirestore,
  updateDoc,
  doc,
  orderBy,
  limit,
  setDoc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


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
const tableTemplate = document.querySelector('[student-template]');
const tableER = document.getElementById("tableER");
let student = [];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const collectionRef = collection(db, "enrollmentsDetails");
const querySnapshot = await getDocs(query(collectionRef, where("status", "==", "Pending")));
let studentDetails = [];

async function displayTableDetails() {
  try {
    studentDetails = querySnapshot.docs.map((doc) => {
      const student = tableTemplate.content.cloneNode(true).children[0];
      student.querySelector("#ERID").innerHTML = doc.data()["LRN"];
      student.querySelector("#ERLastName").innerHTML = doc.data()["lastName"];
      student.querySelector("#ERFirstName").innerHTML = doc.data()["firstName"];
      student.querySelector("#ERGrade").innerHTML = doc.data()["gradeLevel"];
      student.querySelector("#ERView").setAttribute("data-id", doc.data()["LRN"]);
      student.querySelector("#ERDelete").setAttribute("data-id", doc.data()["LRN"]);
      student.classList.remove("hidden");
      tableER.append(student);
      return { LRN: doc.data()["LRN"] || "", lastName: doc.data()["lastName"] || "", firstName: doc.data()["firstName"] || "", gradeLevel: doc.data()["gradeLevel"] || "", element: student };
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

displayTableDetails();

document.querySelector('.filter-btn').addEventListener('click', (e) => {
  e.preventDefault();
  const dropdownMenu = document.querySelector('.dropdown-menu');
  dropdownMenu.classList.toggle('show'); // Toggle visibility of the menu
});

// Function to handle sorting and filtering
function applyFilter(filterType) {
  console.log("Applying filter:", filterType); // For debugging purposes

  const rows = Array.from(document.querySelectorAll("#tableER .tablerow"));

  if (filterType === 'ascName') {
    rows.sort((a, b) => {
      const nameA = a.querySelector("#ERLastName").textContent + a.querySelector("#ERFirstName").textContent;
      const nameB = b.querySelector("#ERLastName").textContent + b.querySelector("#ERFirstName").textContent;
      return nameA.localeCompare(nameB); // Sort ascending by name
    });
  } else if (filterType === 'descName') {
    rows.sort((a, b) => {
      const nameA = a.querySelector("#ERLastName").textContent + a.querySelector("#ERFirstName").textContent;
      const nameB = b.querySelector("#ERLastName").textContent + b.querySelector("#ERFirstName").textContent;
      return nameB.localeCompare(nameA); // Sort descending by name
    });
  } else if (filterType === 'gradeLevel') {
    const gradeLevels = {
      'Nursery': 0,
      'Kinder1': 1,
      'Kinder2': 2,
      'Grade1': 3,
      'Grade2': 4,
      'Grade3': 5,
      'Grade4': 6,
      'Grade5': 7,
      'Grade6': 8
    };

    rows.sort((a, b) => {
      const gradeA = a.querySelector("#ERGrade").textContent.trim();
      const gradeB = b.querySelector("#ERGrade").textContent.trim();
      return gradeLevels[gradeA] - gradeLevels[gradeB];
    });
  }
  // Append the sorted rows back into the table
  const tbody = document.querySelector("#tableER");
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






const searchBtn = document.getElementById("searchbtn");
const searchInput = document.getElementById("searchinput");

// searchInput.addEventListener("input", async (event) => {
//   const searchTerm = event.target.value.toLowerCase();
//   console.log(studentDetails);
//   studentDetails.forEach((student) => {
//     const isMatch = student.LRN.includes(searchTerm) || student.lastName.toLowerCase().includes(searchTerm) || student.firstName.toLowerCase().includes(searchTerm);
//     student.element.classList.toggle("hidden", !isMatch);
//   })
// });

let debounceTimeout;

searchInput.addEventListener("input", (event) => {
  clearTimeout(debounceTimeout); // Clear the previous timeout
  const searchTerm = event.target.value.toLowerCase();

  debounceTimeout = setTimeout(async () => {
    try {
      // Clear the existing table rows
      tableER.innerHTML = ""; // Clear all rows before appending new ones

      if (searchTerm.trim() === "") {
        // If the search term is empty, reload all students
        await displayTableDetails();
        return;
      }

      // Query Firestore for students whose LRN, lastName, or firstName matches the search term
      const matchingStudents = [];
      const querySnapshot = await getDocs(collectionRef);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const lrn = data["LRN"] || "";
        const lastName = data["lastName"] || "";
        const firstName = data["firstName"] || "";
        const status = data["status"] || ""; // Fetch the status field

        // Check if the search term matches any of the student details and if the status is "Pending"
        if (
          (lrn.toLowerCase().includes(searchTerm) ||
            lastName.toLowerCase().includes(searchTerm) ||
            firstName.toLowerCase().includes(searchTerm)) &&
          status === "Pending"
        ) {
          matchingStudents.push(doc);
        }
      });

      // Add only the matching students to the table
      matchingStudents.forEach((doc) => {
        const student = tableTemplate.content.cloneNode(true).children[0];
        student.querySelector("#ERID").innerHTML = doc.data()["LRN"];
        student.querySelector("#ERLastName").innerHTML = doc.data()["lastName"];
        student.querySelector("#ERFirstName").innerHTML = doc.data()["firstName"];
        student.querySelector("#ERGrade").innerHTML = doc.data()["gradeLevel"];
        student.querySelector("#ERView").setAttribute("data-id", doc.data()["LRN"]);
        student.querySelector("#ERDelete").setAttribute("data-id", doc.data()["LRN"]);
        student.classList.remove("hidden");
        tableER.append(student);
      });
    } catch (e) {
      console.error("Error searching Firebase:", e);
    }
  }, 200); // Delay of 300ms before executing the search
});







const accptBtn = document.getElementById("acceptbtn");
const modalDeleteBtn = document.getElementById("modalDeleteBtn");
const delbtn = document.querySelectorAll("#ERDelete");
const rejBtn = document.getElementById("rejectbtn");
const viewBtn = document.querySelectorAll("#ERView");

viewBtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {

      const reqId = btn.getAttribute("data-id");
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
        houseNumInp.value = data.address.houseNumber || "";
        cityInp.value = data.address.city || "";
        provinceInp.value = data.address.province || "";
        fathNameInp.value = data.father.name || "";
        fathOccInp.value = data.father.occupation || "";
        fathMobNumInp.value = data.father.mobileNumber || "";
        fathEmailInp.value = data.father.email || "";
        mothNameInp.value = data.mother.name || "";
        mothOccInp.value = data.mother.occupation || "";
        mothMobNumInp.value = data.mother.mobileNumber || "";
        mothEmailInp.value = data.mother.email || "";
        guarNameInp.value = data.guardian.name || "";
        guarRelatsionshipInp.value = data.guardian.relationship || "";
        guarMobNumInp.value = data.guardian.mobileNumber || "";
        guarEmailInp.value = data.guardian.email || "";
        lastSchoolInp.value = data.lastSchool || "";
        grade.value = data.gradeLevel || "";
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.error("Error fetching document:", e);
    }
  });
});

delbtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {

      const reqIdElement = btn.getAttribute("data-id");

      const reqId = reqIdElement.textContent.trim();
      console.log("Request ID:", reqId);

      // Fetch document from Firestore
      const docRef = doc(db, "enrollmentsDetails", reqId);
      console.log(docRef)
      modalDeleteBtn.addEventListener("click", async (event) => {
        updateDoc(docRef, {
          status: "Rejected"
        })
      });
    } catch (e) {
      console.error("Error fetching document:", e);
    }
  })
})

rejBtn.addEventListener("click", async (event) => {
  try {

    const lrnValue = LRNInp.value;

    // Fetch document from Firestore
    const docRef = doc(db, "enrollmentsDetails", lrnValue);

    console.log(docRef)
    updateDoc(docRef, {
      status: "Rejected"
    })
  } catch (e) {
    console.error("Error fetching document:", e);
  }
})

accptBtn.addEventListener("click", async (event) => {
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
      status: "Approved",
      enrollmentDate: serverTimestamp(),
    };
    const docRef = doc(db, "enrollmentsDetails", LRNInp.value);
    await setDoc(docRef, enrollmentData);

    const auth = getAuth();
    const email = `${lNameInp.value.toLowerCase()}${fNameInp.value.toLowerCase()}@bethanybaptist.com`;
    const password = "Student123";
    const lrn = LRNInp.value;
    const role = "student";

    try {
      // Step 1: Create Authentication Account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Firebase Auth UID
      console.log("Account created for:", user.email);



      // Step 4: Create entry in the `users` collection
      const usersRef = doc(db, "users", user.uid); // Use the Firebase Auth UID as document ID
      await setDoc(usersRef, {
        emailAddress: user.email,
        role: role,
        lrn: lrn,
        createdAt: new Date().toISOString(),
        isActive: true, // Optional: Indicates account status
      });
      console.log("User entry added to 'users' collection");

      // Optional: Notify user or admin
      alert(`Account successfully created for ${fNameInp.value} ${lNameInp.value}`);
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account. Please check the details and try again.");
    }

    try {
      const currentYear = new Date().getFullYear();
      const studentRef = collection(db, "students");

      // Step 3: Query to find the most recent student ID for the current year
      const q = query(studentRef, orderBy("studentID", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      let newStudentID = `${currentYear}-0001`; // Default value if no students exist yet
      if (!querySnapshot.empty) {
        // Extract the last student ID
        const lastDoc = querySnapshot.docs[0];
        const lastStudentID = lastDoc.data().studentID;
        const lastIDNumber = parseInt(lastStudentID.split("-")[1]);

        // Increment the ID by 1
        const newIDNumber = (lastIDNumber + 1).toString().padStart(4, "0");
        newStudentID = `${currentYear}-${newIDNumber}`;
      }

      const studentData = {
        studentID: newStudentID,
        firstName: fNameInp.value.trim(),
        lastName: lNameInp.value.trim(),
        gradeLevel: grade.value,
        enrolledOn: serverTimestamp(),
        teacher: "",
      };

      // Use LRN as document ID for students table
      const studentDocRef = doc(db, "students", LRNInp.value);
      await setDoc(studentDocRef, studentData);

      // After creating student data, add an entry to the "grades" collection
      try {
        const gradesData = {};

        // Step 1: Query grade level to get the subjects for the student based on their gradeLevel
        const gradeLevelRef = doc(db, "gradeLevel", grade.value);
        console.log(grade.value);// Get the grade level document (e.g., Grade1, Grade2, etc.)
        const gradeLevelDoc = await getDoc(gradeLevelRef);

        if (gradeLevelDoc.exists()) {
          // Step 2: Get the subjects array from the grade level document
          const subjectsArray = gradeLevelDoc.data().subjects;
          console.log(subjectsArray);

          // Step 3: Convert the array of subject references into a map of subjects
          const subjectsMap = new Map();
          for (const subjectRef of subjectsArray) {
            const subjectDoc = await getDoc(subjectRef); // Get the subject document
            if (subjectDoc.exists()) {
              const subjectName = subjectDoc.data().name;

              // Step 4: Create an empty map for each subject's grades (first, second, third, fourth)
              subjectsMap.set(subjectName, {
                first: "0",
                second: "0",
                third: "0",
                fourth: "0"
              });
            }
          }

          // Step 5: Add the subjectsMap to the gradesData object
          gradesData.Grades = Object.fromEntries(subjectsMap);

          // Step 6: Create the grades entry in the "grades" collection with newStudentID as the document ID
          const gradesDocRef = doc(db, "grades", newStudentID); // Use newStudentID as document ID
          await setDoc(gradesDocRef, gradesData);
          console.log("Grades entry added to the 'grades' collection");

          alert("Student accepted, account created, and grades data initialized!");
        } else {
          alert("Grade level data not found. Please check the grade level.");
        }
      } catch (e) {
        console.error("Error adding grades table: ", e);
        alert("Failed to process grades. Please try again.");
      }




      // const gradesDocRef = doc(db, "grades", newStudentID);

      // // Query the grade level document to get the subjects array
      // const gradeLevelRef = doc(db, "gradeLevel", grade.value);
      // const gradeLevelDoc = await getDoc(gradeLevelRef);

      // if (gradeLevelDoc.exists()) {
      //   const subjectsRefs = gradeLevelDoc.data().subjects; // Array of document references


      //   // Fetch details of each subject
      //   const subjectsData = [];
      //   for (const subjectRef of subjectsRefs) {
      //     const subjectDoc = await getDoc(subjectRef); // Resolve the reference
      //     if (subjectDoc.exists()) {
      //       subjectsData.push({
      //         subjectName: subjectDoc.data().name, // Name of the subject
      //         grades: null, // Placeholder for future grades
      //       });
      //     }
      //   }

      //   // Save the grades document with subjects
      //   const gradesData = {
      //     studentID: newStudentID,
      //     gradeLevel: grade.value,
      //     subjects: subjectsData, // Array of subjects with placeholders for grades
      //     createdAt: serverTimestamp(),
      //   };

      //   await setDoc(gradesDocRef, gradesData);
      //   console.log("Grades document created successfully!");
      // } else {
      //   console.error("Grade level document not found!");
      //   alert("Failed to fetch subjects for the grade level.");
      // }





      alert("Student accepted and account created successfully!");
    } catch (error) {
      console.error("Error creating student data:", error);
      alert("Failed to process the enrollment. Please try again.");
    }



  } catch (e) {
    console.error("Error fetching document:", e);
  }
});
//try lang to harold hehe



// Event listener for modalDeleteBtn
modalDeleteBtn.addEventListener("click", async (event) => {
  try {
    // Retrieve the ID of the row/document to be deleted
    const parentRow = document.querySelector(".highlighted-row"); // Assuming you add a specific class when a row is selected
    if (!parentRow) {
      console.error("No row selected for deletion.");
      return;
    }
    const reqIdElement = parentRow.querySelector("#ERID");

    if (!reqIdElement) {
      console.error("Request ID not found in the selected row.");
      return;
    }

    const reqId = reqIdElement.textContent.trim();
    console.log("Request ID to delete:", reqId);

    // Reference to the Firestore document
    const docRef = doc(db, "enrollmentsDetails", reqId);

    // Archive the document
    await updateDoc(docRef, {
      status: "Rejected",
    });

    // Optionally remove the row from the table
    parentRow.remove();
    console.log(`Document with ID ${reqId} successfully archived.`);
  } catch (e) {
    console.error("Error archiving document:", e);
  }
});

// Optional: Highlight the row when the delete button is clicked
delbtn.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    // Clear previous highlights
    document.querySelectorAll(".highlighted-row").forEach((row) => {
      row.classList.remove("highlighted-row");
    });

    // Highlight the current row
    const parentRow = event.target.closest("tr");
    if (parentRow) {
      parentRow.classList.add("highlighted-row");

    }
  });
});



