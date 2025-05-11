console.log('start js')

const usuario = JSON.parse(localStorage.getItem('usuario'));
console.log(usuario.nomeUsuario)

document.querySelector('#email').value = usuario.email 
document.querySelector('#senha').value = usuario.senha

function salvarAlteracoes() {
    novoEmail = document.querySelector('#email').value;
    novaSenha = document.querySelector('#senha').value;

    //confere os campos obrigatorio 
    if (novoEmail && novaSenha) {

        const usuario = JSON.parse(localStorage.getItem('usuario'));

        //envia os dados para o back end
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
                throw new Error('Erro ao atualizar o usuario no banco de dados');
            }
            return response.json();
        })
        .then(data => {
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