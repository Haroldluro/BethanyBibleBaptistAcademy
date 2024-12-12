import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, getDocs, getDoc, collection, getCountFromServer, doc, setDoc, query, orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

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
const itemsRef = collection(db, "items");
const categoriesRef = collection(db, "itemCategories");
const categoriesSnap = await getDocs(categoriesRef);
const itemTemplate = document.querySelector('[item-template]');
const itemTable = document.getElementById("tableItem");
const queryitems = query(itemsRef, orderBy("category"));
const itemsSnapshot = await getDocs(queryitems);

async function displayItems() {
  try {
    itemsSnapshot.forEach((doc) => {
      const clone = itemTemplate.content.cloneNode(true).children[0];
    
      clone.querySelector("#itemName").innerHTML = doc.data()["name"];
      clone.querySelector("#itemCategory").innerHTML = doc.data()["category"];
      clone.querySelector("#itemQuantity").innerHTML = doc.data()["quantity"];
      clone.querySelector("#itemPrice").innerHTML = doc.data()["price"];
      clone.querySelector("#itemStatus").innerHTML = doc.data()["status"];
    
      clone.querySelector("#editbtn").setAttribute("data-id", doc.id);
      clone.querySelector("#deletebtn").setAttribute("data-id", doc.id);
    
      itemTable.append(clone);
    });
  }catch (error) {
    
  }
}

displayItems();

const comboboxCategory = document.getElementById("item-category");
const comboboxSubCategory = document.getElementById("item-sub-category");
const comboboxCategoryEdit = document.getElementById("item-category-edit");
const comboboxSubCategoryEdit = document.getElementById("item-sub-category-edit");
const categoryTemplate = document.querySelector('[category-template]');
const subCategoryTemplate = document.querySelector('[sub-category-template-edit]');
const categoryTemplateEdit = document.querySelector('[category-template-edit]');
const subCategoryTemplateEdit = document.querySelector('[sub-category-template]');
const cancelBtn = document.getElementById("cancel-button");
const editBtn = document.querySelectorAll("#editbtn");
const deleteBtn = document.querySelectorAll("#deletebtn");
const addItemForm = document.getElementById("add-item-form");
const editItemForm = document.getElementById("edit-item-form");
const cancelEditBtn = document.getElementById("cancel-edit-button");
const editItemBtn = document.getElementById("edit-item-button");

// Category setters
categoriesSnap.docs.map((doc) => {
  const clone = categoryTemplate.content.cloneNode(true).children[0];

  clone.innerHTML = doc.data()["name"];
  clone.value = doc.id;

  const cloneEdit = clone.cloneNode(true);
  comboboxCategory.appendChild(clone);
  comboboxCategoryEdit.appendChild(cloneEdit);
})

comboboxSubCategory.append(subCategoryTemplate.content.cloneNode(true).children[0]);
comboboxSubCategoryEdit.append(subCategoryTemplate.content.cloneNode(true).children[0]);
comboboxCategory.onchange = async (event) => {
  if (event.target.selectedIndex == 0) return;
  const category = event.target.value;

  const docRef = doc(db, "itemCategories", category);
  const docSnap = await getDoc(docRef);
  const categories = docSnap.data()["categories"];

  comboboxSubCategory.innerHTML = "";
  comboboxSubCategory.append(subCategoryTemplate.content.cloneNode(true));

  for (const category of categories) {
    const clone = subCategoryTemplate.content.cloneNode(true).children[0];

    clone.innerHTML = category;
    clone.value = category.replace(/\s/g, '').toLowerCase();

    comboboxSubCategory.append(clone);
  }
}

cancelBtn.addEventListener("click", function () {
  
})

cancelEditBtn.addEventListener("click", function() {
  comboboxCategoryEdit.selectedIndex = 0;
  comboboxSubCategoryEdit.innerHTML = "";
  comboboxSubCategoryEdit.append(subCategoryTemplateEdit.content.cloneNode(true));
})

addItemForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const category = comboboxCategory.options[comboboxCategory.selectedIndex].innerHTML + " " + comboboxSubCategory.options[comboboxSubCategory.selectedIndex].innerHTML;
  const item = document.getElementById("item-name").value;
  const quantity = Number(document.getElementById("item-quantity").value);
  const price = Number(document.getElementById("item-price").value);
  const status = document.getElementById("item-status").value;
  const itemName = comboboxCategory.value + "_" + comboboxSubCategory.value + "_" + item.replace(/\s/g, '_').toLowerCase();

  await setDoc(doc(db, "items", itemName), {
    subcategory: comboboxSubCategory.value,
    category_main: comboboxCategory.value,
    category: category,
    name: item,
    price: price,
    quantity: quantity,
    status: status,
  });

  location.href = "#";
  location.reload();
})

async function displayItemDetailsEdit(id) {
  const editItemRef = doc(db, "items", id);
  const editItemSnap = await getDoc(editItemRef);

  const modal = document.getElementById("edititem");

  modal.querySelector("#item-category-edit").value = editItemSnap.data()["category_main"];

  const subcategoryRef = doc(db, "itemCategories", editItemSnap.data()["category_main"]);
  const subcategorySnap = await getDoc(subcategoryRef);
  const categories = subcategorySnap.data()["categories"];

  comboboxSubCategoryEdit.innerHTML = "";
  comboboxSubCategoryEdit.append(subCategoryTemplate.content.cloneNode(true));

  for (const category of categories) {
    const clone = subCategoryTemplateEdit.content.cloneNode(true).children[0];

    clone.innerHTML = category;
    clone.value = category.replace(/\s/g, '').toLowerCase();

    comboboxSubCategoryEdit.append(clone);
  }

  comboboxSubCategoryEdit.value = editItemSnap.data()["subcategory"];
  modal.querySelector("#item-name-edit").value = editItemSnap.data()["name"];
  modal.querySelector("#item-quantity-edit").value = editItemSnap.data()["quantity"]
  modal.querySelector("#item-price-edit").value = editItemSnap.data()["price"]
  modal.querySelector("#item-status-edit").value = editItemSnap.data()["status"]
}

comboboxCategoryEdit.onchange = async (event) => {
  if (event.target.selectedIndex == 0) return;
  const category = event.target.value;

  const docRef = doc(db, "itemCategories", category);
  const docSnap = await getDoc(docRef);
  const categories = docSnap.data()["categories"];

  comboboxSubCategoryEdit.innerHTML = "";
  comboboxSubCategoryEdit.append(subCategoryTemplate.content.cloneNode(true));

  for (const category of categories) {
    const clone = subCategoryTemplateEdit.content.cloneNode(true).children[0];

    clone.innerHTML = category;
    clone.value = category.replace(/\s/g, '').toLowerCase();

    comboboxSubCategoryEdit.append(clone);
  }
}

editItemForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const category = comboboxCategoryEdit.options[comboboxCategoryEdit.selectedIndex].innerHTML + " " + comboboxSubCategoryEdit.options[comboboxSubCategoryEdit.selectedIndex].innerHTML;
  const item = document.getElementById("item-name-edit").value;
  const quantity = Number(document.getElementById("item-quantity-edit").value);
  const price = Number(document.getElementById("item-price-edit").value);
  const status = document.getElementById("item-status-edit").value;
  const itemName = comboboxCategoryEdit.value + "_" + comboboxSubCategoryEdit.value + "_" + item.replace(/\s/g, '_').toLowerCase();

  await setDoc(doc(db, "items", itemName), {
    subcategory: comboboxSubCategoryEdit.value,
    category_main: comboboxCategoryEdit.value,
    category: category,
    name: item,
    price: price,
    quantity: quantity,
    status: status,
  });

  location.href = "#";
  location.reload();
})

editBtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {
      const reqId = btn.getAttribute("data-id");
      console.log("Request ID:", reqId);
      displayItemDetailsEdit(reqId);

    } catch (e) {
      console.error("Error fetching document:", e);
    }
  })
});

async function displayItemDetailsDelete(id) {
  const docRef = doc(db, "items", id);
  const docSnap = await getDoc(docRef);
  document.getElementById("delete-item-name").innerHTML = docSnap.data()["name"];
}

deleteBtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    try {
      const reqId = btn.getAttribute("data-id");
      console.log("Request ID:", reqId);
      displayItemDetailsDelete(reqId);

      const deleteBtn = document.getElementById("delete-item-button");
      deleteBtn.addEventListener("click", async (event) => {
        await deleteDoc(doc(db, "items", reqId));
        location.href = "#";
        location.reload();
      })

    } catch (e) {
      console.error("Error fetching document:", e);
    }
  })
});

const searchInput = document.getElementById("searchinput");
let debounceTimeout;

searchInput.addEventListener("input", (event) => {
  clearTimeout(debounceTimeout); // Clear the previous timeout
  const searchTerm = event.target.value.toLowerCase();

  debounceTimeout = setTimeout(async () => {
    try {
      // Clear the existing table rows
      itemTable.innerHTML = ""; // Clear all rows before appending new ones

      if (searchTerm.trim() === "") {
        // If the search term is empty, reload all students
        await displayItems();
        return;
      }

      // Query Firestore for students whose LRN, lastName, or firstName matches the search term
      const matchingStudents = [];
      const querySnapshot = await getDocs(itemsRef);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const name = data["name"] || "";
        const category = data["category"] || "";
        

        // Check if the search term matches any of the student details and if the status is "Pending"
        if (name.toLowerCase().includes(searchTerm) || category.toLowerCase().includes(searchTerm)) {
          matchingStudents.push(doc);
        }
      });

      // Add only the matching students to the table
      matchingStudents.forEach((doc) => {
        const clone = itemTemplate.content.cloneNode(true).children[0];
        clone.querySelector("#itemName").innerHTML = doc.data()["name"];
        clone.querySelector("#itemCategory").innerHTML = doc.data()["category"];
        clone.querySelector("#itemQuantity").innerHTML = doc.data()["quantity"];
        clone.querySelector("#itemPrice").innerHTML = doc.data()["price"];
        clone.querySelector("#itemStatus").innerHTML = doc.data()["status"];
      
        clone.querySelector("#editbtn").setAttribute("data-id", doc.id);
        clone.querySelector("#deletebtn").setAttribute("data-id", doc.id);
      
        itemTable.append(clone);
      });
    } catch (e) {
      console.error("Error searching Firebase:", e);
    }
  }, 200); // Delay of 300ms before executing the search
});