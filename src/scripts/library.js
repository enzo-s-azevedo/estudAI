document.addEventListener("DOMContentLoaded", function () {
  showLoading();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const materiaisRef = firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .collection("library");

      materiaisRef
        .get()
        .then((querySnapshot) => {
          const container = document.getElementById("fileItems");
          container.innerHTML = "";

          querySnapshot.forEach((doc) => {
            const material = doc.data();

            const materialElement = document.createElement("div");
            materialElement.classList.add("material");
            materialElement.innerHTML = `
              <h3>${material.title}</h3>
              <p>${material.description}</p>
            `;

            const removeButton = document.createElement("button");
            removeButton.innerText = "Remover da biblioteca";
            removeButton.addEventListener("click", () => {
              materiaisRef
                .doc(doc.id)
                .delete()
                .then(() => {
                  materialElement.remove();
                })
                .catch((error) => {
                  console.error("Erro ao remover o material:", error);
                });
            });

            materialElement.appendChild(removeButton);

            container.appendChild(materialElement);
            hideLoading();
          });
        })
        .catch((error) => {
          console.error("Erro ao obter os materiais:", error);
        });
    } else {
      console.log("Usuário não autenticado");
    }
  });
});
