document.addEventListener("DOMContentLoaded", () => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const listaProdutosEl = $("#listaProdutos");
  const formProduto = $("#formProduto");
  const btnLogout = $("#btnLogout");

  // LocalStorage para produtos
  const PRODUTOS_KEY = "aumont_produtos_v1";

  const loadProdutos = () => {
    try {
      return JSON.parse(localStorage.getItem(PRODUTOS_KEY)) || [];
    } catch {
      return [];
    }
  };

  const saveProdutos = (produtos) => {
    localStorage.setItem(PRODUTOS_KEY, JSON.stringify(produtos || []));
    updateProdutosView();
  };

  let produtos = loadProdutos();

  function updateProdutosView() {
    produtos = loadProdutos();
    listaProdutosEl.innerHTML = "";
    if (produtos.length === 0) {
      listaProdutosEl.innerHTML = "<p>Nenhum produto cadastrado.</p>";
      return;
    }

    produtos.forEach((prod, idx) => {
      const div = document.createElement("div");
      div.className = "produto-card";
      div.innerHTML = `
        <img src="${prod.img || 'https://via.placeholder.com/150'}" alt="${prod.nome}">
        <h4>${prod.nome}</h4>
        <p>R$ ${parseFloat(prod.preco).toFixed(2).replace(".", ",")}</p>
        <button class="remover" data-index="${idx}">Remover</button>
      `;
      listaProdutosEl.appendChild(div);
    });

    // Remove produtos
    $$(".remover").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const idx = e.currentTarget.dataset.index;
        produtos.splice(idx, 1);
        saveProdutos(produtos);
      })
    );
  }

  updateProdutosView();

  // Cadastrar novo produto
  formProduto.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = $("#nomeProduto").value.trim();
    const preco = $("#precoProduto").value.trim();
    const img = $("#imgProduto").value.trim();

    if (!nome || !preco) return alert("Preencha nome e preço!");

    produtos.push({ nome, preco: parseFloat(preco), img });
    saveProdutos(produtos);
    formProduto.reset();
    alert("Produto cadastrado com sucesso!");
  });

  // Logout
  btnLogout?.addEventListener("click", () => {
    localStorage.setItem("usuarioLogado", "false");
    window.location.href = "index.html";
  });

  // Redireciona se usuário não estiver logado
  if (localStorage.getItem("usuarioLogado") !== "true") {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "index.html";
  }
});
