let form = document.querySelector("#cform");
let submit = document.querySelector(".contact__button");
submit.disabled=true;

let vname = document.querySelector("#vname");
let lname = document.querySelector("#lname");
let vmail = document.querySelector("#vmail");
let password=document.querySelector("#password");
let error = document.querySelector("#errorbox");
let error1 = document.querySelector("#errorbox1");
let error2 = document.querySelector("#errorbox2");
let error3=document.querySelector("#errorbox3");
let resultbox = document.querySelector("#resultbox");
let check = [0, 0, 0,0];
const textnode = document.createTextNode("Water");
const node = document.createElement("LI");
const regname = /^[a-zA-Z][a-zA-Z\s]*$/;
let regmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let regpass=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

let nameListner = vname.addEventListener("input", () => {
  if (vname.value.match(regname) != vname.value) {
    
    error.textContent = "Please enter a valid name";
    check[0] = 0;
    checkValid()
  } else {
    error.textContent = "";
    check[0] = 1;
    checkValid();
  }
});
let lnameListner = lname.addEventListener("input", () => {
    if (lname.value.match(regname) != lname.value) {
      
      error1.textContent = "Please enter a valid name";
      check[1] = 0;
      checkValid()
    } else {
      error1.textContent = "";
      check[1] = 1;
      checkValid();
    }
  });
// let lnameListner = lname.addEventListener("input", () => {
//   if (lname.value.match(regname) != lname.value) {
//     error1.textContent = lname.value;
//     check[1] = 0;
//     checkValid()
//   } else {
//     error.textContent = "";
//     check[1] = 1;
//     lname.value = lname.value.match(regname);
//     checkValid();
//   }
// });

let emailListner = vmail.addEventListener("input", () => {
  if (vmail.value.match(regmail) != vmail.value) {
    error2.textContent = "Enter a proper mail";
    check[2] = 0;
    checkValid()
  } else {
    error2.textContent = "";
    check[2] = 1;
    checkValid()
  }
});
let passwordListner = password.addEventListener("input", () => {
    if (password.value.match(regpass) != password.value) {
      error3.textContent = "Password must contain minimum eight characters and at least one letter and a number.";
      check[3] = 0;
      checkValid()
    } else {
      error3.textContent = "";
      check[3] = 1;
      password.value = password.value.match(regpass);
      checkValid();
    }
  });
function isOne(element) {
  return element === 1;
}
function checkValid() 
{if(check.every(isOne)){
    submit.disabled = false;
   
}
else{
    submit.disabled = true;
}
}
