const socket = io();
const form = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.querySelector(".chat-box");
var receivedTing = new Audio('receivedTing.mp3');
var sentTing = new Audio('sentTing.mp3');

const append= (message, position)=>{
const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'received'){
        receivedTing.play();    
    }else{
        sentTing.play();
    }
}
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'sent');
    socket.emit('send', message);
    messageInput.value = '';
})

const name = prompt("Enter your Name to join");
socket.emit('new-user-joined', name);

socket.on('user-joined', name=>{
        append(`${name}: joined the chat`,'received')
});

socket.on('receive', data=>{
    append(`${data.name}: ${data.message}`,'received')
});

socket.on('left', name=>{
    append(`${name}: Left the chat`,'received')
});
