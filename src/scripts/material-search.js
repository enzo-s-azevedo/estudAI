document
  .getElementById("searchMaterials-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    function removerAcentos(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const searchTerm = removerAcentos(
      document.getElementById("search").value.toLowerCase()
    );

    //codigo teste de materiais
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

    const filteredMaterials = materials.filter(
      (material) =>
        removerAcentos(material.title.toLowerCase()).includes(searchTerm) ||
        removerAcentos(material.description.toLowerCase()).includes(
          searchTerm
        ) ||
        removerAcentos(material.subject.toLowerCase()).includes(searchTerm) ||
        removerAcentos(material.author.toLowerCase()).includes(searchTerm)
    );

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (filteredMaterials.length > 0) {
      filteredMaterials.forEach((material) => {
        const materialDiv = document.createElement("div");
        materialDiv.className = "material-item";
        materialDiv.innerHTML = `
                <h2>${material.title}</h2>
                <p>ID: ${material.id}</p>
                <p>Descrição: ${material.description}</p>
                <p>Disciplina: ${material.subject}</p>
                <p>Autor: ${material.author}</p>
                <button onclick="adicionarBiblioteca('${material.id}')">adicionar a biblioteca</button>
            `;
        resultsDiv.appendChild(materialDiv);
      });
    } else {
      resultsDiv.innerHTML = "<p>Nenhum material encontrado.</p>";
    }
  });

function adicionarBiblioteca(id) {
  alert(`Você adicionou a biblioteca o material com o ID ${id}`);
  //codigo ainda a implementar para adicionar um livro a biblioteca do usuario
}
