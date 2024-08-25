document.getElementById('searchMaterials-form').addEventListener('submit', function(event) {
    event.preventDefault();

    function removerAcentos(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    const searchTerm = removerAcentos(document.getElementById('search').value.toLowerCase());

    //codigo teste de materiais
    const materials = [
        { id: '1', title: 'Livro A', description: 'Descrição do Livro A', subject: 'Matemática', author: 'Autor A' },
        { id: '2', title: 'Livro B', description: 'Descrição do Livro B', subject: 'Física', author: 'Autor B' },
        { id: '1', title: 'Livro c', description: 'Descrição do Livro c', subject: 'Matemática', author: 'Autor c' },
    ];


    const filteredMaterials = materials.filter(material => 
    removerAcentos(material.title.toLowerCase()).includes(searchTerm) ||
    removerAcentos(material.description.toLowerCase()).includes(searchTerm) ||
    removerAcentos(material.subject.toLowerCase()).includes(searchTerm) ||
    removerAcentos(material.author.toLowerCase()).includes(searchTerm)
    );


    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; 

    if (filteredMaterials.length > 0) {
        filteredMaterials.forEach(material => {
            const materialDiv = document.createElement('div');
            materialDiv.className = 'material-item';
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
        resultsDiv.innerHTML = '<p>Nenhum material encontrado.</p>';
    }
});

function adicionarBiblioteca(id) {
    alert(`Você adicionou a biblioteca o material com o ID ${id}`);
    //codigo ainda a implementar para adicionar um livro a biblioteca do usuario
}                                                                         