// signUp selecttors 
var signUpUserName = document.getElementById("sign-up-username")
var signUpEmail = document.getElementById("sign-up-email")
var signUpPassword = document.getElementById("sign-up-password")
// login selectors 
var loginEmail = document.getElementById("login-email")
var loginPassword = document.getElementById("login-password")

var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

var app = firebase.initializeApp(firebaseConfig);

function signUp() {

    
    try {

        firebase.auth().createUserWithEmailAndPassword(signUpEmail.value, signUpPassword.value)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                localStorage.setItem(signUpEmail.value,`users-${signUpUserName.value}`)
                window.location.href = "./signin.html"
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                
                console.log(errorMessage);

                
            });

    } catch (error) {
        console.log(error);


    }
}



function login(){

    try {
        
        firebase.auth().signInWithEmailAndPassword(loginEmail.value, loginPassword.value)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;

    
        document.cookie = "email="+ user.email + "; path=/; max-age="+(60*60*24)    
        window.location.href = "./todoapp.html"
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    Swal.fire({
        icon: "error",
        title: "Oops! &#128556;",
        text: "username or password is wrong!",
      });    
  });


    } catch (error) {
        console.log(error);
        
        
    }
}

// ----------------------- Todo app work start -----------------------

var input = document.getElementById("inputField");
var container = document.getElementById("reset");

function getCookie(naam){
    var cookieValue = `; ${document.cookie}`
    var parts = cookieValue.split(`; ${naam}=`)
    if(parts.length === 2) {
        return parts.pop().split(";").shift()
    }
    
}

var userCookie = getCookie("email")

var userid = localStorage.getItem(userCookie)

// create todo 
function createTodo(){

    try {
        
       var logs = firebase.database().ref(userid).push(input.value)


    } catch (error) {
        console.log(error);
        
        
    }
  
}


function seeAllData(){

    firebase.database().ref(userid).on('child_added', function(data){
        // return {dataValue :data.val()}
        
        var taskDiv = document.createElement("div")
        taskDiv.dataset.todoId = data.key
        taskDiv.setAttribute("class", "task")
        // p tag create 
        var p = document.createElement("p")
        var text = document.createTextNode(data.val())
        p.appendChild(text)
        taskDiv.appendChild(p)
        container.appendChild(taskDiv)
        var blankDiv = document.createElement("div")
        taskDiv.appendChild(blankDiv)
        var editBtn = document.createElement("button")
        editBtn.setAttribute("class", "btn-edit")
        var iBtn1 = document.createElement("i")
        iBtn1.setAttribute("class", "fa-regular fa-pen-to-square")
        editBtn.setAttribute("onclick", "editTask(this)")
        editBtn.appendChild(iBtn1)
        blankDiv.appendChild(editBtn)

        var dltBtn = document.createElement("button")
        dltBtn.setAttribute("class", "btn-dlt")
        var iBtn2 = document.createElement("i")
        iBtn2.setAttribute("class", "fa-solid fa-trash-can")
        dltBtn.setAttribute("onclick", "deleteTask(this)")
        dltBtn.appendChild(iBtn2)
        blankDiv.appendChild(dltBtn)
        
        
        
    })
}


function add() {


    if (input.value) {

       createTodo()

        input.value = ""
    } else {
        alert("enter task")
    }

}

function deleteAll() {

    firebase.database().ref(`${userid}`).remove().then(function(){
        window.location.reload()
     })
    document.getElementById("reset").innerHTML = ""
}



function editTask(e) {

    var updateTextValue = prompt("enter new text to updated")

    var listId = e.parentNode.parentNode.dataset.todoId
    firebase.database().ref(`${userid}/${listId}`).set(updateTextValue)

    window.location.reload()
 
}

function deleteTask(e) {

    var listId = e.parentNode.parentNode.dataset.todoId
    firebase.database().ref(`${userid}/${listId}`).remove().then(function(){
       window.location.reload()
    })
  
    
}

