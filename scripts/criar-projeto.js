console.log('start js');

// Verificar se o usuário está armazenado no localStorage
const usuario = JSON.parse(localStorage.getItem('usuario'));
if (usuario) {
    console.log(usuario.nomeUsuario);
} else {
    console.log('Usuário não encontrado no localStorage');
}

const inputCapa = document.getElementById('capa');
const previewContainer = document.querySelector('.pre-visualizacao');

// Mostrar pré-visualização da imagem
inputCapa.addEventListener('change', () => {
    const file = inputCapa.files[0];
    previewContainer.innerHTML = '';

    if (file) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = 'Pré-visualização da capa';
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';
        previewContainer.appendChild(img);
    }
});

// Função para criar o projeto
async function criarProjeto() {
    const titulo = document.getElementById('titulo').value;
    const tipo = document.getElementById('definicoes').value;
    const paginas = document.getElementById('paginas').value;
    const capa = document.getElementById('capa').files[0];

    if (!usuario) {
        alert('Usuário não logado');
        return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('tipo', tipo);
    formData.append('paginas', paginas);
    formData.append('userId', usuario.id);
    if (capa) {
        formData.append('capa', capa);
    }

    try {
        const response = await fetch('http://localhost:3001/api/projetos/', {
            method: 'POST',
            body: formData
        });

        const resultado = await response.json();
        console.log('Projeto criado:', resultado);
        alert('Projeto criado com sucesso!');
        // redirecionar ou limpar formulário, se necessário
    } catch (erro) {
        console.error('Erro ao criar projeto:', erro);
        alert('Erro ao criar projeto');
    }
}

// Atribuir a função ao botão de "Criar"
document.getElementById('criarProjetoBtn').addEventListener('click', criarProjeto);
