console.log('start js')

const usuario = JSON.parse(localStorage.getItem('usuario'));
console.log(usuario.senha)

document.querySelector('#email').value = usuario.email;
document.querySelector('#senha').value = usuario.senha;
document.querySelector('#bem-vindo').textContent = `Bem-vindo aos seus cadernos ${usuario.nomeUsuario}`;

function salvarAlteracoes() {
    const novoEmail = document.querySelector('#email').value;
    const novaSenha = document.querySelector('#senha').value;

    if (novoEmail && novaSenha) {
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        fetch('http://localhost:3001/api/usuarios/', {
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
                throw new Error('Erro ao atualizar o usuário no banco de dados');
            }
            return response.json();
        })
        .then(data => {
            console.log('Usuário atualizado no banco de dados:', data);
        })
        .catch(error => {
            console.error('Erro ao atualizar o usuário:', error);
            alert('Erro ao salvar as alterações.');
        });
    } else {
        alert('Por favor, preencha os campos de email e senha.');
    }
}

function sair() {
    window.location.href = '../index.html';
}

async function listarProjetos() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || !usuario.id) {
    alert('Usuário não encontrado!');
    return;
  }

  try {
    // Busca todos os projetos do usuário
    const response = await fetch('http://localhost:3001/api/projetos/buscar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: usuario.id })
    });

    if (!response.ok) {
      throw new Error('Erro ao listar projetos');
    }

    const todosProjetos = await response.json();

    // 🔍 Filtra apenas os projetos do tipo 'caderno'
    const projetos = todosProjetos.filter(p => p.tipo.toLowerCase() === 'caderno');

    const container = document.querySelector('#projetos-container');
    container.innerHTML = '';

    projetos.forEach(projeto => {
      const divProjeto = document.createElement('div');
      divProjeto.classList.add('livro');

      if (projeto.capa) {
        divProjeto.style.backgroundImage = `url(${projeto.capa})`;
        divProjeto.style.backgroundSize = 'cover';
        divProjeto.style.backgroundPosition = 'center';
      }

      divProjeto.innerHTML = `
        <h1>${projeto.titulo}</h1>
        <button class="editar" data-id="${projeto.id}">Editar</button>
      `;

      container.appendChild(divProjeto);
    });

    document.querySelectorAll('.editar').forEach(botao => {
      botao.addEventListener('click', function () {
        const idProjeto = this.getAttribute('data-id');
        localStorage.setItem('projetoId', JSON.stringify(idProjeto));
        window.location.href = '../paginas/projeto.html';
      });
    });

  } catch (erro) {
    console.error('Erro ao listar projetos:', erro);
    alert('Erro ao carregar projetos.');
  }
}


window.onload = listarProjetos;
