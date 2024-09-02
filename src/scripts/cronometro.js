document.addEventListener("DOMContentLoaded", () =>
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      calculateTotalStudyTime();
    } else {
      alert("User not logged in!");
    }
  })
);

const timerEl = document.getElementById("timer");
const saveList = document.getElementById("save-timer");
const subjectSelection = document.getElementById("subject-selection");
const totalTimeList = document.getElementById("total-time-list");

let intervalId = 0;
let timer = 0;
let savedTimes = [];

const formatTime = (time) => {
  const hours = Math.floor(time / 360000);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const hundredths = time % 100;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${hundredths
    .toString()
    .padStart(2, "0")}`;
};

const setTimer = (time) => {
  timerEl.innerText = formatTime(time);
};

const toggleTimer = () => {
  const button = document.getElementById("power");
  const action = button.getAttribute("action");

  clearInterval(intervalId);

  if (action == "start" || action == "continue") {
    intervalId = setInterval(() => {
      timer += 1;
      setTimer(timer);
    }, 10);
    button.setAttribute("action", "pause");
    button.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else if (action == "pause") {
    button.setAttribute("action", "continue");
    button.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
};

const displaySavedTimes = () => {
  alert("Tempo salvo com sucesso!");
  resetTimer();
};

const resetTimer = () => {
  clearInterval(intervalId);
  timer = 0;
  setTimer(timer);
  const button = document.getElementById("power");
  button.setAttribute("action", "start");
  button.innerHTML = '<i class="fa-solid fa-play"></i>';
};

// Function to save the current time
const saveCurrentTime = async () => {
  const subjectElement = document.getElementById("subject-selection");
  if (!subjectElement) {
    alert("Element with id 'subject' not found!");
    return;
  }

  const subject = subjectElement.value.trim();
  if (subject === "Selecionar") {
    alert("Escolha uma materia!");
    return;
  }

  if (timer === 0) {
    alert("O cronômetro está zerado!");
    return;
  }

  const duration = timer;

  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("User not logged in!");
      return;
    }

    const userId = user.uid;
    const subjectRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("study-records")
      .doc();

    await subjectRef.set({
      duration: duration,
      subject: subject,
    });

    savedTimes.push({ subject, time: timer });
    displaySavedTimes();
    document
      .querySelectorAll(".total-time-item")
      .forEach((item) => item.remove());
    calculateTotalStudyTime();
  } catch (error) {
    console.error("Error saving study record:", error);
  }
};

document.getElementById("power").addEventListener("click", toggleTimer);
document.getElementById("save").addEventListener("click", saveCurrentTime);

// Function to fetch the subjects from Firestore
const fetchSubjects = async () => {
  try {
    const snapshot = await firebase
      .firestore()
      .collection("study-subjects")
      .get();
    snapshot.forEach((doc) => {
      const subjectName = doc.id;
      const option = document.createElement("option");
      option.value = subjectName;
      option.textContent = subjectName;
      subjectSelection.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
  }
};

// Call the fetchSubjects function to populate the options
fetchSubjects();

document.getElementById("save").addEventListener("click", saveCurrentTime);

// Function to calculate the total study time for each subject
const calculateTotalStudyTime = async () => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("User not logged in!");
      return;
    }

    const userId = user.uid;
    const studyRecordsRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("study-records");

    const snapshot = await studyRecordsRef.get();
    const totalTimes = {};

    snapshot.forEach((doc) => {
      const { subject, duration } = doc.data();
      if (totalTimes[subject]) {
        totalTimes[subject] += duration;
      } else {
        totalTimes[subject] = duration;
      }
    });

    for (const subject in totalTimes) {
      const listItem = document.createElement("li");
      listItem.textContent = `${subject}: ${formatTime(totalTimes[subject])}`;
      listItem.classList.add("total-time-item");
      totalTimeList.appendChild(listItem);
    }
  } catch (error) {
    console.error("Error calculating total study time:", error);
  }
};
