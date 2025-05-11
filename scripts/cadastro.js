async function cadastrar() {
    const nomeUsuario = document.querySelector('.input-usuario').value;
    const email = document.querySelector('.input-email').value;
    const senha = document.querySelector('.input-senha').value;

    if (!nomeUsuario || !email || !senha) {
        alert('Preencha todos os campos!');
        return;
    }

    try {
        const resposta = await fetch('http://localhost:3001/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nomeUsuario, email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = '../index.html'; // redireciona para a tela de login
        } else {
            alert('Erro ao cadastrar: ' + dados.erro);
        }

    } catch (erro) {
        alert('Erro de rede ou servidor');
        console.error(erro);
    }
}
