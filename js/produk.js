// ===== Fetch API: Data Produk DummyJSON =====
const API_URL = "https://dummyjson.com/products";

const daftarProduk = document.getElementById("daftarProduk");
const statusProduk = document.getElementById("statusProduk");
const searchProduk = document.getElementById("searchProduk");
const btnMuatUlang = document.getElementById("btnMuatUlang");

let semuaProduk = []; // menyimpan hasil fetch agar bisa difilter

// Mengatur teks status (loading / error / kosong)
function setStatus(pesan, tipe = "") {
  statusProduk.textContent = pesan;
  statusProduk.className = "status " + tipe;
}

// Format harga ke dollar AS
function formatHarga(angka) {
  return "$" + angka.toFixed(2);
}

// Membuat elemen kartu produk lewat DOM (tanpa innerHTML)
function buatKartuProduk(produk) {
  const li = document.createElement("li");
  li.className = "product-card";

  const img = document.createElement("img");
  img.src = produk.thumbnail;
  img.alt = produk.title;
  img.loading = "lazy";

  const nama = document.createElement("h3");
  nama.textContent = produk.title;

  const harga = document.createElement("p");
  harga.className = "price";
  harga.textContent = formatHarga(produk.price);

  const kategori = document.createElement("p");
  kategori.className = "category";
  kategori.textContent = produk.category;

  li.append(img, nama, harga, kategori);
  return li;
}

// Menampilkan array produk ke halaman
function tampilkanProduk(daftar) {
  daftarProduk.replaceChildren(); // kosongkan list

  if (daftar.length === 0) {
    setStatus("Produk tidak ditemukan.", "error");
    return;
  }

  setStatus(`Menampilkan ${daftar.length} produk.`);
  const fragment = document.createDocumentFragment();
  daftar.forEach((p) => fragment.appendChild(buatKartuProduk(p)));
  daftarProduk.appendChild(fragment);
}

// Mengambil data dari API
async function ambilProduk() {
  setStatus("Memuat data produk...", "loading");
  daftarProduk.replaceChildren();
  searchProduk.disabled = true;
  btnMuatUlang.disabled = true;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server merespons dengan status ${response.status}`);
    }

    const data = await response.json();
    semuaProduk = data.products; // data produk ada di properti "products"

    tampilkanProduk(semuaProduk);
    searchProduk.disabled = false;
  } catch (error) {
    console.error(error);
    setStatus("Gagal memuat data: " + error.message + ". Periksa koneksi lalu klik Muat Ulang.", "error");
  } finally {
    btnMuatUlang.disabled = false;
  }
}

// Event: filter produk saat pengguna mengetik
searchProduk.addEventListener("input", () => {
  const kataKunci = searchProduk.value.trim().toLowerCase();
  const hasil = semuaProduk.filter((p) => p.title.toLowerCase().includes(kataKunci));
  tampilkanProduk(hasil);
});

// Event: muat ulang data
btnMuatUlang.addEventListener("click", () => {
  searchProduk.value = "";
  ambilProduk();
});

// Jalankan saat halaman dibuka
ambilProduk();
