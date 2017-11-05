/* VARIABLE DECLARATION & VALUE ASSIGNMENT */

// grabs html components.
const quarters = document.getElementsByClassName('quarter');

const stepCounter = document.getElementById('step-counter');
const restartBtn = document.getElementById('restart-btn');
const strictBtn = document.getElementById('strict-btn');

const sounds = document.getElementsByTagName('audio');
sounds['lose'] = sounds[4];
sounds['win'] = sounds[5];

// stores the current sequence and a counter to loop through it
let currSequence = [];
let counter = 0;

// stores the sequence clicked by the player
let userSequence = [];

// prevents button press if the game has not started
let game = false;

// strict mode is decativated by default
let strict = false

// restarts game on startButton press
restartBtn.addEventListener('click', () => {
  game = true;
  stepCounter.innerHTML = "00";
  currSequence = [];
  nextMove(1000);
});

// toggles between strict mode
strictBtn.addEventListener('click', () => {
  strict = !strict;
  strictBtn.classList.toggle('active');
});

// adds logic when a section is pressed.
for (let i=0; i<quarters.length; i++) {
  quarters[i].addEventListener('click', () => {
    if (game) {
      storeValue(i, userSequence);
      updateDisplay(userSequence);
      if (checkValue(i)) {
        playSound(i);
        changeColor(i);
      }
    }
  });
}

/* IMPLEMENTING GAME LOGIC */

// plays the sound associated with that quarter
function playSound(index) {
  sounds[index].play();
}

// highlights clicked quarter and resets to default when sound ends.
function changeColor(index) {
  let baseStyle = window.getComputedStyle(quarters[index]);
  quarters[index].style.boxShadow = "inset 0 0 50px 0px white";
  setTimeout(() => { quarters[index].style = baseStyle }, 500);
}

function storeValue(value, sequence) {
  sequence.push(value);
}

function updateDisplay(sequence) {
  stepCounter.innerHTML = sequence.length.toString().padStart(2, '0');
}

function resetUser(delay) {
  userSequence = [];
  counter = 0;
  setTimeout(autoplaySequence, delay);
}

function resetStrict(delay) {
  currSequence = [];
  nextMove(delay);
}

function checkValue(value) {
  if (value != currSequence[userSequence.length -1]) {
    stepCounter.innerHTML = "!!";
    playSound('lose');
    strict ? resetStrict(4000) : resetUser(4000);
  } else if (checkWin()){
    game = false;
    return true;
  } else if (userSequence.length == currSequence.length) {
    nextMove(1500);
    return true;
  } else {
    return true;
  }
}

function checkWin() {
  if (userSequence.length == 20) {
    stepCounter.innerHTML = "WIN";
    playSound('win');
    return true;
  }
}

function nextMove(delay) {
  storeValue(Math.round(Math.random()*3), currSequence);
  resetUser(delay);
}

function autoplaySequence() {
  updateDisplay(currSequence);
  if (counter > currSequence.length-1) {
    game = true;
    stepCounter.innerHTML = "GO";
  } else {
    game = false;
    playSound(currSequence[counter]);
    changeColor(currSequence[counter]);
    counter++;
    setTimeout(autoplaySequence, 1000);
  }
}
