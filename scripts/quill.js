let editoresQuill = []; // Armazena todos os editores ativos, para manter o controle dos editores criados

function renderizarTodasAsPaginas() {
  const container = document.querySelector('#conteudo-paginas'); // Seleciona o container onde as páginas serão renderizadas
  container.innerHTML = ''; // Limpa o conteúdo do container para evitar duplicações
  editoresQuill = []; // Limpa o array que armazena os editores

  projetoAtual.paginas.forEach((pagina, index) => {
    const section = document.createElement('section'); // Cria um elemento 'section' para cada página
    section.classList.add('pagina'); // Adiciona a classe 'pagina' à section

    const editorContainer = document.createElement('div'); // Cria o contêiner do editor Quill
    editorContainer.classList.add('quill-editor'); // Adiciona a classe 'quill-editor' para estilização
    editorContainer.dataset.index = index; // Atribui o índice da página ao editor para referência futura
    editorContainer.style.backgroundColor = pagina.corFundo || '#ffffff'; // Define a cor de fundo da página
    editorContainer.style.height = '500px'; // Define a altura do editor

    section.appendChild(editorContainer); // Adiciona o editor ao contêiner da página
    container.appendChild(section); // Adiciona a página ao contêiner geral

    // Inicializa o editor Quill no contêiner criado
    const quill = new Quill(editorContainer, {
      theme: 'snow', // Define o tema do editor como 'snow' (um tema claro)
      modules: {
        toolbar: [ // Configura a barra de ferramentas do Quill
          [{ header: [1, 2, 3, false] }], // Permite a escolha de diferentes níveis de cabeçalhos
          ['bold', 'italic', 'underline'], // Permite a formatação de texto em negrito, itálico e sublinhado
          [{ align: [] }], // Permite o alinhamento do texto (sem valores definidos, mas pode ser customizado)
          ['image'], // Permite a inserção de imagens
          ['clean'] // Permite limpar a formatação do texto
        ]
      }
    });

    // Carrega o conteúdo da página no editor Quill
    quill.root.innerHTML = pagina.conteudo || ''; // Se houver conteúdo, carrega, caso contrário, mantém vazio

    // Salva automaticamente o conteúdo do editor com debounce para evitar múltiplas requisições consecutivas
    quill.on('text-change', () => {
      clearTimeout(debounceTimers[index]); // Limpa o tempo anterior, caso o usuário ainda esteja digitando
      debounceTimers[index] = setTimeout(() => { // Espera 500ms após a última mudança no editor para salvar
        const conteudo = quill.root.innerHTML; // Pega o conteúdo HTML atual do editor
        salvarAutomaticamente(index, conteudo, editorContainer.style.backgroundColor); // Salva automaticamente o conteúdo
      }, 500);
    });

    editoresQuill.push(quill); // Adiciona o editor criado ao array de editores para controle futuro
  });
}
