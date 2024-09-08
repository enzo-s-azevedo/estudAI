document.addEventListener("DOMContentLoaded", async function () {
  const materialsTable = document.getElementById("materialsTable").querySelector("tbody");
  const searchForm = document.getElementById("searchMaterials-form");
  const searchInput = document.getElementById("search");

  let materials = [];

  // Buscar todos os materiais do Firestore
  await firebase.firestore().collection("study-materials").get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const material = {
          id: doc.id,
          title: data.title,
          description: data.description,
          subject: data.subject,
          author: data.author,
        };
        materials.push(material);
      });
    });

  // Função para remover acentos e converter para minúsculas
  function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Função para renderizar materiais na tabela
  function renderMaterials(filteredMaterials) {
    materialsTable.innerHTML = "";

    filteredMaterials.forEach((material) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${material.title}</td>
        <td>${material.description}</td>
        <td>${material.subject}</td>
        <td>${material.author}</td>
        <td>
          <button onclick="editMaterial('${material.id}')">Editar</button>
          <button onclick="deleteMaterial('${material.id}')">Excluir</button>
        </td>
      `;

      materialsTable.appendChild(row);
    });
  }

  // Função para editar um material
  window.editMaterial = async function (id) {
    const material = materials.find((m) => m.id === id);
    if (!material) return;

    const newTitle = prompt("Editar título:", material.title);
    const newDescription = prompt("Editar descrição:", material.description);
    const newSubject = prompt("Editar matéria:", material.subject);
    const newAuthor = prompt("Editar autor:", material.author);

    if (newTitle && newDescription && newSubject && newAuthor) {
      try {
        await firebase.firestore().collection("study-materials").doc(id).update({
          title: newTitle,
          description: newDescription,
          subject: newSubject,
          author: newAuthor,
        });
        // Atualize o material na lista local
        const updatedMaterial = materials.find((m) => m.id === id);
        updatedMaterial.title = newTitle;
        updatedMaterial.description = newDescription;
        updatedMaterial.subject = newSubject;
        updatedMaterial.author = newAuthor;
        renderMaterials(materials);
      } catch (error) {
        console.error("Erro ao atualizar material:", error);
        alert("Erro ao atualizar material.");
      }
    }
  };

  // Função para excluir um material
  window.deleteMaterial = async function (id) {
    if (confirm("Você tem certeza que deseja excluir este material?")) {
      try {
        await firebase.firestore().collection("study-materials").doc(id).delete();
        materials = materials.filter((material) => material.id !== id);
        renderMaterials(materials);
      } catch (error) {
        console.error("Erro ao excluir material:", error);
        alert("Erro ao excluir material.");
      }
    }
  };

  // Função para filtrar e renderizar materiais com base no termo de pesquisa
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTerm = removerAcentos(searchInput.value.trim());

    console.log("Termo de pesquisa:", searchTerm); // Mensagem de depuração

    if (!searchTerm) {
      renderMaterials(materials);
      return;
    }

    const filteredMaterials = materials.filter((material) => {
      const title = removerAcentos(material.title);
      const description = removerAcentos(material.description);
      const subject = removerAcentos(material.subject);
      const author = removerAcentos(material.author);

      return title.includes(searchTerm) ||
             description.includes(searchTerm) ||
             subject.includes(searchTerm) ||
             author.includes(searchTerm);
    });

    console.log("Materiais filtrados:", filteredMaterials); // Mensagem de depuração
    renderMaterials(filteredMaterials);
  });

  // Inicializa a tabela com todos os materiais
  renderMaterials(materials);
});
