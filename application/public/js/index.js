function updateThumbnailCount(){
    const count = document.querySelectorAll('.card').length;
    document.getElementById('counter').textContent = `Thumbnails on screen:${count} `; //+ count;
}

function buildCardHTML(data){

    return `<div class = "card">
    <p>${data.title}</p>
    <img src="${data.url}" alt="product image">
</div>`;
}

// var result = fetch("https://jsonplaceholder.typicode.com/albums/2/photos")
//     .then(function(resp){
//         //promise chain
//         return resp.json();
//     })
//     .then(function(photo){
        
        
//         let main_content = document.getElementById('main-content');

//         main_content.innerHTML = ''; //fixed bug that was messing with grid view

//         for(let i =  0; i < photo.length;i++){
//             main_content.innerHTML += buildCardHTML(photo[i]);
//         }
        
//         //sets original thumbnail count
//         updateThumbnailCount();

//         //makes array of all thumbnails on screen
//         let cards = document.querySelectorAll('.card');
        
    

//         //for each that calls a function on each thumbnail, adding a click event listener
//         cards.forEach(function(card) {
//             card.addEventListener('click',function(){
//                 this.classList.add('fade-out');
//                 setTimeout(() =>{ 
//                     //Arrow notation treats this differently so this breaks if function(){} instead 
//                     // has to do with scope of this being different depending on arrow function
//                     this.remove();
//                     updateThumbnailCount();
//                 },500); //remove after 500ms, matches with CSS
//             })

//         })

//     })
//     .catch(function(error){
//         console.log(error)
//     });

//hamburger
document.addEventListener('DOMContentLoaded', (event) => {
    const hamburger = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", mobileMenu);

    function mobileMenu() {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    }

    const navLink = document.querySelectorAll(".nav-link");

    navLink.forEach(n => n.addEventListener("click", closeMenu));

    function closeMenu() {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }
});

function handleFlashMessages() {
    const flashMessage = document.getElementById('flash-message');
    if (flashMessage) {
        setTimeout(() => {
            flashMessage.style.opacity = '0';
            setTimeout(() => {
                flashMessage.remove();
            }, 500);
        }, 5000);
    }
}
document.addEventListener('DOMContentLoaded', handleFlashMessages);