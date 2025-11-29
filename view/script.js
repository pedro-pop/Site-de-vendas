/* ============================================================
   AUMONT PARIS — SCRIPT PRINCIPAL
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  /* ============================================================
     LOCALSTORAGE E CARRINHO
  ============================================================ */
  const CART_KEY = "aumont_cart_v1";

  const loadCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart || []));
    updateCartView();
  };

  let cart = loadCart();

  const cartCountEls = $$("#cartCount");
  const listaCarrinho = $("#listaCarrinho");
  const valorTotal = $("#valorTotal");

  function updateCartView() {
    cart = loadCart();
    cartCountEls.forEach((el) => (el.textContent = cart.length));

    if (!listaCarrinho || !valorTotal) return;

    if (cart.length === 0) {
      listaCarrinho.innerHTML = `<p class="empty-cart-message">Seu carrinho está vazio.</p>`;
      valorTotal.textContent = "R$ 0,00";
      return;
    }

    let total = 0;
    listaCarrinho.innerHTML = "";
    cart.forEach((item, index) => {
      total += item.price * (item.qty || 1);
      const div = document.createElement("div");
      div.classList.add("item-carrinho");
      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p class="price">R$ ${item.price.toFixed(2).replace(".", ",")}</p>
        </div>
        <button class="remove-item" data-index="${index}">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;
      listaCarrinho.appendChild(div);
    });
    valorTotal.textContent = "R$ " + total.toFixed(2).replace(".", ",");

    // Remover item
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.currentTarget.dataset.index;
        cart.splice(idx, 1);
        saveCart(cart);
        toast("Item removido do carrinho");
      });
    });
  }

  function addToCart(name, priceText, img = "") {
    const price = parseFloat(
      priceText.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
    );
    const existing = cart.findIndex((it) => it.name === name);
    if (existing >= 0) {
      cart[existing].qty = (cart[existing].qty || 1) + 1;
    } else {
      cart.push({ name, price, qty: 1, img });
    }
    saveCart(cart);
    toast(`${name} adicionado ao carrinho`);
  }

  updateCartView();

  /* ============================================================
     TOAST
  ============================================================ */
  const toastContainer = $("#toastContainer");
  function toast(msg, t = 2000) {
    if (!toastContainer) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    toastContainer.appendChild(el);
    setTimeout(() => el.remove(), t);
  }

  /* ============================================================
     LOGIN / CADASTRO / BOTÃO CADASTRAR PRODUTO
  ============================================================ */
  const btnCadastrarProduto = $("#btnCadastrarProduto");
  const btnEntrar = $("#btnEntrar");
  const btnEntrarMobile = $("#btnEntrarMobile");
  const formLogin = $("#formLogin");
  const formRegister = $("#formRegister");

  function atualizarInterface() {
    const usuarioLogado = localStorage.getItem("usuarioLogado") === "true";

    if (usuarioLogado) {
      btnCadastrarProduto?.classList.remove("hidden");
      if (btnEntrar) btnEntrar.innerHTML = `<i class="fa-solid fa-user"></i> Perfil`;
      if (btnEntrarMobile) btnEntrarMobile.innerHTML = `<i class="fa-solid fa-user"></i> Perfil`;
    } else {
      btnCadastrarProduto?.classList.add("hidden");
      if (btnEntrar) btnEntrar.innerHTML = `<i class="fa-solid fa-user"></i> Entrar`;
      if (btnEntrarMobile) btnEntrarMobile.innerHTML = `<i class="fa-solid fa-user"></i> Entrar`;
    }
  }

  atualizarInterface();

  // LOGIN
  formLogin?.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      let email = document.getElementById("loginEmail").value
      let password = document.getElementById("loginSenha").value
  
      let body = {
        email:email,
        password:password
      }
      
      let response = await fetch("http://localhost/SITE-DE-VENDAS/controller/AuthController.php",{
        method:"POST",
        body:JSON.stringify(body)
      })
  
      let data = await response.json()
      
      if(response.status === 400){
        alert(data.error);
        return
      }

      if(response.status === 401){
        alert(data.error);
        return
      }

      if(!response.ok){
        alert(response.statusText)
        return
      }

      sessionStorage.setItem("usuarioLogado", JSON.stringify(data));
      atualizarInterface();
      alert("Login realizado com sucesso!");
      formLogin.reset();
      $("#modalOverlay")?.classList.add("hidden");
      window.location.href = "index.html"; // redireciona
    } catch (error) {
      if(error instanceof Error){
        alert(error.message)
        return
      }
    }
    
  });

  // CADASTRO
  formRegister?.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("usuarioLogado", "true");
    atualizarInterface();
    toast("Cadastro realizado com sucesso!");
    formRegister.reset();
    $("#modalOverlay")?.classList.add("hidden");
    window.location.href = "index.html"; // redireciona
  });

  // LOGOUT
  const btnLogout = $("#btnLogout");
  btnLogout?.addEventListener("click", () => {
    localStorage.setItem("usuarioLogado", "false");
    atualizarInterface();
    toast("Logout realizado com sucesso!");
  });

  /* ============================================================
     FRETE (ViaCEP)
  ============================================================ */
  const cepInput = $("#cepInput");
  const calcularFreteBtn = $("#calcularFrete");
  const resultadoFrete = $("#resultadoFrete");

  calcularFreteBtn?.addEventListener("click", async () => {
    const cep = cepInput.value.replace(/\D/g, "");
    if (cep.length !== 8) {
      resultadoFrete.textContent = "CEP inválido.";
      return;
    }

    try {
      const data = await fetch(`https://viacep.com.br/ws/${cep}/json/`).then((r) =>
        r.json()
      );

      if (data.erro) {
        resultadoFrete.textContent = "CEP não encontrado.";
        return;
      }

      const frete = 19.9; // Exemplo
      resultadoFrete.textContent = `Frete para ${data.localidade} - ${data.uf}: R$ ${frete.toFixed(
        2
      )}`;
    } catch {
      resultadoFrete.textContent = "Erro ao calcular frete.";
    }
  });

  /* ============================================================
     SINCRONIZAÇÃO ENTRE ABAS
  ============================================================ */
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY || e.key === "usuarioLogado") {
      cart = loadCart();
      updateCartView();
      atualizarInterface();
    }
  });

  /* ============================================================
     ADD TO CART VIA CLICK
  ============================================================ */
  document.addEventListener("click", (e) => {
    if (e.target.matches(".add-to-cart")) {
      const btn = e.target;
      const card = btn.closest(".card");
      const name = card?.querySelector("h3")?.innerText || "Produto";
      const price = card?.querySelector(".price")?.innerText || "R$ 0,00";
      const img = card?.querySelector("img")?.src || "";
      addToCart(name, price, img);
      btn.classList.add("added");
      btn.textContent = "Adicionado ✅";
    }

    if (e.target.matches(".buy-now")) {
      const card = e.target.closest(".card");
      const name = card?.querySelector("h3")?.innerText || "Produto";
      toast(`Você clicou em Comprar Agora para: ${name}. Redirecionando...`);
    }
  });

  /* ============================================================
     MENU MOBILE
  ============================================================ */
  const mobileMenu = $("#mobileMenu");
  $("#btnMenu")?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("open");
    mobileMenu?.setAttribute(
      "aria-hidden",
      mobileMenu.classList.contains("open") ? "false" : "true"
    );
  });

  /* ============================================================
     BOTÃO VOLTAR AO TOPO
  ============================================================ */
  const btnTop = $("#btnTop");
  window.addEventListener("scroll", () => {
    if (btnTop) btnTop.classList.toggle("show", window.scrollY > 300);

    const footer = document.querySelector("footer");
    if (footer && btnTop) {
      const footerTop = footer.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (footerTop < windowHeight - 50) btnTop.classList.add("white-mode");
      else btnTop.classList.remove("white-mode");
    }
  });

  btnTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});