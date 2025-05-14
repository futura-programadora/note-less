console.log('start js')

const usuario = JSON.parse(localStorage.getItem('usuario'));
console.log(usuario.senha)

document.querySelector('#email').value = usuario.email
document.querySelector('#senha').value = usuario.senha
document.querySelector('#bem-vindo').textContent = `Bem-vindo ${usuario.nomeUsuario}`

function salvarAlteracoes() {
  novoEmail = document.querySelector('#email').value;
  novaSenha = document.querySelector('#senha').value;



  //confere os campos obrigatorio 
  if (novoEmail && novaSenha) {

    // Exibir a tela de carregamento
    document.getElementById('loading-screen').style.display = 'flex';

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    //envia os dados para o back end
    fetch('https://note-less-backend.onrender.com/api/usuarios/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: usuario.id,
        email: novoEmail,
        senha: novaSenha
      })

    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao atualizar o usuario no banco de dados');
        }
        return response.json();
      })
      .then(data => {
        // Esconder a tela de carregamento
        document.getElementById('loading-screen').style.display = 'none';

        alert('Usuario atualizado com sucesso!')
        console.log('Usuario atualizado no banco de dados:', data);
      })
      .catch(error => {
        console.error('Erro ao atualizar o usuario no banco de dados:', error);
        alert('Erro ao salvar as alterações no banco de dados.');
      });
  } else {
    alert('Por favor, preencha os campos de email e senha.');
  }
}

function sair() {
  window.location.href = '../index.html'
}

// Função para listar os projetos do usuário
async function listarProjetos() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || !usuario.id) {
    alert('Usuário não encontrado!');
    return;
  }

  try {
    // Requisição ao backend para listar projetos
    const response = await fetch('https://note-less-backend.onrender.com/api/projetos/buscar', {
      method: 'POST',  // Método POST já que você está passando o userId no corpo da requisição
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: usuario.id })
    });

    if (!response.ok) {
      throw new Error('Erro ao listar projetos');
    }

    const projetos = await response.json();

    // Exibe os projetos no frontend
    const container = document.querySelector('#projetos-container'); // Assumindo que há um container para os projetos
    container.innerHTML = ''; // Limpa o conteúdo anterior

    projetos.forEach(projeto => {
      const divProjeto = document.createElement('div');
      divProjeto.classList.add('livro'); // Adiciona a classe livro

      // Se o projeto tiver uma capa, usa-a como fundo
      if (projeto.capa) {
        const isBase64 = projeto.capa.startsWith('data:image');

        // Define a capa como fundo
        divProjeto.style.backgroundImage = `url(${projeto.capa})`;
        divProjeto.style.backgroundSize = 'cover';  // Faz a imagem cobrir toda a div
        divProjeto.style.backgroundPosition = 'center';  // Centraliza a imagem
      } else {
        divProjeto.style.backgroundColor = '#3f917f'
      }

      // Exibe informações do projeto
      divProjeto.innerHTML = `
        <h1>${projeto.titulo}</h1>
        <button class="editar" data-id="${projeto.id}">Editar</button>
      `;

      container.appendChild(divProjeto); // Adiciona o projeto ao container
    });

    // Adiciona o evento de clique no botão de editar
    const botoesEditar = document.querySelectorAll('.editar');
    botoesEditar.forEach(botao => {
      botao.addEventListener('click', function () {
        const idProjeto = this.getAttribute('data-id');
        // Salva o ID do projeto no localStorage
        localStorage.setItem('projetoId', JSON.stringify(idProjeto));
        // Redireciona para a página de edição
        window.location.href = '../paginas/projeto.html';
      });
    });

  } catch (erro) {
    console.error('Erro ao listar projetos:', erro);
    alert('Erro ao carregar projetos.');
  }
}

// Chama a função para listar os projetos assim que a página carregar
window.onload = listarProjetos;
