function addCommentToScreen(data,container){
    let commentFragment = document.createElement('template');
    commentFragment.innerHTML = 
        `<div class = "comment">
            <strong class = "comment author">${data.username}<strong>
            <span class = "comment-date">${(new Date()).toLocaleString("en-us",{
                dateStyle: "long",
                timeStyle: "medium"
            })}</span>
                <div class = "comment-text">${data.text}</div>
        </div>`;

    container.append(commentFragment.content.firstChild);

}


const likeButton = document.getElementById('likeButton');
const commentButton = document.getElementById('commentButton');

if(commentButton){
    commentButton.addEventListener('click', async function(ev){
        
        try{
            const text = document.getElementById('commentText');
            console.log("TEST:" + text.value);
            if(!text.value){ return } 

            const postId = commentButton.dataset.postid;
            
            var resp = await fetch('/comments/create',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: text.value,
                    postId: postId
                })
            });

            const commentsBox = document.getElementById('comments')
            var data = await resp.json();
            console.log('Received data:', data);
            if(data.status == "success"){
                addCommentToScreen(data,commentsBox);
                text.value = "";

            }
        }catch(err){
            console.error(err);
        }
        
        

        
    });
}

if(likeButton){
    likeButton.addEventListener('click', async function(ev){
        console.log(ev);
    });
}