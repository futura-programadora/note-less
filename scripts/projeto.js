console.log('Abrindo projeto para edição...');

const projetoId = JSON.parse(localStorage.getItem('projetoId'));
console.log('ID do projeto carregado:', projetoId);

if (!projetoId) {
  alert('Projeto não encontrado!');
  window.location.href = './tela-inicial-geral.html';
}

let projetoAtual = null;
let textareaAtivo = null; // Armazena o textarea atualmente em foco
const debounceTimers = {};

// ✅ Carrega os dados do projeto
async function carregarProjeto() {
  try {
    const response = await fetch(`https://note-less-backend.onrender.com/api/projetos/${projetoId}`);
    if (!response.ok) throw new Error('Erro ao buscar projeto');

    const projeto = await response.json();
    projetoAtual = projeto;

    document.querySelector('.nome-do-projeto').textContent = projeto.titulo;

    if (projeto.paginas?.length > 0) {
      renderizarTodasAsPaginas();
    }

  } catch (erro) {
    console.error('Erro ao carregar o projeto:', erro);
    alert('Erro ao carregar o projeto.');
  }
}

// ✅ Renderiza todas as páginas na tela
function renderizarTodasAsPaginas() {
  const container = document.querySelector('#conteudo-paginas');
  container.innerHTML = '';

  projetoAtual.paginas.forEach((pagina, index) => {
    const section = document.createElement('section');
    section.classList.add('pagina');

    const textarea = document.createElement('textarea');
    textarea.name = 'pagina';
    textarea.dataset.index = index;
    textarea.value = pagina.conteudo || '';
    textarea.style.backgroundColor = pagina.corFundo || '#ffffff';
    textarea.style.height = '400px';

    // 👉 Captura o textarea em foco
    textarea.addEventListener('focus', () => {
      textareaAtivo = textarea;
    });

    // Salvar automaticamente após 500ms de pausa na digitação
    textarea.addEventListener('input', () => {
      clearTimeout(debounceTimers[index]);
      debounceTimers[index] = setTimeout(() => {
        salvarAutomaticamente(index, textarea.value, textarea.style.backgroundColor);
      }, 500);
    });

    section.appendChild(textarea);
    container.appendChild(section);
  });
}

// ✅ Salva automaticamente o conteúdo da página
async function salvarAutomaticamente(index, conteudo, corFundo) {
  const pagina = projetoAtual.paginas[index];
  try {
    const response = await fetch('https://note-less-backend.onrender.com/api/paginas/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: pagina.id,
        conteudo,
        corFundo,
        numero: pagina.numero
      })
    });

    if (!response.ok) throw new Error('Erro ao salvar');

    const paginaAtualizada = await response.json();
    projetoAtual.paginas[index] = paginaAtualizada;

    console.log(`Página ${paginaAtualizada.numero} salva automaticamente.`);

  } catch (erro) {
    console.error(`Erro ao salvar automaticamente página ${pagina.numero}:`, erro);
  }
}

// ✅ Adiciona uma nova página ao projeto
async function adicionarPagina() {
  if (!projetoAtual) return alert('Projeto ainda não carregado.');

  try {
    const response = await fetch('https://note-less-backend.onrender.com/api/paginas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projetoId: projetoAtual.id })
    });

    if (!response.ok) throw new Error('Erro ao criar nova página');

    const novaPagina = await response.json();
    projetoAtual.paginas.push(novaPagina);

    renderizarTodasAsPaginas();
    alert(`Nova página ${novaPagina.numero} criada com sucesso.`);

  } catch (erro) {
    console.error('Erro ao adicionar nova página:', erro);
    alert('Erro ao criar nova página.');
  }
}


// ✅ Gera um PDF do projeto
function baixarPDF() {
  const containerClone = document.querySelector('#conteudo-paginas').cloneNode(true);

  // Remover toolbars do Quill antes de exportar
  containerClone.querySelectorAll('.ql-toolbar').forEach(toolbar => toolbar.remove());

  // Aplicar as classes de formatação para o PDF
  containerClone.querySelectorAll('.ql-editor').forEach(editor => {
    editor.style.fontFamily = 'Arial, sans-serif';  // Você pode ajustar a fonte aqui
    editor.style.fontSize = '12pt';  // Ajuste do tamanho da fonte
    editor.style.lineHeight = '1.5';  // Ajuste do espaçamento entre linhas
  });

  // Definindo as opções para o html2pdf
  const opt = {
    margin: 0.5,
    filename: `${projetoAtual.titulo.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  // Gerando o PDF com o conteúdo formatado
  html2pdf().set(opt).from(containerClone).save();
}




// ✅ Funções de ferramentas de edição
function alinharTexto(alinhamento) {
  if (!textareaAtivo) return;
  textareaAtivo.style.textAlign = alinhamento;
}

function aplicarTitulo(tag) {
  if (!textareaAtivo) return;

  const start = textareaAtivo.selectionStart;
  const end = textareaAtivo.selectionEnd;
  const textoSelecionado = textareaAtivo.value.slice(start, end);

  const prefixo = tag ? '#'.repeat(Number(tag.replace('h', ''))) + ' ' : '';
  const textoComTitulo = `${prefixo}${textoSelecionado}`;

  textareaAtivo.setRangeText(textoComTitulo, start, end, 'end');
}

// ✅ Outros botões
function salvarEsair() {
  window.location.href = './tela-inicial-geral.html';
}

function salvar() {
  alert('Salvamento automático ativado');
}

// ✅ Início
window.onload = carregarProjeto;
