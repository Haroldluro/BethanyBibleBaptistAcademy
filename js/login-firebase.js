import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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

async function SignIn() {
  const email = document.getElementById("txtUsername").value;
  const password = document.getElementById("txtPassword").value;
  console.log(email);

  try {
    // Sign in user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const role = userDoc.data().role;
      console.log("User role:", role);
      switch (role) {
        case "superadmin":
          window.location.href = "/superadmin/superadmin-overview.html";
          break;
        case "teacher":
          window.location.href = "/teacher/teacher-dashboard.html";
          break;
        case "student":
          window.location.href = "/landing/index.html";
          break;
        default:
          alert("Invalid role or no role assigned.");
      }
    } else {
      alert("User document does not exist in Firestore.");
    }
  } catch (error) {
    console.error("Error signing in or fetching user data:", error);
    alert("Failed to sign in. Please try again.");
  }
}

document.getElementById("btnSignIn").addEventListener("click", SignIn);




// import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// const db = getFirestore(app);

// async function SignIn() {
//   const email = document.getElementById("txtUsername").value;
//   const password = document.getElementById("txtPassword").value;
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Fetch user role from Firestore
//     const userDoc = await getDoc(doc(db, "users", user.uid));
//     if (userDoc.exists()) {
//       const role = userDoc.data().role;

//       // Redirect based on role
//       switch (role) {
//         case "superadmin":
//           window.location.href = "/superadmin/superadmin-overview.html";
//           break;
//         case "teacher":
//           window.location.href = "/teacher/teacher-overview.html";
//           break;
//         case "student":
//           window.location.href = "/student/student-home.html";
//           break;
//         default:
//           alert("Invalid role or no role assigned.");
//       }
//     } else {
//       alert("User role not found in database.");
//     }
//   } catch (error) {
//     console.error(error.code + ": " + error.message);
//   }
// }

// document.getElementById("btnSignIn").addEventListener("click", SignIn);