document.addEventListener("DOMContentLoaded", function () {
  firebase.auth();
});

document
  .getElementById("searchMaterials-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    showLoading();

    function removerAcentos(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const searchTerm = removerAcentos(
      document.getElementById("search").value.toLowerCase()
    );

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
        hideLoading();
      })
      .catch((error) => {
        console.error("Erro ao buscar materiais:", error);
        hideLoading();
      });

      const filteredMaterials = materials.filter((material) => {
        const title = material.title ? removerAcentos(material.title.toLowerCase()) : "";
        const description = material.description ? removerAcentos(material.description.toLowerCase()) : "";
        const subject = material.subject ? removerAcentos(material.subject.toLowerCase()) : "";
        const author = material.author ? removerAcentos(material.author.toLowerCase()) : "";
        
        return title.includes(searchTerm) ||
          description.includes(searchTerm) ||
          subject.includes(searchTerm) ||
          author.includes(searchTerm);
      });

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
          <button id="adicionar-${material.id}" onclick="adicionarBiblioteca('${material.id}')">Adicionar à Biblioteca</button>
          <button id="remover-${material.id}" onclick="removerBiblioteca('${material.id}')">Remover da Biblioteca</button>
        `;
        resultsDiv.appendChild(materialDiv);
      });
    } else {
      resultsDiv.innerHTML = "<p>Nenhum material encontrado.</p>";
    }
  });

// Função para adicionar material à biblioteca do usuário
function adicionarBiblioteca(id) {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Usuário não autenticado. Faça login para adicionar à biblioteca.");
    return;
  }
  const userId = user.uid;

  const materialRef = firebase.firestore().collection("study-materials").doc(id);
  const userLibraryRef = firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("library");

  userLibraryRef
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        alert("Material já está na biblioteca.");
      } else {
        materialRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              const materialData = doc.data();
              userLibraryRef
                .doc(id)
                .set(materialData)
                .then(() => {
                  alert(`Material com o ID ${id} foi adicionado à sua biblioteca.`);
                  changeButtonText(`adicionar-${id}`, "Adicionado");
                  disableButton(`adicionar-${id}`);
                  enableButton(`remover-${id}`);
                })
                .catch((error) => {
                  console.error("Erro ao adicionar o material à biblioteca:", error);
                });
            } else {
              console.error("Material não encontrado.");
            }
          })
          .catch((error) => {
            console.error("Erro ao obter o material:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Erro ao verificar a biblioteca:", error);
    });
}

// Função para remover material da biblioteca do usuário
function removerBiblioteca(id) {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Usuário não autenticado. Faça login para remover da biblioteca.");
    return;
  }
  const userId = user.uid;

  const userLibraryRef = firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("library");

  userLibraryRef
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userLibraryRef
          .doc(id)
          .delete()
          .then(() => {
            alert(`Material com o ID ${id} foi removido da sua biblioteca.`);
            changeButtonText(`adicionar-${id}`, "Adicionar");
            enableButton(`adicionar-${id}`);
            disableButton(`remover-${id}`);
          })
          .catch((error) => {
            console.error("Erro ao remover o material da biblioteca:", error);
          });
      } else {
        alert("Material não encontrado na biblioteca.");
        console.error("Material não encontrado na biblioteca.");
      }
    })
    .catch((error) => {
      console.error("Erro ao verificar a biblioteca:", error);
    });
}

// Funções auxiliares para manipulação de botões
function changeButtonText(id, text) {
  const button = document.getElementById(id);
  if (button) {
    button.innerText = text;
  }
}

function disableButton(id) {
  const button = document.getElementById(id);
  if (button) {
    button.disabled = true;
  }
}

function enableButton(id) {
  const button = document.getElementById(id);
  if (button) {
    button.disabled = false;
  }
}