/* ============================================================
   AUMONT PARIS — SCRIPT PRINCIPAL
   ============================================================ */

/* ====== INICIALIZAÇÃO ====== */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  /* ============================================================
     VARIÁVEIS E UTILITÁRIOS GERAIS
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
      if (footerTop < windowHeight - 50)
        btnTop.classList.add("white-mode");
      else btnTop.classList.remove("white-mode");
    }
  });

  btnTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ============================================================
     CARROSSEL DE PRODUTOS
  ============================================================ */
  const carousel = $(".carousel");
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".card"));
    const dotsWrap = $(".carousel-dots");
    const btnLeft = $(".carousel-btn.left");
    const btnRight = $(".carousel-btn.right");
    let current = 0;

    if (dotsWrap) {
      dotsWrap.innerHTML = slides
        .map(
          (_, i) =>
            `<button class="carousel-dot" aria-label="Ir para slide ${
              i + 1
            }"></button>`
        )
        .join("");
    }

    const dots = $$(".carousel-dot");

    const goToSlide = (index, smooth = true) => {
      current = (index + slides.length) % slides.length;
      if (slides[current]) {
        carousel.scrollTo({
          left:
            slides[current].offsetLeft -
            carousel.clientWidth / 2 +
            slides[current].offsetWidth / 2,
          behavior: smooth ? "smooth" : "auto",
        });
        updateDots();
      }
    };

    const updateDots = () => {
      dots.forEach((d) => d.classList.remove("active"));
      if (dots[current]) dots[current].classList.add("active");
    };

    carousel.addEventListener("scroll", () => {
      const slideWidth = slides[0]?.offsetWidth || 300;
      const gap = 18;
      const newIndex = Math.round(carousel.scrollLeft / (slideWidth + gap));
      if (newIndex !== current && newIndex >= 0 && newIndex < slides.length) {
        current = newIndex;
        updateDots();
      }
    });

    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => {
        stopAuto();
        goToSlide(i);
        startAuto();
      })
    );

    let auto;
    const AUTOPLAY_MS = 4000;
    const startAuto = () => {
      clearInterval(auto);
      auto = setInterval(() => {
        goToSlide((current + 1) % slides.length);
      }, AUTOPLAY_MS);
    };
    const stopAuto = () => clearInterval(auto);

    btnLeft?.addEventListener("click", () => {
      stopAuto();
      goToSlide(current - 1);
      setTimeout(startAuto, 800);
    });
    btnRight?.addEventListener("click", () => {
      stopAuto();
      goToSlide(current + 1);
      setTimeout(startAuto, 800);
    });

    goToSlide(0, false);
    startAuto();

    ["mouseenter", "focusin", "pointerdown"].forEach((evt) =>
      carousel.addEventListener(evt, stopAuto)
    );
    ["mouseleave", "focusout", "pointerup"].forEach((evt) =>
      carousel.addEventListener(evt, startAuto)
    );
  }

  /* ============================================================
     TOAST (ALERTAS FLUTUANTES)
  ============================================================ */
  const toastContainer = $("#toastContainer");
  const toast = (msg, t = 2000) => {
    if (!toastContainer) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    toastContainer.appendChild(el);
    setTimeout(() => el.remove(), t);
  };

  /* ============================================================
     SISTEMA DE CARRINHO
  ============================================================ */
  const cartCountEls = document.querySelectorAll("#cartCount");

  function updateCartView() {
    cart = loadCart();
    const totalItems = cart.length;
    cartCountEls.forEach((el) => (el.textContent = totalItems));

    const listaCarrinho = $("#listaCarrinho");
    const valorTotal = $("#valorTotal");

    if (listaCarrinho) {
      if (cart.length === 0) {
        listaCarrinho.innerHTML = `<p class="empty-cart-message">Seu carrinho está vazio.</p>`;
        if (valorTotal) valorTotal.textContent = "R$ 0,00";
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

      valorTotal.textContent =
        "R$ " + total.toFixed(2).replace(".", ",");

      // Remover item
      document.querySelectorAll(".remove-item").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const idx = e.currentTarget.dataset.index;
          cart.splice(idx, 1);
          saveCart(cart);
          updateCartView();
          toast("Item removido do carrinho");
        });
      });
    }
  }

  const addToCartAction = (name, priceText, img = "") => {
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
  };

  document.addEventListener("click", (e) => {
    // Adicionar ao carrinho
    if (e.target.matches(".add-to-cart")) {
      const btn = e.target;
      const card = btn.closest(".card");
      const name = card?.querySelector("h3")?.innerText || "Produto";
      const price = card?.querySelector(".price")?.innerText || "R$ 0,00";
      const img = card?.querySelector("img")?.src || "";
      addToCartAction(name, price, img);
      btn.classList.add("added");
      btn.textContent = "Adicionado ✅";
    }

    // Comprar agora (mock)
    if (e.target.matches(".buy-now")) {
      const card = e.target.closest(".card");
      const name = card?.querySelector("h3")?.innerText || "Produto";
      toast(`Você clicou em Comprar Agora para: ${name}. Redirecionando...`);
    }
  });

  updateCartView();

  /* ============================================================
     LOGIN / CADASTRO
  ============================================================ */
  const loginBox = $("#loginBox");
  const registerBox = $("#registerBox");
  const toRegister = $("#toRegister");
  const toLogin = $("#toLogin");

  if (toRegister && toLogin && loginBox && registerBox) {
    toRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginBox.classList.remove("active");
      setTimeout(() => registerBox.classList.add("active"), 100);
    });

    toLogin.addEventListener("click", (e) => {
      e.preventDefault();
      registerBox.classList.remove("active");
      setTimeout(() => loginBox.classList.add("active"), 100);
    });
  }

  $("#formLogin")?.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Login efetuado com sucesso!");
  });

  $("#formRegister")?.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Cadastro efetuado com sucesso!");
  });

  /* ============================================================
     CAMPOS NUMÉRICOS (CPF / TELEFONE / CEP)
  ============================================================ */
  ["regTelefone", "regCPF", "regCEP"].forEach((id) => {
    const input = document.getElementById(id);
    if (input)
      input.addEventListener(
        "input",
        () => (input.value = input.value.replace(/\D/g, ""))
      );
  });

  /* ============================================================
     BOTÃO "OLHO" — MOSTRAR/ESCONDER SENHA
  ============================================================ */
  document.querySelectorAll(".toggle-pass").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      const icon = btn.querySelector("i");
      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
      }
    });
  });

  /* ============================================================
     SINCRONIZAÇÃO ENTRE ABAS (LOCALSTORAGE)
  ============================================================ */
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY) {
      cart = loadCart();
      updateCartView();
    }
  });
});
/*===============================================================
   CALCULO DE FRETE USANDO CEP 
================================================================*/
< script >
    função assíncrona soltarFrete() {
      const  cep  =  document.getElementById ( ' cep ' ) . value.replace ( / \ D / g , ' ' ) ; 
      const  resultado  =  documento . getElementById ( 'resultado' ) ;

      se (cep.length !== 8) {
        resultado . innerHTML  =  "<span style='color:red;'>CEP inválido.</span>" ;
        retornar;
      }

      resultado . innerHTML  =  "Calculando..." ;

      tentar {
        const  response  =  await  fetch ( `https://viacep.com.br/ws/ ${ cep } /json/` ) ;
        const  data  =  await  response.json ( ) ;​​

        se (dados.erro) {
          resultado . innerHTML  =  "<span style='color:red;'>CEP não encontrado.</span>" ;
          retornar;
        }

        // Simulação de valor de frete conforme UF
        const  regioes  =  {
          "SP": 15,90, "RJ": 16,90, "MG": 17,90, "ES": 18,90, // Sudeste
          “PR”: 19,90, “SC”: 20,90, “RS”: 21,90, //Sul
          “DF”: 22,90, “GO”: 23,90, “MS”: 24,90, “MT”: 25,90, //Centro-Oeste
          "BA": 26,90, "PE": 27,90, "CE": 28,90, "RN": 29,90, // Nordeste
          "PA": 31,90, "AM": 34,90, "RR": 36,90, "AC": 37,90, // Norte
        } ;

        const valorFrete = regiãoes[data.uf] || 29,90;

        resultado . innerHTML  =  `
          <p><strong>Endereço:</strong> ${ data . logradouro  ||  '---' } , ${ dados . bairro  ||  '---' } - ${ dados . localidade } / ${ dados . uf } </p>
          <p><strong>Valor do frete:</strong> R$ ${ valorFrete . toFixed ( 2 ) } </p>
          <p><small>Entrega estimada em 5 a 7 dias úteis.</small></p>
        ` ;
      } catch (erro) {
        resultado . innerHTML  =  "<span style='color:red;'>Erro ao consultar o CEP.</span>" ;
      }
    }
  </script>​​
