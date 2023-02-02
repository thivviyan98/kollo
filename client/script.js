import bot from './assets/user.svg';
import  user from './assets/user.svg';

//function for bot thinking dots ..... Logic 1

const form = document.querySelector('form');
const chatContainer =  document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if(element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)

}
 

//function for give a frame to bot typing like humans and not give answer like copy and past

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(index);
    }
  }, 20)
}

//function for display uniq id for every single message
function generateUniqeId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

 return `id-${timestamp}-${hexadecimalString}`;

}


// function for change black and grey stripe between Human and Bot
  function chatStripe (isAi, value, uniqueId) {
    return(
        `
        <div class="wrapper ${isAi && 'ai'}">
         <div class="chat">
         <div class="profile">
         <img 
           src="${isAi ? bot : user}" 
           alt="${isAi ? 'bot' : 'user'}"
         />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
         </div>
        </div>

         `
    )
  }
  

  //function for handle submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    //generate users chat stripe

    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();

    //bot's chatstripe
    const uniqueId = generateUniqeId();
    chatContainer.innerHTML += chatStripe(true, " ",uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    // featch data from server -> bot's response

    const response = await fetch('https://kollo.onrender.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: data.get('prompt')
      })
    })
    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if(response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();

      

      typeText(messageDiv, parsedData);
    }else{
      const err = await response.text();

       messageDiv.innerHTML = 'Something went wrong';

       alert(err);
    }
  }

  form.addEventListener('submit', handleSubmit);
  form.addEventListener('keyup', (e) =>{
    if (e.keyCode === 13){
    handleSubmit(e);
    }
  } )