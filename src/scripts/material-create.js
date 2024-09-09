// Função para criar um novo material no Firebase com ID específico
const createMaterial = async (id, title, description, subject, author) => {
  try {
    await firebase.firestore().collection("study-materials").doc(id).set({
      title,
      description,
      subject,
      author,
    });

    alert("Material criado com sucesso!");
    document.getElementById("createMaterial-form").reset();
  } catch (error) {
    console.error("Erro ao adicionar material: ", error);
    alert("Erro ao criar o material. Tente novamente.");
  }
};

// Adiciona evento ao formulário de criação de material
document
  .getElementById("createMaterial-form")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("id").value.trim();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const author = document.getElementById("author").value.trim();

    if (id && title && description && subject && author) {
      createMaterial(id, title, description, subject, author);
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  });
