

//Get references to input elements 
const usernameInput = document.getElementById('username');
const usernameValidation = document.getElementById('usernameValidation');

const passwordInput = document.getElementById('password');
const passwordValidation = document.getElementById('passwordValidation');

const confirmPasswordInput = document.getElementById('confirmPassword');
const confirmPasswordValidation = document.getElementById('confirmPasswordValidation')

const emailInput = document.getElementById('email');
const emailValidation = document.getElementById('emailValidation');

//counts alphaneumeric characters in a string
function countLetters(str){
    let count = 0; 
    for(let char of str){
        if ((char >= 'a' && char <= 'z') || 
            (char >= 'A' && char <= 'Z') || 
            (char >= '0' && char <= '9')) {
            count++;
        }
    }
    return count;
}

//returns true if given string starts with a letter
function startWithLetter(str){
    if (str.length === 0) return;
    const firstChar = str[0].toLowerCase();
    return firstChar >= 'a' && firstChar <= 'z';
}

//makes sure username fits criteria 
function validateUsername(username){
    let messages = [];

    if(countLetters(username) < 3){
        messages.push("Username needs to have 3 alphaneumerical characters");
    }

    if(!startWithLetter(username)){
        messages.push("Username must start with a letter");
    }

    return messages;
}

//makes sure password fits criteria
function validatePassword(password){
    let messages = [];
    if(password.length < 8){
        messages.push("Password must be at least 8 characters long");
    }

    //checks if password has a number, an uppercase letter, and a special character
    let hasNumber = false;
    let hasUpperCase = false;
    let hasSpecialChar = false;
    const specialChars = "/*-+!@#$^&~[]";

    for(let i = 0; i < password.length;i++){
        let char = password[i];
        if (char >= '0' && char <= '9'){
            hasNumber = true;
        } else if (char === char.toUpperCase() && char !== char.toLowerCase()){
            hasUpperCase = true;
        } else if (specialChars.includes(char)){
            hasSpecialChar = true;
        }

        if (hasNumber && hasUpperCase && hasSpecialChar) break;
    }

    if(!hasNumber){
        messages.push("Password must contain at least one number");
    }

    if(!hasUpperCase){
        messages.push("Password must contain one uppercase letter");
    }

    if(!hasSpecialChar){
        messages.push("Password must contain one of the following: /*-+!@#$^&~[]")
    }

    return messages;
}

function validateEmail(email) {
    let messages = [];
    

    if (email.trim() === '') {
        messages.push("Email is required");
    }
    

    return messages;
}

//makes sure password and confirmPassword are equal
function checkPasswordMatch(){
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const message = "Passwords must match";

    if (password !== confirmPassword) {
        confirmPasswordValidation.innerHTML = message;
    } else {
        confirmPasswordValidation.innerHTML = '';
    }
}

//adds event listeners to input fields, and adds functions to check if inputs are valid
document.getElementById('username').addEventListener('input', function(e){
    const username = e.target.value;
    console.log("Username: ", username);

    const validationMessages = validateUsername(username);
    usernameValidation.innerHTML = validationMessages.join('<br>'); 
});

document.getElementById('password').addEventListener('input', function(e){
    const password = e.target.value;

    const validationMessages = validatePassword(password);
    passwordValidation.innerHTML = validationMessages.join('<br>');

    checkPasswordMatch();
});

document.getElementById('confirmPassword').addEventListener('input', function(e){
    checkPasswordMatch();
});

document.getElementById('email').addEventListener('input', function(e) {
    const email = e.target.value;
    const validationMessages = validateEmail(email);
    emailValidation.innerHTML = validationMessages.join('<br>'); 
});


//turns on button if no errors
function updateButtonState(){
    const usernameValid = validateUsername(usernameInput.value).length === 0;
    const passwordValid = validatePassword(passwordInput.value).length === 0;
    const passwordsMatch = passwordInput.value === confirmPasswordInput.value;

    const registerButton = document.querySelector('button[type = "submit"]');

    if (usernameValid && passwordValid && passwordsMatch){
        registerButton.removeAttribute('disabled');
    } else {
        registerButton.setAttribute('disabled', 'disabled');
    }
}

usernameInput.addEventListener('input', updateButtonState);
passwordInput.addEventListener('input', updateButtonState);
confirmPasswordInput.addEventListener('input', updateButtonState);


updateButtonState();

