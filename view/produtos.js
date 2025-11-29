async function carregarProdutos() {
    let response = await fetch("http://localhost/SITE-DE-VENDAS/controller/ProdutoController.php",{method:"GET"})

    let data = await response.json()

    await data.forEach(produto => {
        criarCardProduto(produto)
    });
}

function criarCardProduto(produto){
    let produtos_grid = document.getElementsByClassName("produtos-grid")[0]


    let card_container = document.createElement("div")
    card_container.classList.add("card")

    let img = document.createElement("img")
    img.src = "/SITE-DE-VENDAS/" + produto.img_path
    card_container.appendChild(img)

    let card_body = document.createElement("div")
    card_body.classList.add("card-body")
    card_container.appendChild(card_body)

    let nome_produto = document.createElement("h3")
    nome_produto.textContent = produto.nome
    card_body.appendChild(nome_produto)

    let preco = document.createElement("span")
    preco.textContent = produto.preco
    preco.classList.add("price")
    card_body.appendChild(preco)

    let card_actions = document.createElement("div")
    card_actions.classList.add("card-actions")
    card_body.appendChild(card_actions)

    let button_comprar = document.createElement("button")
    button_comprar.textContent = "Comprar Agora"
    button_comprar.classList.add("buy-now")
    card_actions.appendChild(button_comprar)

    let button_add_cart = document.createElement("button")
    button_add_cart.textContent = "Adicionar ao Carrinho"
    button_add_cart.classList.add("add-to-cart")
    card_actions.appendChild(button_add_cart)

    produtos_grid.appendChild(card_container);
}

carregarProdutos();