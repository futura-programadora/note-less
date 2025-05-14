// Assume que textareaAtivo já foi definido globalmente no script principal

// Aplicar cor ao texto selecionado
function aplicarCorTexto(cor) {
  if (!textareaAtivo) return;

  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const textoSelecionado = range.toString();
  if (!textoSelecionado.trim()) return;

  const span = document.createElement('span');
  span.style.color = cor;
  span.textContent = textoSelecionado;

  range.deleteContents();
  range.insertNode(span);

  // Reposiciona o cursor após o novo span
  range.setStartAfter(span);
  range.setEndAfter(span);
  selection.removeAllRanges();
  selection.addRange(range);
}

// Aplicar título (h1 a h6)
function aplicarTitulo(tag) {
  if (!textareaAtivo) return;

  const start = textareaAtivo.selectionStart;
  const end = textareaAtivo.selectionEnd;

  const textoSelecionado = textareaAtivo.value.slice(start, end);
  if (!textoSelecionado.trim()) return;

  const prefixo = '#'.repeat(Number(tag.replace('h', ''))) + ' ';
  const textoComTitulo = `${prefixo}${textoSelecionado}`;

  textareaAtivo.setRangeText(textoComTitulo, start, end, 'end');
}


// Aplicar negrito ao texto selecionado
function bold() {
  if (!textareaAtivo) return;

  const start = textareaAtivo.selectionStart;
  const end = textareaAtivo.selectionEnd;

  const textoSelecionado = textareaAtivo.value.slice(start, end);
  if (!textoSelecionado.trim()) return;

  const negrito = `**${textoSelecionado}**`;

  textareaAtivo.setRangeText(negrito, start, end, 'end');
}

