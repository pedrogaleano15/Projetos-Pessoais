// Este arquivo é para o navegador, não para o servidor

// Variáveis e funções para a lógica do carrinho
let carrinho = [];

function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function carregarCarrinho() {
  const carrinhoSalvo = localStorage.getItem('carrinho');
  if (carrinhoSalvo) {
    carrinho = JSON.parse(carrinhoSalvo);
  }
}

function adicionarAoCarrinho(produtoId) {
  const itemExistente = carrinho.find((item) => item.id === produtoId);
  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    // Esta lógica de buscar produtos aqui é um problema futuro,
    // pois a lista 'produtos' está estática.
    // O ideal é buscar o produto no servidor.
    const produto = produtos.find((p) => p.id === produtoId);
    if (produto) {
      carrinho.push({ ...produto, quantidade: 1 });
    }
  }
  salvarCarrinho();
  alert(`Produto adicionado ao carrinho!`);
}

function removerDoCarrinho(produtoId) {
  carrinho = carrinho.filter((item) => item.id !== produtoId);
  salvarCarrinho();
  atualizarCarrinhoHTML();
}

function atualizarCarrinhoHTML() {
  const carrinhoContainer = document.getElementById('carrinho-itens');
  const totalElement = document.getElementById('carrinho-total');
  if (carrinhoContainer && totalElement) {
    carrinhoContainer.innerHTML = '';
    let total = 0;
    carrinho.forEach((item) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'carrinho-item';
      itemElement.innerHTML = `
                <span>${item.nome} x ${item.quantidade}</span>
                <span>R$ ${ (item.preco * item.quantidade).toFixed(2) }</span>
                <button class="remover-item" data-id="${item.id}">Remover</button>
            `;
      carrinhoContainer.appendChild(itemElement);
      total += item.preco * item.quantidade;
    });
    totalElement.innerText = `Total: R$ ${total.toFixed(2)}`;
    document.querySelectorAll('.remover-item').forEach((botao) => {
      botao.addEventListener('click', (evento) => {
        const produtoId = parseInt(evento.target.dataset.id);
        removerDoCarrinho(produtoId);
      });
    });
  }
}

// Lógica para carregar e exibir produtos do servidor
function carregarProdutos() {
  const produtosContainer = document.getElementById('produtos-container');
  if (produtosContainer) {
    fetch('http://localhost:3000/api/produtos')
      .then((resposta) => resposta.json())
      .then((produtos) => {
        produtosContainer.innerHTML = '';
        produtos.forEach((produto) => {
          const card = document.createElement('div');
          card.className = 'produto';
          card.innerHTML = `
                        <img class="img-produto" src="https://via.placeholder.com/400x300" alt="${produto.nome}">
                        <h2>${produto.nome}</h2>
                        <p class="preco">Preço: R$ ${produto.preco.toFixed(2)}</p>
                        <p>Em estoque: ${produto.emEstoque}</p>
                        <button class="adicionar-carrinho" data-id="${produto.id}">Adicionar ao Carrinho</button>
                    `;
          produtosContainer.appendChild(card);
        });
      })
      .catch((erro) => {
        console.error('Erro ao carregar produtos:', erro);
        produtosContainer.innerHTML =
          '<p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>';
      });
  }
}

// Inicia toda a lógica do front-end após o carregamento da página
document.addEventListener('DOMContentLoaded', () => {

  // Referências para o menu e áreas
  const menuIcon = document.getElementById('menu-icon');
  const menuPrincipal = document.getElementById('menu-principal');
  const areaGerenciamento = document.getElementById('area-gerenciamento');

  const formularioLogin = document.getElementById('formulario-login');
  const formularioCadastro = document.getElementById('formulario-cadastro');
  const formularioProduto = document.getElementById('formulario-produto');

  // Lógica para o menu de 3 pontos
  if (menuIcon) {
    menuIcon.addEventListener('click', () => {
      menuPrincipal.classList.toggle('oculto');
    });
  }

  // Lógica para mostrar formulários do menu
  document.getElementById('link-login').addEventListener('click', (e) => {
    e.preventDefault();
    areaGerenciamento.classList.remove('oculto');
    formularioLogin.classList.remove('oculto');
    formularioCadastro.classList.add('oculto');
    formularioProduto.classList.add('oculto');
    menuPrincipal.classList.add('oculto');
  });

  document.getElementById('link-cadastro').addEventListener('click', (e) => {
    e.preventDefault();
    areaGerenciamento.classList.remove('oculto');
    formularioLogin.classList.add('oculto');
    formularioCadastro.classList.remove('oculto');
    formularioProduto.classList.add('oculto');
    menuPrincipal.classList.add('oculto');
  });


  // Lógica do carrinho
  carregarCarrinho();
  if (document.body.id === 'pagina-carrinho') {
    atualizarCarrinhoHTML();
  }

  // Lógica para a página inicial (index.html)
  if (document.body.id !== 'pagina-carrinho') {
    carregarProdutos();

    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('adicionar-carrinho')) {
        const produtoId = parseInt(event.target.dataset.id);
        adicionarAoCarrinho(produtoId);
      }
    });
  }

  // Lógica do formulário de adicionar produto (página inicial)
  const formAdicionarProduto = document.getElementById('form-adicionar-produto');
  if (formAdicionarProduto) {
    formAdicionarProduto.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const nome = document.getElementById('nome-produto').value;
      const preco = parseFloat(document.getElementById('preco-produto').value);
      const emEstoque = parseInt(document.getElementById('estoque-produto').value);
      const novoProduto = { nome, preco, emEstoque };
      fetch('http://localhost:3000/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.mensagem);
          formAdicionarProduto.reset();
          carregarProdutos();
        })
        .catch((error) => {
          alert('Ocorreu um erro ao adicionar o produto.');
        });
    });
  }

  // Lógica do formulário de cadastro universal
  const formCadastro = document.getElementById('form-cadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
      const role = document.querySelector('input[name="role"]:checked').value; // Pega o valor do radio button

      const novoUsuario = { nome, email, senha, role };
      fetch('http://localhost:3000/api/users/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.mensagem);
          formCadastro.reset();
        })
        .catch((error) => {
          alert('Ocorreu um erro ao cadastrar o usuário.');
        });
    });
  }

  // Lógica do formulário de login universal
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const email = document.getElementById('email-login').value;
      const senha = document.getElementById('senha-login').value;
      const credenciais = { email, senha };

      fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciais),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.mensagem);
          if (data.token) {
            console.log('Token de acesso:', data.token);
            areaGerenciamento.classList.add('oculto');
            if (data.role === 'vendedor') {
              formularioProduto.classList.remove('oculto');
            } else if (data.role === 'comprador') {
              // Lógica para compradores, como um carrinho de compras
            }
          } else {
            // Se o login falhar, exibe o formulário de cadastro (opcional)
            formularioLogin.classList.add('oculto');
            formularioCadastro.classList.remove('oculto');
          }
        })
        .catch((error) => {
          alert('Erro ao fazer login.');
          console.error(error);
        });
    });
  }
});