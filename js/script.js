// OBS: FUNÇÕES SÃO INFORMADAS ANTES DO CÓDIGO MAS SÓ EXECUTADAS QUANDO CHAMADAS inicial. 

function atualizar_tabela() { //Atualiza a tabela de listagem na página index.html

  //Constantes inicializadas
  const tabCorpo_lista = document.getElementById('tabCorpo_lista');
  const dados = JSON.parse(localStorage.getItem('dados_formulario')) || []; //O operador || é um operador lógico que retorna o primeiro valor verdadeiro que encontra e se JSON.parse(localStorage.getItem('dados_formulario')) resultar em null (porque não há nada armazenado), então || [] garante que dados será um array vazio. Evitando erros no código que espera que os dados sejam de um array.

  tabCorpo_lista.innerHTML = ''; //Limpa a tabela no html

  dados.forEach(function(item, index){ //O forEach é um método usado para iterar sobre os elementos de um array. Uma vez para cada elemento do array, em ordem. É uma forma mais conveniente de percorrer arrays

      const linha = document.createElement('tr'); 

      //Define o conteúdo do html, nesse caso a linha da tabela com os valores cadastrados pelo usuário armazenados na const dados
      linha.innerHTML = ` 
          <td>${item.nome_descricao}</td>
          <td>${item.categoria}</td>
          <td>${item.data}</td>
          <td>${item.valor}</td>
          <td>${item.tipo}</td>
          <td>
              <button onclick="editarItem(${index})">Editar</button>
              <button onclick="excluirItem(${index})">Excluir</button>
          </td>`; //Cria um botão que chama a função editarItem ou excluirItem quando clicado, também passando o índice do item.
      tabCorpo_lista.appendChild(linha); //tabCorpo_lista vai adicionar uma nova tr na tabela com as informações definidas na const linha
  });

  atualizar_resumo(); //chama função para atualizar o resumo dos gastos
}

function atualizar_resumo() { //Atualiza tabela do resumo dos gastos na pagina index.html

   //Constantes inicializadas
  const tabCorpo_gastos = document.getElementById('tabCorpo_gastos');
  const dados = JSON.parse(localStorage.getItem('dados_formulario')) || []; //O operador || é um operador lógico que retorna o primeiro valor verdadeiro que encontra e se JSON.parse(localStorage.getItem('dados_formulario')) resultar em null (porque não há nada armazenado), então || [] garante que dados será um array vazio. Evitando erros no código que espera que os dados sejam de um array.

  //Variáveis inicializadas. É usada variável porque seu valor precisa ser alterado a cada atualização
  let totalReceitas = 0;
  let totalDespesas = 0;

  dados.forEach(function(item){ //O forEach é um método usado para iterar sobre os elementos de um array. Uma vez para cada elemento do array, em ordem. É uma forma mais conveniente de percorrer arrays

      const valorNumerico = parseFloat(item.valor.replace(/[^0-9,.-]+/g, '').replace(',', '.')); //Converte o valor de string (pego do array dados que foi fornecido pelo usuario no cadastro) para float e retira os simbolos para restar apenas o ponto flutuante. Alem disso, substitui . por , baseando-se no padrão montário BR

      if (item.tipo === 'Receita') { //=== compara uma igualdade em valor e tipo, ou seja, o if só funciona se o tipo for igual e o valor também

          totalReceitas += valorNumerico; //totalReceitas armazena ele + valorNumerico, garantindo que sempre possa ser atualizado mantendo, aumentando ou retirando os valores de acordo com a escolha do usuario
      } 
      else if (item.tipo === 'Despesa') { //O mesmo de acima vale aqui

          totalDespesas += valorNumerico; 
      }
  });

  const saldoFinal = totalReceitas - totalDespesas; //cálculo da diferença entre o que entrou e saiu

  //Define o conteúdo do html, nesse caso a linha da tabela com os valores cadastrados pelo usuário armazenados na const dados
  tabCorpo_gastos.innerHTML = `
      <tr>
          <td>${totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
          <td>${totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
          <td>${saldoFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      </tr>`; //Cria uma linha tr na tabCorpo_gastos na primeira vez que o script for lido e depois vai sendo atualizado somente o que as td individualemente armazenam conforme o usuário. O toLocaleString funciona como conversor de moeda para pt-BR
}

// Remove um item
function excluirItem(index) {
  const dados = JSON.parse(localStorage.getItem('dados_formulario')) || []; //O operador || é um operador lógico que retorna o primeiro valor verdadeiro que encontra e se JSON.parse(localStorage.getItem('dados_formulario')) resultar em null (porque não há nada armazenado), então || [] garante que dados será um array vazio. Evitando erros no código que espera que os dados sejam de um array.

  dados.splice(index, 1);
  localStorage.setItem('dados_formulario', JSON.stringify(dados)); //JSON.stringify() é um método que converte um objeto JavaScript (ou qualquer outro valor) em uma string JSON.
  atualizar_tabela(); //chama a função atualizar a tabela da listagem
}

// Edita um item
function editarItem(index) {
  localStorage.setItem('editingIndex', index);
  window.location.href = 'cadastro.html';
}

// Formata o valor no campo do formulário
function formatar_valor(event) {
  const input = event.target;
  let valor = input.value.replace(/\D/g, '');
  valor = (valor / 100).toFixed(2).replace('.', ',');
  input.value = `R$ ${valor}`;
}

// Salva ou edita um item no formulário
document.getElementById('form_cadastro')?.addEventListener('submit', function (event) {
  event.preventDefault();

  const nome_descricao = document.getElementById('nome_descricao').value;
  const categoria = document.getElementById('categoria').value;
  const data = document.getElementById('data').value;
  const valor = document.getElementById('valor').value;
  const tipo = document.getElementById('tipo').value;

  const dados = JSON.parse(localStorage.getItem('dados_formulario')) || [];
  const editingIndex = localStorage.getItem('editingIndex');

  if (editingIndex !== null) {
      dados[editingIndex] = { nome_descricao, categoria, data, valor, tipo };
      localStorage.removeItem('editingIndex');
  } else {
      dados.push({ nome_descricao, categoria, data, valor, tipo });
  }

  localStorage.setItem('dados_formulario', JSON.stringify(dados));
  alert('Dados salvos com sucesso!');
  window.location.href = 'index.html';
});

// Navega para a página de cadastro
document.getElementById('botao_add')?.addEventListener('click', function () {
  window.location.href = 'cadastro.html';
});

// Atualiza a tabela ao carregar a página inicial
document.addEventListener('DOMContentLoaded', function () {
  atualizar_tabela();
  const editingIndex = localStorage.getItem('editingIndex');
  if (editingIndex !== null) {
      const dados = JSON.parse(localStorage.getItem('dados_formulario')) || []; //O operador || é um operador lógico que retorna o primeiro valor verdadeiro que encontra e se JSON.parse(localStorage.getItem('dados_formulario')) resultar em null (porque não há nada armazenado), então || [] garante que dados será um array vazio. Evitando erros no código que espera que os dados sejam de um array.

      const item = dados[editingIndex];

      document.getElementById('nome_descricao').value = item.nome_descricao;
      document.getElementById('categoria').value = item.categoria;
      document.getElementById('data').value = item.data;
      document.getElementById('valor').value = item.valor;
      document.getElementById('tipo').value = item.tipo;

      localStorage.removeItem('editingIndex');
  }
});