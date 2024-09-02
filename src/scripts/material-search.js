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
                <button onclick="removerBiblioteca('${material.id}')">Remover da biblioteca</button>
            `;
        resultsDiv.appendChild(materialDiv);
      });
    } else {
      resultsDiv.innerHTML = "<p>Nenhum material encontrado.</p>";
    }
  });

function adicionarBiblioteca(id) {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Usuário não autenticado. Faça login para adicionar à biblioteca.");
    return;
  }
  const userId = user.uid;

  const materialRef = firebase
    .firestore()
    .collection("study-materials")
    .doc(id);
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
                  alert(
                    `Você adicionou o material com o ID ${id} à sua biblioteca.`
                  );
                  changeButtonText(`adicionar-${id}`, "Adicionado");
                  disableButton(`adicionar-${id}`);
                })
                .catch((error) => {
                  console.error(
                    "Erro ao adicionar o material à biblioteca:",
                    error
                  );
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
            alert(`Você removeu o material com o ID ${id} da sua biblioteca.`);
            changeButtonText(`adicionar-${id}`, "Adicionar");
            enableButton(`adicionar-${id}`);
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

function enableButton(id) {
  const button = document.getElementById(id);
  if (button) {
    button.disabled = false;
  }
}
