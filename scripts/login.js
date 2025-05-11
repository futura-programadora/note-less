async function logar() {
    const email = document.querySelector('.input-email').value;
    const senha = document.querySelector('.input-senha').value;

    const resposta = await fetch('http://localhost:3001/api/usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    });

    const dadosUsuario = await resposta.json();
    console.log(dadosUsuario.usuario)

    localStorage.setItem('usuario', JSON.stringify(dadosUsuario.usuario) );

    if (resposta.ok) {
        // Armazena o ID do usuário para usar depois (em projetos, páginas, etc)
        
        alert('Login bem-sucedido!');
        window.location.href = './paginas/tela-inicial-geral.html'; // redireciona
    } else {
        alert(dados.erro || 'Erro ao logar');
    }
}


//./paginas/tela-inicial-geral.html