document.addEventListener("DOMContentLoaded", async function () {
  const materialsTable = document
    .getElementById("materialsTable")
    .querySelector("tbody");
  const searchForm = document.getElementById("searchMaterials-form");
  const searchInput = document.getElementById("search");

  let materials = [];
  await firebase
    .firestore()
    .collection("study-materials")
    .get()
    .then((snapshot) => {
      snapshot.docs.map((doc) => {
        const data = doc.data();
        const material = {
          id: doc.id,
          title: data.title,
          description: data.description,
          subject: data.subject.id,
          author: data.author,
        };
        materials.push(material);
        return material;
      });
    });

  function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

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

  window.editMaterial = function (id) {
    const material = materials.find((m) => m.id === id);
    if (!material) return;

    const newTitle = prompt("Editar título:", material.title);
    const newDescription = prompt("Editar descrição:", material.description);
    const newSubject = prompt("Editar assunto:", material.subject);
    const newAuthor = prompt("Editar autor:", material.author);

    if (newTitle) material.title = newTitle;
    if (newDescription) material.description = newDescription;
    if (newSubject) material.subject = newSubject;
    if (newAuthor) material.author = newAuthor;

    renderMaterials(materials);
  };

  window.deleteMaterial = function (id) {
    materials = materials.filter((material) => material.id !== id);
    renderMaterials(materials);
  };

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTerm = removerAcentos(searchInput.value.toLowerCase());

    const filteredMaterials = materials.filter(
      (material) =>
        removerAcentos(material.title.toLowerCase()).includes(searchTerm) ||
        removerAcentos(material.description.toLowerCase()).includes(
          searchTerm
        ) ||
        removerAcentos(material.subject.toLowerCase()).includes(searchTerm) ||
        removerAcentos(material.author.toLowerCase()).includes(searchTerm)
    );

    renderMaterials(filteredMaterials);
  });

  renderMaterials(materials);
});
