document.addEventListener("DOMContentLoaded", () =>
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      calculateTotalStudyTime();
    } else {
      redirectIfNotAuthenticated("/login");
    }
  })
);

const timerEl = document.getElementById("timer");
const saveList = document.getElementById("save-timer");
const subjectSelection = document.getElementById("subject-selection");
const totalTimeList = document.getElementById("total-time-list");

let intervalId = 0;
let timer = 0;

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

  if (action === "start" || action === "continue") {
    intervalId = setInterval(() => {
      timer += 1;
      setTimer(timer);
    }, 10);
    button.setAttribute("action", "pause");
    button.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else if (action === "pause") {
    button.setAttribute("action", "continue");
    button.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
};

const resetTimer = () => {
  clearInterval(intervalId);
  timer = 0;
  setTimer(timer);
  const button = document.getElementById("power");
  button.setAttribute("action", "start");
  button.innerHTML = '<i class="fa-solid fa-play"></i>';
};

const saveCurrentTime = async () => {
  const subjectElement = document.getElementById("subject-selection");
  const selectedBook = subjectElement.value.trim();
  if (selectedBook === "Selecionar") {
    alert("Escolha um livro!");
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
      alert("Usuário não está logado");
      return;
    }

    const userId = user.uid;
    const studyRecordRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("study-records")
      .doc();

    await studyRecordRef.set({
      duration: duration,
      bookTitle: selectedBook,
    });

    resetTimer(); // Resetar o cronômetro após salvar
    calculateTotalStudyTime(); // Atualizar o tempo total
  } catch (error) {
    console.error("Erro ao salvar tempo de estudo", error);
  }
};

document.getElementById("power").addEventListener("click", toggleTimer);
document.getElementById("save").addEventListener("click", saveCurrentTime);

// Função para buscar os livros da coleção 'study-materials'
const fetchSubjects = async () => {
  try {
    const snapshot = await firebase
      .firestore()
      .collection("study-materials")
      .get();
    snapshot.forEach((doc) => {
      const bookTitle = doc.data().title;
      const option = document.createElement("option");
      option.value = bookTitle;
      option.textContent = bookTitle;
      subjectSelection.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao buscar materiais:", error);
  }
};

fetchSubjects();

const calculateTotalStudyTime = async () => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("Usuário não está logado!");
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
      const { bookTitle, duration } = doc.data();
      if (totalTimes[bookTitle]) {
        totalTimes[bookTitle] += duration;
      } else {
        totalTimes[bookTitle] = duration;
      }
    });

    totalTimeList.innerHTML = ""; // Limpar a lista antes de adicionar novos itens

    for (const bookTitle in totalTimes) {
      const listItem = document.createElement("li");
      listItem.textContent = `${bookTitle}: ${formatTime(
        totalTimes[bookTitle]
      )}`;
      listItem.classList.add("total-time-item");
      totalTimeList.appendChild(listItem);
    }
  } catch (error) {
    console.error("Erro ao calcular tempo total de estudo", error);
  }
};
