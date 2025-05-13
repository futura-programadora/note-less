async function cadastrar() {
    const nomeUsuario = document.querySelector('.input-usuario').value;
    const email = document.querySelector('.input-email').value;
    const senha = document.querySelector('.input-senha').value;

    if (!nomeUsuario || !email || !senha) {
        alert('Preencha todos os campos!');
        return;
    }

     // Exibir a tela de carregamento
     document.getElementById('loading-screen').style.display = 'flex';

    try {
        const resposta = await fetch('https://note-less-backend.onrender.com/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nomeUsuario, email, senha })
        });

        // Esconde a tela de carregamento
        document.getElementById('loading-screen').style.display = 'none';

        const dados = await resposta.json();

        if (resposta.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = '../index.html'; // redireciona para a tela de login
        } else {
            alert('Erro ao cadastrar: ' + dados.erro);
        }

    } catch (erro) {
        // Esconde a tela de carregamento
        document.getElementById('loading-screen').style.display = 'none';
        alert('Erro de rede ou servidor');
        console.error(erro);
    }
}
