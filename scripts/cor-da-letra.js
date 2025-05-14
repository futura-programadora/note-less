function restaurarTexto() {
  // Verifica se o painel já existe
  if (document.getElementById('painel-cor-texto')) {
    return document.getElementById('painel-cor-texto').classList.toggle('escondido');
  }

  // Cria o painel
  const painel = document.createElement('div');
  painel.id = 'painel-cor-texto';
  painel.style.position = 'fixed';
  painel.style.top = '80px';
  painel.style.right = '20px';
  painel.style.padding = '10px';
  painel.style.backgroundColor = '#f9f9f9';
  painel.style.border = '1px solid #ccc';
  painel.style.borderRadius = '8px';
  painel.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
  painel.style.zIndex = 1000;

  const titulo = document.createElement('p');
  titulo.textContent = 'Escolher cor da escrita:';
  titulo.style.marginBottom = '5px';
  titulo.style.fontWeight = 'bold';
  painel.appendChild(titulo);

  const cores = ['black', 'red', 'blue', 'green', 'purple'];
  cores.forEach(cor => {
    const botao = document.createElement('button');
    botao.textContent = cor;
    botao.style.margin = '3px';
    botao.style.padding = '5px 10px';
    botao.style.backgroundColor = cor;
    botao.style.color = cor === 'black' ? 'white' : 'white';
    botao.style.border = 'none';
    botao.style.borderRadius = '4px';
    botao.style.cursor = 'pointer';
    botao.onclick = () => aplicarCorFonte(cor);
    painel.appendChild(botao);
  });

  document.body.appendChild(painel);
}

// Aplica a cor ao texto inteiro no 'textarea'
function aplicarCorFonte(cor) {
  if (!textareaAtivo) {
    alert('Nenhuma página selecionada!');
    return;
  }

  // Altera a cor de todo o conteúdo do 'textarea'
  textareaAtivo.style.color = cor;

  // Opcional: salvar a alteração de cor no backend ou em outro lugar
  const index = textareaAtivo.dataset.index;
  salvarAutomaticamente(index, textareaAtivo.value, textareaAtivo.style.backgroundColor, cor);
}
