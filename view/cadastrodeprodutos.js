document.addEventListener("DOMContentLoaded", () => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const baseURl = "http://localhost/SITE-DE-VENDAS/controller/"

  const listaProdutosEl = $("#listaProdutos");
  const formProduto = $("#formProduto");
  const btnLogout = $("#btnLogout");

  // LocalStorage para produtos
  const PRODUTOS_KEY = "aumont_produtos_v1";

  const loadProdutos = async () => {
    try {
      let response = await fetch(baseURl+"ProdutoController.php");
      if (!response.ok){
        alert(response.statusText)
        return;
      }
      let data = await response.json();
      return data;
    } catch (error) {
        if(error instanceof Error){
          alert(error.message)
        }
    }
  };

  const saveProdutos = async (produto) => {
    let response = await fetch(baseURl+"ProdutoController.php",{
      body: produto,
      method: "POST",
    })

    let data = await response.json()
    updateProdutosView();
  };

  // let produtos = loadProdutos();

  async function updateProdutosView() {
    let produtos = await loadProdutos();

    console.log(produtos)
    listaProdutosEl.innerHTML = "";
    if (produtos.length === 0) {
      listaProdutosEl.innerHTML = "<p>Nenhum produto cadastrado.</p>";
      return;
    }

    produtos.forEach((prod, idx) => {
      const div = document.createElement("div");
      div.className = "produto-card";
      div.innerHTML = `
        <img src="${ "/SITE-DE-VENDAS/" + prod.img_path}" alt="${prod.nome}">
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
    const descricao = $("#descricaoProduto").value.trim();
    const preco = $("#precoProduto").value.trim();
    const quantidade = $("#quantidadeProduto").value.trim();
    const img = document.querySelector("#imgProduto").files[0];

    let formData = new FormData()
    formData.append("nome", nome)
    formData.append("descricao", descricao)
    formData.append("preco" ,preco)
    formData.append("quantidade",quantidade)
    formData.append("imagem",img)

    if (!nome || !preco) return alert("Preencha nome e preço!");

    saveProdutos(formData);
    formProduto.reset();
    alert("Produto cadastrado com sucesso!");
  });

  // Logout
  btnLogout?.addEventListener("click", () => {
    localStorage.setItem("usuarioLogado", "false");
    window.location.href = "index.html";
  });

  // Redireciona se usuário não estiver logado
  // if (localStorage.getItem("usuarioLogado") !== "true") {
  //   alert("Você precisa estar logado para acessar esta página.");
  //   window.location.href = "index.html";
  // }
});
