// ===== Form: DOM & Event Handling =====
const form = document.getElementById("formDaftar");
const hasilForm = document.getElementById("hasilForm");
const inputAlasan = document.getElementById("alasan");
const hitungAlasan = document.getElementById("hitungAlasan");

// Aturan validasi tiap field: mengembalikan pesan error, atau "" jika valid
const aturan = {
  nama: (v) => {
    if (v.trim() === "") return "Nama wajib diisi.";
    if (v.trim().length < 3) return "Nama minimal 3 karakter.";
    if (!/^[A-Za-z\s.'-]+$/.test(v.trim())) return "Nama hanya boleh berisi huruf.";
    return "";
  },
  email: (v) => {
    if (v.trim() === "") return "Email wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Format email tidak valid.";
    return "";
  },
  umur: (v) => {
    if (v === "") return "Umur wajib diisi.";
    const n = Number(v);
    if (!Number.isInteger(n) || n < 17 || n > 60) return "Umur harus berupa angka 17 - 60.";
    return "";
  },
  topik: (v) => (v === "" ? "Pilih salah satu topik." : ""),
  alasan: (v) => (v.trim().length < 10 ? "Alasan minimal 10 karakter." : ""),
};

// Validasi satu field & update tampilan
function validasiField(id) {
  const input = document.getElementById(id);
  const pesan = aturan[id](input.value);
  const wrapper = input.closest(".field");

  document.getElementById("err" + id.charAt(0).toUpperCase() + id.slice(1)).textContent = pesan;
  wrapper.classList.toggle("invalid", pesan !== "");
  wrapper.classList.toggle("valid", pesan === "");
  return pesan === "";
}

function validasiCheckbox() {
  const cek = document.getElementById("setuju");
  const pesan = cek.checked ? "" : "Anda harus menyetujui pernyataan ini.";
  document.getElementById("errSetuju").textContent = pesan;
  return cek.checked;
}

// Event: validasi real-time saat mengetik / berpindah field
Object.keys(aturan).forEach((id) => {
  const el = document.getElementById(id);
  el.addEventListener("input", () => validasiField(id));
  el.addEventListener("blur", () => validasiField(id));
});
document.getElementById("setuju").addEventListener("change", validasiCheckbox);

// Event: penghitung karakter dinamis
inputAlasan.addEventListener("input", () => {
  hitungAlasan.textContent = inputAlasan.value.length;
});

// Menampilkan hasil pemrosesan form
function tampilkanHasil(data) {
  hasilForm.replaceChildren();

  const judul = document.createElement("h3");
  judul.textContent = "Pendaftaran Berhasil!";

  const dl = document.createElement("dl");
  const baris = [
    ["Nama", data.nama],
    ["Email", data.email],
    ["Umur", data.umur + " tahun"],
    ["Topik", data.topik],
    ["Alasan", data.alasan],
  ];
  baris.forEach(([label, nilai]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = nilai; // textContent aman dari injeksi HTML
    dl.append(dt, dd);
  });

  const sapaan = document.createElement("p");
  sapaan.textContent = `Terima kasih, ${data.nama}! Konfirmasi akan dikirim ke ${data.email}.`;

  hasilForm.append(judul, dl, sapaan);
  hasilForm.hidden = false;
  hasilForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Event: submit form
form.addEventListener("submit", (event) => {
  event.preventDefault(); // cegah reload halaman

  // Validasi semua field (tanpa short-circuit agar semua pesan error muncul)
  const hasilValidasi = Object.keys(aturan).map(validasiField);
  hasilValidasi.push(validasiCheckbox());

  if (hasilValidasi.includes(false)) {
    hasilForm.hidden = true;
    return;
  }

  tampilkanHasil({
    nama: form.nama.value.trim(),
    email: form.email.value.trim(),
    umur: form.umur.value,
    topik: form.topik.value,
    alasan: form.alasan.value.trim(),
  });
});

// Event: reset form -> bersihkan pesan, status, dan hasil
form.addEventListener("reset", () => {
  hasilForm.hidden = true;
  hitungAlasan.textContent = "0";
  form.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
  form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
});
