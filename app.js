const userPhotoSrc = 'https://i.ibb.co/LDz2bCNN/Frame-35.png'; // Replace with the path to the uploaded player photo
const generatedAvatarSrc = 'https://i.ibb.co/v5zDJJK/Frame-36.png'; // Replace with the path to the generated avatar

const chatLog = document.getElementById('chat-log');
const inputField = document.getElementById('chat-input-field');
const scannerPanel = document.getElementById('scanner-panel');
const scannerImage = document.getElementById('scanner-image');
const scannerOverlay = document.getElementById('scanner-overlay');
const progressValue = document.getElementById('progress-value');
const progressBarFill = document.getElementById('progress-bar-fill');

let typingIndicator = null;
let scanning = false;

showWelcomeMessage();

inputField.addEventListener('click', () => {
  if (inputField.dataset.sent === 'true' || scanning) {
    return;
  }

  removeTypingIndicator();
  inputField.dataset.sent = 'true';
  inputField.classList.add('locked');
  inputField.blur();
  inputField.placeholder = 'Hang tight, generating avatar...';

  const userPrompt = 'create avatar for fortnite';
  appendMessage('user', userPrompt);
  setTimeout(() => {
    appendMessage('user', '', userPhotoSrc);
    startScanning(userPhotoSrc);
  }, 500);
});

function appendMessage(author, text, imageSrc) {
  const message = document.createElement('div');
  message.classList.add('message', author);

  if (text) {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    message.appendChild(paragraph);
  }

  if (imageSrc) {
    message.classList.add('has-image');
    if (!text) {
      message.classList.add('image-only');
    }
    const image = document.createElement('img');
    image.src = imageSrc;
    image.alt = author === 'user' ? 'Player photo' : 'Generated avatar';
    message.appendChild(image);
  }

  const timeStamp = document.createElement('span');
  timeStamp.className = 'timestamp';
  timeStamp.textContent = currentTime();
  message.appendChild(timeStamp);

  chatLog.appendChild(message);
  scrollChatToBottom();
}

function appendTypingIndicator() {
  if (typingIndicator) {
    return;
  }

  typingIndicator = document.createElement('div');
  typingIndicator.classList.add('message', 'bot');

  const dots = document.createElement('div');
  dots.className = 'typing';
  dots.innerHTML = '<span></span><span></span><span></span>';
  typingIndicator.appendChild(dots);

  chatLog.appendChild(typingIndicator);
  scrollChatToBottom();
}

function removeTypingIndicator() {
  if (!typingIndicator) {
    return;
  }

  typingIndicator.remove();
  typingIndicator = null;
}

function showWelcomeMessage() {
  appendTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    appendMessage(
      'bot',
      'Hi! Send your photo and describe the parameters so I can craft your avatar.'
    );
  }, 600);
}

function startScanning(photoSrc) {
  scanning = true;
  scannerImage.src = photoSrc;
  scannerPanel.classList.remove('hidden');

  scannerOverlay.classList.remove('scanning');
  // Force reflow so animation can restart every time
  void scannerOverlay.offsetWidth;
  scannerOverlay.classList.add('scanning');

  progressBarFill.style.width = '0%';
  progressValue.textContent = '0%';

  const duration = 3200;
  const updateInterval = 80;
  let elapsed = 0;

  const intervalId = setInterval(() => {
    elapsed += updateInterval;
    const progress = Math.min(100, Math.round((elapsed / duration) * 100));
    progressBarFill.style.width = progress + '%';
    progressValue.textContent = progress + '%';

    if (progress >= 100) {
      clearInterval(intervalId);
    }
  }, updateInterval);

  setTimeout(() => {
    scannerOverlay.classList.remove('scanning');
    scannerPanel.classList.add('hidden');
    scanning = false;
    deliverBotResults();
  }, duration + 200);
}

function deliverBotResults() {
  appendTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    appendMessage(
      'bot',
      'Here is your virtual avatar—add it to your inventory and enjoy the game!',
      generatedAvatarSrc
    );
    inputField.placeholder = 'Avatar ready!';
  }, 900);
}

function currentTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function scrollChatToBottom() {
  chatLog.scrollTop = chatLog.scrollHeight;
}
