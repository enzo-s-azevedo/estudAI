const timerEl = document.getElementById('timer');
const saveList = document.getElementById('save-timer');
let intervalId = 0;
let timer = 0;
let savedTimes = [];

const formatTime = (time) => {
    const hours = Math.floor(time / 360000);
    const minutes = Math.floor((time % 360000) / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const hundredths = time % 100;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${hundredths.toString().padStart(2, '0')}`;
}

const setTimer = (time) => {
    timerEl.innerText = formatTime(time);
}

const toggleTimer = () => {
    const button = document.getElementById('power');
    const action = button.getAttribute('action');

    clearInterval(intervalId);

    if (action == 'start' || action == 'continue') {
        intervalId = setInterval(() => {
            timer += 1;
            setTimer(timer);
        }, 10);
        button.setAttribute('action', 'pause');
        button.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else if (action == 'pause') {
        button.setAttribute('action', 'continue');
        button.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
}

const saveCurrentTime = () => {
    savedTimes.push(timer);
    displaySavedTimes();
}

const displaySavedTimes = () => {
    saveList.innerHTML = '';
    savedTimes.forEach((time, index) => {
        saveList.innerHTML += `<p>Salvo ${index + 1}: ${formatTime(time)}</p>`;
    });
}

const resetTimer = () => {
    clearInterval(intervalId);
    timer = 0;
    setTimer(timer);
    const button = document.getElementById('power');
    button.setAttribute('action', 'start');
    button.innerHTML = '<i class="fa-solid fa-play"></i>';
}

document.getElementById('power').addEventListener('click', toggleTimer);
document.getElementById('save').addEventListener('click', saveCurrentTime);
document.getElementById('reset').addEventListener('click', resetTimer);
