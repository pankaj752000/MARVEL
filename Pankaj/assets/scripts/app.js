// -------------- login  constants ---------
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const loginBtn = document.querySelector(".loginBtn");

//----------- register constants ------------
const regEmail = document.querySelector("#regEmail");
const regPassword = document.querySelector("#regPassword");
const uname = document.querySelector("#name");
const confirmPswd = document.querySelector("#cPassword");
const registerBtn = document.querySelector(".registerBtn");

//----------- contact constants ------------
const contEmail = document.querySelector("#contEmail");
const name = document.querySelector("#name");
const contactBtn = document.querySelector(".contactBtn");

//------------ LogoutButton ---------
const logoutBtn = document.querySelector(".logout");
//----------- send message and  refresh  button ------------
const sendButton = document.querySelector(".send-btn");
const refreshButton = document.querySelector(".refresh-btn");
let currentUser;
//----------- edit user save button -------------
const saveUserBtn = document.querySelector(".saveBtn");
//----------- upload / manage documents constants---------
const addUploadDocBtn = document.querySelector(".uploadDocBtn");
const uploadBtn = document.querySelector(".upload-btn");
const cancelBtn = document.querySelector(".cancel-upload-btn");
const uploadModal = document.querySelector(".upload-modal");
const cancelUploadModal = document.querySelector(".cancel-upload-btn");
const editModal = document.querySelector(".edit-modal");
const cancelDocEditBtn = document.querySelector(".cancel-doc-btn");
const saveEditDocBtn = document.querySelector(".save-doc-btn");
//---------- delete model buttons --------------
const confirmDeleteUser = document.querySelector(".confirm-delete-user");
const cancelDelete = document.querySelector(".cancel-delete");
const deleteUser = document.querySelector(".delete-modal");
const confirmDeleteDocument = document.querySelector(
  ".confirm-delete-document"
);

// ID variables for user and doc
let USER_ID;
let DOC_ID;

// ---------- login validation -----------
function loginValidation() {
  let dot = email.value.indexOf(".");
  let atrate = email.value.indexOf("@");
  if (email.value == "") {
    alert("Please enter Email...");
  } else if (password.value == "") {
    alert("Please enter Password...");
  } else if (dot < 1 || dot - atrate < 2) {
    alert("invalid Email...");
  } else if (email.value != "" && password.value != "") {
    loginUser();
  }
}

// <<<<registering functionalities >>>>>
// -------------- register validation ----------------

function registerValidation() {
  let dot = regEmail.value.indexOf(".");
  let atrate = regEmail.value.indexOf("@");
  if (uname.value == "") {
    alert("Please enter username..");
  } else if (regEmail.value == "") {
    alert("Please enter Email..");
  } else if (regPassword.value == "") {
    alert("Please enter Password..");
  } else if (confirmPswd.value == "") {
    alert("Please enter Confirm password..");
  } else if (dot < 1 || dot - atrate < 2) {
    alert("Invalid Email...");
  } else if (regPassword.value != confirmPswd.value) {
    alert("Password and Confirm password does not match...");
  } else {
    registerUser();
  }
}


// ------ registering user in local storage -----------
let getUsersFromLocalStorage = JSON.parse(localStorage.getItem("usersList"));
let users = getUsersFromLocalStorage ? getUsersFromLocalStorage : [];
function registerUser() {
  let result = users.filter((obj) =>
    JSON.stringify(obj).includes(regEmail.value)
  );
  console.log(result);
  if (result.length == 0) {
    const userObj = {
      id: Number(new Date()),
      uname: uname.value,
      email: regEmail.value,
      password: regPassword.value,
    };
    users.push(userObj);
    localStorage.setItem("usersList", JSON.stringify(users)); //creating local storage here for users list
    location.href = "./register-success.html";
  } else {
    alert("user already exists...");
  }
}


// ---------- login user if registered in local storage -------------
function loginUser() {
  let result = getUsersFromLocalStorage.filter((obj) =>
    JSON.stringify(obj).includes(email.value)
  );
  console.log(result);
  if (result.length !== 0) {
    let curMail = result[0].email;
    let curPassword = result[0].password;
    if (curMail == email.value && curPassword == password.value) {
      currentUser = result[0];
      location.href = "./login-success.html";
    } else {
      alert("invalid Password....");
    }
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  } else {
    alert("User not found / invalid Email !");
  }
}

// ----------- Passing current  user values in DOM ------------
let getCurrentUser = JSON.parse(localStorage.getItem("currentUser"));
const welcome = document.querySelector(".loggedInUser");
const welcomeName = document.querySelector(".myName");
if (welcome) {
  welcome.innerHTML = getCurrentUser.email;
}
if (welcomeName) {
  welcomeName.innerHTML = getCurrentUser.uname;
}

//---------- creating data base for chats---------
let getMsgFromStorage = JSON.parse(localStorage.getItem("chatRoom"));
let allMessages = getMsgFromStorage ? getMsgFromStorage : [];
let message = document.querySelector("#msg");
let chatRoom;
function messaging() {
  if (message.value !== "") {
    const msgObj = {
      id: Number(new Date()),
      sentOn: new Date().toLocaleString(),
      sentBy: getCurrentUser.uname,
      msg: message.value,
    };
    allMessages.push(msgObj);
    localStorage.setItem("chatRoom", JSON.stringify(allMessages));
    location.reload(); // creating local DB for chatList
    message.value = "";
  } else {
    alert("empty chat feild...");
  }
}
//------------ rendering chat / messages to DOM-----------
const chats = document.querySelector(".chats");
if (chats) {
  function renderChatToDOM() {
    allMessages.forEach((element) => {
      const item = document.createElement("p");
      chats.append(item);
      item.innerHTML = `[${element.sentOn}] ${element.sentBy} : ${element.msg}`;
    });
  }
  renderChatToDOM();
}

// ------------rendering  users table list in DOM -------------
const userTable = document.querySelector(".users-container");
if (userTable) {
  getUsersFromLocalStorage.forEach((element) => {
    const item = document.createElement("tr");
    userTable.append(item);
    item.classList.add("user");
    // if it is current user then button will dissabled
    let validUser = false;
    if (getCurrentUser.id == element.id) {
      validUser = true;
      console.log(validUser);
    } // user details in DOM
    item.innerHTML = `<tr>
     <td>${element.uname}</td>
     <td>${element.email}</td>
    <td> <span onClick="editElement(${
      element.id
    })" class="update-user">Edit</span> |
    <span ${
      validUser
        ? "style = 'color:grey; cursor:default;'"
        : "style = 'color:black;'"
    } onClick="removeElement(${
      element.id
    })" class="delete-user">Delete</span></td>
    </tr>`;
  });
}

// ------------- deleting user in list---------
function removeElement(item) {
  if (getCurrentUser.id == item) {
    // you cannot delete current user
    return;
  }
  USER_ID = item;
  deleteUser.classList.remove("hide-upload-modal");
}
function deleteUserFromLDB() {
  if (getCurrentUser.id == USER_ID) {
    // you cannot delete current user
    return;
  }
  for (let i = 0; i < getUsersFromLocalStorage.length; i++) {
    if (getUsersFromLocalStorage[i].id == USER_ID)
      getUsersFromLocalStorage.splice(i, 1);
    //updating user list after deleting User
    localStorage.setItem("usersList", JSON.stringify(getUsersFromLocalStorage));
    location.reload();
  }
}

//----------edit user  name and email in the Local DB userList --------
function editElement(item) {
  window.location = `./edit-user.html?id=${item}`;
}
function editValues() {
  let editName = document.querySelector("#edit-name");
  let editEmail = document.querySelector("#edit-email");
  let url = window.location.href;
  let splitUrl = url.split("=");
  let id = splitUrl[1];
  for (let i = 0; i < getUsersFromLocalStorage.length; i++) {
    if (getUsersFromLocalStorage[i].id == id) {
      editName.value = getUsersFromLocalStorage[i].uname;
      editEmail.value = getUsersFromLocalStorage[i].email;
    }
  }
} // clcik on the save button  to save the new values
function saveEditedUser() {
  let editName = document.querySelector("#edit-name");
  let editEmail = document.querySelector("#edit-email");
  let url = window.location.href;
  let splitUrl = url.split("=");
  let id = splitUrl[1];
  if (editName.value == "") {
    alert("Enter Full Name!");
    return;
  }
  if (editEmail.value == "") {
    alert("Enter Email!");
    return;
  }
  if (editName.value != "" && editEmail.value != "") {
    for (let i = 0; i < getUsersFromLocalStorage.length; i++) {
      if (getUsersFromLocalStorage[i].id == id) {
        getUsersFromLocalStorage[i].uname = editName.value;
        getUsersFromLocalStorage[i].email = editEmail.value;
      }
      if (getCurrentUser.id == id) {
        // if edit user is same then current user will also be Updated
        getCurrentUser.uname = editName.value;
        getCurrentUser.email = editEmail.value;
      }
    }
    localStorage.setItem("currentUser", JSON.stringify(getCurrentUser));
    localStorage.setItem("usersList", JSON.stringify(getUsersFromLocalStorage));
    window.location.href = "./usersList.html";
  }
}

// ----------- Upload and Manager user ---------
let getUploadFromStorage = JSON.parse(localStorage.getItem("uploadsList"));
let allUploads = getUploadFromStorage ? getUploadFromStorage : [];
const fileDescription = document.querySelector(".file-desc");
const file = document.querySelector("#file");
function uploadFile() {
  if (fileDescription.value == "") {
    alert("Enter Label Description!");
    return;
  }
  if (fileDescription.value == "") {
    alert("Attach a file!");
    return;
  }
  if (fileDescription.value != "" && file.value != "") {
    const uploadObj = {
      id: Number(new Date()),
      label: fileDescription.value,
      fileName: file.value.split(/(\\|\/)/g).pop(),
    };
    allUploads.push(uploadObj);
    // creating Local DB for Upload list
    localStorage.setItem("uploadsList", JSON.stringify(allUploads));
    fileDescription.value = "";
    file.value = "";
    uploadModal.classList.add("hide-upload-modal");
    location.reload();
  }
}
//----------- Rendering Documents list in DOM here--------
const uploadTable = document.querySelector(".documents-container");
if (uploadTable) {
  allUploads.forEach((element) => {
    const item = document.createElement("tr");
    uploadTable.append(item);
    item.classList.add("user");
    item.innerHTML = `<tr>
     <td>${element.label}</td>
     <td>${element.fileName}</td>
    <td> 
    <span onClick="editDocument(${element.id})" class="update-user">Edit</span> |
    <span onClick="removeDocument(${element.id})" class="delete-user">Delete</span>
    </td>
    </tr>`;
  });
}

//------------delete document----------------
function removeDocument(item) {
  DOC_ID = item;
  deleteUser.classList.remove("hide-upload-modal");
}
function deleteDocumentFromLDB() {
  for (let i = 0; i < allUploads.length; i++) {
    if (allUploads[i].id == DOC_ID) {
      allUploads.splice(i, 1);
      localStorage.setItem("uploadsList", JSON.stringify(allUploads)); // updating Local DB after deletion
      location.reload();
    }
  }
}

// ----------- Editing Document Label in the Local DB here -------------
function editDocument(item) {
  editModal.classList.remove("hide-upload-modal");
  let editLabel = document.querySelector(".edit-doc-label");
  for (let i = 0; i < allUploads.length; i++) {
    if (allUploads[i].id == item) {
      editLabel.value = allUploads[i].label;
    }
  }
  DOC_ID = item;
}
function editUploadLabel() {
  let editLabel = document.querySelector(".edit-doc-label");
  if (editLabel.value == "") {
    alert("Enter Label Name!");
    return;
  }
  for (let i = 0; i < allUploads.length; i++) {
    if (allUploads[i].id == DOC_ID) {
      allUploads[i].label = editLabel.value;
    }
  }
  localStorage.setItem("uploadsList", JSON.stringify(allUploads)); // updating Local DB after edeting
  location.reload();
}

// -----------Event  Listners / Eevet Handelers-----------
//----- delete button -------
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    if (currentUser == null) {
      location.href = "./login.html";
    }
  });
}

if (loginBtn) {
  loginBtn.addEventListener("click", () => loginValidation());
}
if (registerBtn) {
  registerBtn.addEventListener("click", () => registerValidation());
}

// messages handeler---------
if (sendButton) {
  sendButton.addEventListener("click", () => messaging());
}
if (refreshButton) {
  refreshButton.addEventListener("click", () => {
    location.reload();
  });
}

if (saveUserBtn) {
  saveUserBtn.addEventListener("click", () => saveEditedUser());
}
// add upload handelers---
if (addUploadDocBtn) {
  addUploadDocBtn.addEventListener("click", () => {
    uploadModal.classList.remove("hide-upload-modal");
  });
}
if (cancelUploadModal) {
  cancelUploadModal.addEventListener("click", () => {
    uploadModal.classList.add("hide-upload-modal");
  });
}
if (cancelDocEditBtn) {
  cancelDocEditBtn.addEventListener("click", () => {
    editModal.classList.add("hide-upload-modal");
  });
}
if (uploadBtn) {
  uploadBtn.addEventListener("click", () => uploadFile());
}
if (saveEditDocBtn) {
  saveEditDocBtn.addEventListener("click", () => editUploadLabel());
}

//delete model handelers -----------
if (cancelDelete) {
  cancelDelete.addEventListener("click", () => {
    deleteUser.classList.add("hide-upload-modal");
  });
}
if (confirmDeleteUser) {
  confirmDeleteUser.addEventListener("click", () => deleteUserFromLDB());
}
if (confirmDeleteDocument) {
  confirmDeleteDocument.addEventListener("click", () =>
    deleteDocumentFromLDB()
  );
}
