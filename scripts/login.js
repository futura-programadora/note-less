async function logar() {
    const email = document.querySelector('.input-email').value;
    const senha = document.querySelector('.input-senha').value;

    // Exibir a tela de carregamento
    document.getElementById('loading-screen').style.display = 'flex';

    try {
        const resposta = await fetch('https://note-less-backend.onrender.com/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const dadosUsuario = await resposta.json();

        // Armazena o usuário no localStorage
        localStorage.setItem('usuario', JSON.stringify(dadosUsuario.usuario));

        // Esconde a tela de carregamento
        document.getElementById('loading-screen').style.display = 'none';

        if (resposta.ok) {
            window.location.href = './paginas/tela-inicial-geral.html'; // Redireciona
        } else {
            alert(dadosUsuario.erro || 'Erro ao logar');
        }
    } catch (erro) {
        // Esconde a tela de carregamento em caso de erro
        document.getElementById('loading-screen').style.display = 'none';
        alert('Erro na requisição', erro);
    }
}



//./paginas/tela-inicial-geral.html