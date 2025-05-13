console.log('Abrindo projeto para edição...');

const projetoId = JSON.parse(localStorage.getItem('projetoId'));
console.log('ID do projeto carregado:', projetoId);

if (!projetoId) {
  alert('Projeto não encontrado!');
  window.location.href = './tela-inicial-geral.html';
}

async function baixarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const titulo = projetoAtual.titulo || 'Projeto Sem Título';
  doc.setFontSize(18);
  doc.text(titulo, 10, 20);

  projetoAtual.paginas.forEach((pagina, index) => {
    if (index > 0) doc.addPage(); // adiciona nova página após a primeira

    doc.setFontSize(14);
    doc.text(`Página ${pagina.numero}`, 10, 30);

    // Quebra o texto longo em múltiplas linhas
    const linhas = doc.splitTextToSize(pagina.conteudo || '', 180);
    doc.setFontSize(12);
    doc.text(linhas, 10, 40);
  });

  doc.save(`${titulo.replace(/\s+/g, '_')}.pdf`);
}


let projetoAtual = null;
const debounceTimers = {};

async function carregarProjeto() {
  try {
    const response = await fetch(`http://localhost:3001/api/projetos/${projetoId}`);

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

    textarea.addEventListener('input', () => {
      // Debounce: aguarda 500ms após o último input
      clearTimeout(debounceTimers[index]);
      debounceTimers[index] = setTimeout(() => {
        salvarAutomaticamente(index, textarea.value, textarea.style.backgroundColor);
      }, 500);
    });

    section.appendChild(textarea);
    container.appendChild(section);
  });
}

//SALVAR AUTOMATICAMENTE O CONTEUDO DA PAGINA 
async function salvarAutomaticamente(index, conteudo, corFundo) {
  const pagina = projetoAtual.paginas[index];
  try {
    const response = await fetch('http://localhost:3001/api/paginas/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
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

//ADICIONAR PAGINA
async function adicionarPagina() {
  if (!projetoAtual) return alert('Projeto ainda não carregado.');

  try {
    const response = await fetch('http://localhost:3001/api/paginas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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


function salvarEsair() {
  window.location.href = './tela-inicial-geral.html';
}

window.onload = carregarProjeto;
