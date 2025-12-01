const urunler = [
  { id: 1, ad: "Kablosuz Kulaklık", fiyat: 899, kategori: "Elektronik", stok: 5, resim: "img/BH3-1.webp" },
  { id: 2, ad: "Akıllı Saat", fiyat: 1299, kategori: "Elektronik", stok: 5, resim: "img/39182497-2e3341-1650x1650.jpg" },
  { id: 3, ad: "Tişört", fiyat: 199, kategori: "Giyim", stok: 10, resim: "img/siyah-on.webp" },
  { id: 4, ad: "Kupa Bardak", fiyat: 99, kategori: "Ev", stok: 7, resim: "img/levent-sade.png.png" },
  { id: 5, ad: "Sweatshirt", fiyat: 299, kategori: "Giyim", stok: 4, resim: "img/jackjones-jjesohohalfzipfleecesn-gri.webp" },
  { id: 6, ad: "Bluetooth Hoparlör", fiyat: 649, kategori: "Elektronik", stok: 6, resim: "img/image.webp" },
  { id: 7, ad: "iPhone 17", fiyat: 89999, kategori: "Elektronik", stok: 4, resim: "img/202510222156-00UQJM-1.webp" },
  { id: 8, ad: "Pantolon", fiyat: 500, kategori: "Giyim", stok: 8, resim: "img/tD3TS0njKiZNufx7tITE8mTqnsZcEMi8dCfkhpcS.png" },
  { id: 9, ad: "DualSense", fiyat: 3500, kategori: "Elektronik", stok: 5, resim: "img/dualsense-controller-product-thumbnail-01-en-14sep21.webp" },
  { id: 10, ad: "Erkek kaban", fiyat: 1300, kategori: "Giyim", stok: 10, resim: "img/lg.webp" },
  { id: 11, ad: "Steelseries mouse", fiyat: 2110, kategori: "Elektronik", stok: 15, resim: "img/rival_3_wl_gen_2_black_pdp_img_buy_primary_on.webp" },
  { id: 12, ad: "Ayakkabı", fiyat: 3000, kategori: "Giyim", stok: 3, resim: "img/scooter-siyah-beyaz-gunluk-ayakkabi-eg-10-4ea.webp" },
  { id: 13, ad: "Bluetooth kulaklık", fiyat: 800, kategori: "Elektronik", stok: 2, resim: "img/skullcandyskullcandy-turkiyeskullcandy-dd-419.png" },
  { id: 14, ad: "masa saati", fiyat: 1200, kategori: "Ev", stok: 20, resim: "img/unnamed.png" },

];

const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const categoryList = document.getElementById("categoryList");
const cartCount = document.getElementById("cartCount");
const cartPopup = document.getElementById("cartPopup");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCart");
const closeCartBtn = document.getElementById("closeCart");
const cartIcon = document.querySelector(".cart");

let sepet = JSON.parse(localStorage.getItem("sepet")) || [];

function stokDurumClass(stok) {
  if (stok === 0) return "stok-bitmis";
  if (stok <= 2) return "stok-az";
  return "stok-var";
}

function stokYazi(stok) {
  if (stok === 0) return "Stokta yok ❌";
  if (stok <= 2) return `Az kaldı (${stok} adet) ⚠️`;
  return `${stok} adet kaldı ✅`;
}

function urunleriGoster(liste) {
  productList.innerHTML = "";
  liste.forEach(urun => {
    const stokClass = stokDurumClass(urun.stok);
    const stokText = stokYazi(urun.stok);
    const stokDurum = urun.stok > 0 ? "" : "disabled";
    const btnText = urun.stok > 0 ? "Sepete Ekle" : "Tükendi";

    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${urun.resim}" alt="${urun.ad}">
      <div class="info">
        <h4>${urun.ad}</h4>
        <p>${urun.fiyat} ₺</p>
        <small class="stok ${stokClass}">${stokText}</small>
        <button ${stokDurum} onclick="sepeteEkle(${urun.id})">${btnText}</button>
      </div>
    `;
    productList.appendChild(div);
  });
}

urunleriGoster(urunler);

function sepetiKaydetVeGuncelle() {
  localStorage.setItem("sepet", JSON.stringify(sepet));
  sepetiGuncelle();
  guncelleSepetPopup();
}

function sepeteEkle(id) {
  const urun = urunler.find(u => u.id === id);
  if (!urun || urun.stok <= 0) {
    bildirimGoster("❌ Stokta yok!", true);
    return;
  }

  const varMi = sepet.find(u => u.id === id);

  if (varMi) {
    if (urun.stok > 0) {
      varMi.adet++;
      urun.stok--;
      bildirimGoster("✅ Ürün sepete eklendi!");
    } else {
      bildirimGoster("❌ Stok tükendi!", true);
    }
  } else {
    sepet.push({ ...urun, adet: 1 });
    urun.stok--;
    bildirimGoster("✅ Ürün sepete eklendi!");
  }

  urunleriGoster(urunler);
  sepetiKaydetVeGuncelle();
}

function sepetiGuncelle() {
  cartCount.textContent = sepet.reduce((t, u) => t + u.adet, 0);
}

sepetiGuncelle();

searchInput.addEventListener("input", e => {
  const kelime = e.target.value.toLowerCase();
  const filtre = urunler.filter(u => u.ad.toLowerCase().includes(kelime));
  urunleriGoster(filtre);
});

categoryList.addEventListener("click", e => {
  if (e.target.tagName === "LI") {
    document.querySelectorAll("#categoryList li").forEach(li => li.classList.remove("active"));
    e.target.classList.add("active");

    const kategori = e.target.dataset.category;
    if (kategori === "all") urunleriGoster(urunler);
    else urunleriGoster(urunler.filter(u => u.kategori === kategori));
  }
});

cartIcon.addEventListener("click", () => {
  guncelleSepetPopup();
  cartPopup.classList.add("active");
});

closeCartBtn.addEventListener("click", () => cartPopup.classList.remove("active"));

clearCartBtn.addEventListener("click", () => {
  sepet.forEach(s => {
    const urun = urunler.find(u => u.id === s.id);
    if (urun) urun.stok += s.adet;
  });
  sepet = [];
  localStorage.removeItem("sepet");
  urunleriGoster(urunler);
  sepetiKaydetVeGuncelle();
});

function guncelleSepetPopup() {
  cartItems.innerHTML = "";
  let toplam = 0;

  if (sepet.length === 0) {
    cartItems.innerHTML = "<p>Sepetiniz boş 🛒</p>";
    cartTotal.textContent = "Toplam: 0 ₺";
    return;
  }

  sepet.forEach(u => {
    toplam += u.fiyat * u.adet;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${u.resim}" alt="${u.ad}">
      <div class="info">
        <h4>${u.ad}</h4>
        <p>${u.fiyat} ₺ x <span class="adet">${u.adet}</span></p>
        <div class="adet-buttons">
          <button class="minus">-</button>
          <button class="plus">+</button>
        </div>
      </div>
      <button onclick="urunSil(${u.id})">✖</button>
    `;
    cartItems.appendChild(div);

    const minusBtn = div.querySelector(".minus");
    const plusBtn = div.querySelector(".plus");

    minusBtn.addEventListener("click", () => {
      if (u.adet > 1) {
        u.adet--;
        const urun = urunler.find(pr => pr.id === u.id);
        if (urun) urun.stok++;
      }
      urunleriGoster(urunler);
      sepetiKaydetVeGuncelle();
    });

    plusBtn.addEventListener("click", () => {
      const urun = urunler.find(pr => pr.id === u.id);
      if (urun.stok > 0) {
        u.adet++;
        urun.stok--;
        sepetiKaydetVeGuncelle();
        urunleriGoster(urunler);
      } else {
        bildirimGoster("❌ Stok tükendi!", true);
      }
    });
  });

  cartTotal.textContent = `Toplam: ${toplam.toLocaleString()} ₺`;
}

function urunSil(id) {
  const urunSepet = sepet.find(u => u.id === id);
  const urun = urunler.find(u => u.id === id);
  if (urun && urunSepet) urun.stok += urunSepet.adet;
  sepet = sepet.filter(u => u.id !== id);
  urunleriGoster(urunler);
  sepetiKaydetVeGuncelle();
}


const satınAlBtn = document.createElement("button");
satınAlBtn.id = "satinalBtn";
satınAlBtn.textContent = "Satın Al";
document.querySelector(".buttons").appendChild(satınAlBtn);

satınAlBtn.addEventListener("click", () => {
  if (sepet.length === 0) {
    bildirimGoster("Sepet boş, satın alma yapılamaz!", "error");
    return;
  }

  sepet.forEach(item => {
    const urun = urunler.find(u => u.id === item.id);
    if (urun) {
      urun.stok = Math.max(0, (urun.stok || 10) - item.adet); 
    }
  });

  sepet = [];
  localStorage.removeItem("sepet");
  sepetiGuncelle();
  guncelleSepetPopup();
  bildirimGoster("Satın alma başarılı 🛍️", "success");
});



function bildirimGoster(mesaj, hata = false) {
  const div = document.createElement("div");
  div.className = "toast";
  div.textContent = mesaj;
  if (hata) div.style.background = "crimson";
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1500);
}



const sortSelect = document.getElementById("sortSelect");

sortSelect.addEventListener("change", () => {
  let secilen = sortSelect.value;
  let aktifKategori = document.querySelector("#categoryList li.active").dataset.category;
  let liste = [...urunler];

  if (aktifKategori !== "all") {
    liste = liste.filter(u => u.kategori === aktifKategori);
  }

  if (secilen === "asc") {
    liste.sort((a, b) => a.fiyat - b.fiyat);
  } else if (secilen === "desc") {
    liste.sort((a, b) => b.fiyat - a.fiyat);
  }

  urunleriGoster(liste);
});
