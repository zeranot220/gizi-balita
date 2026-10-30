# 🌱 GiziBalita — Kalkulator Nutrisi Cerdas untuk Si Kecil

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

> **Aplikasi web interaktif untuk pemantauan status antropometri pertumbuhan balita (0–59 bulan) dan kalkulasi kebutuhan nutrisi harian berbasis standar World Health Organization (WHO) & Kementerian Kesehatan Republik Indonesia.**

---

## 📋 Daftar Isi
1. [Tentang Proyek](#-tentang-proyek)
2. [Fitur Utama](#-fitur-utama)
3. [Standar & Landasan Ilmiah](#-standar--landasan-ilmiah)
4. [Tampilan Antarmuka](#-tampilan-antarmuka)
5. [Struktur Berkas](#-struktur-berkas)
6. [Cara Menjalankan Secara Lokal](#-cara-menjalankan-secara-lokal)
7. [Panduan Deploy ke GitHub Pages](#-panduan-deploy-ke-github-pages)
8. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
9. [Disclaimer Medis](#-disclaimer-medis)
10. [Lisensi & Pengembang](#-lisensi--pengembang)

---

## 🌟 Tentang Proyek

Permasalahan gangguan pertumbuhan anak seperti **stunting** (gagal tumbuh), **wasting** (gizi kurang/buruk), dan **overweight** masih menjadi tantangan kesehatan masyarakat yang signifikan. Deteksi dini melalui penilaian antropometri berkala dan pemenuhan Angka Kecukupan Gizi (AKG) yang tepat sangat krusial pada 1.000 Hari Pertama Kehidupan (HPK).

**GiziBalita** dikembangkan sebagai instrumen digital yang mudah digunakan oleh orang tua, kader posyandu, tenaga kesehatan, maupun mahasiswa farmasi/kesehatan untuk:
- Menganalisis kurva antropometri pertumbuhan anak usia 0 hingga 59 bulan.
- Mengidentifikasi indikasi risiko gizi secara real-time berdasarkan *Z-Score*.
- Memberikan estimasi kebutuhan energi total, makronutrien, serta mikronutrien penting secara presisi.
- Menyarankan panduan MPASI dan porsi makanan bergizi seimbang.

---

## 🚀 Fitur Utama

### 1. 📊 Penilaian Status Antropometri (WHO Z-Score)
- **Berat Badan menurut Usia (BB/U):** Menentukan kategori Berat Badan Sangat Kurang (*severely underweight*), Kurang (*underweight*), Normal, atau Risiko Lebih.
- **Panjang/Tinggi Badan menurut Usia (TB/U):** Skrining risiko **Stunting** (Sangat Pendek / Pendek / Normal / Tinggi).
- **Berat Badan menurut Panjang/Tinggi Badan (BB/TB):** Deteksi kondisi **Wasting** (Gizi Buruk / Gizi Kurang / Normal / Berisiko Gizi Lebih / Gizi Lebih / Obesitas).

### 2. ⚡ Kalkulator Kebutuhan Gizi Harian (AKG Kemenkes)
- **Kebutuhan Energi Total:** Dihitung dalam satuan kilokalori (kkal/hari).
- **Makronutrien:** Rincian kebutuhan Protein (g), Lemak total (g), Karbohidrat (g), Serat pangan (g), dan Kebutuhan Cairan (ml/hari).
- **Mikronutrien Esensial:** Pemenuhan Vitamin A, Vitamin C, Vitamin D, Kalsium, Zat Besi (Fe), Zinc, Folat, dan Yodium.

### 3. 📈 Visualisasi Data Interaktif
- Grafik proporsi kalori dan zat gizi makro berbasis **Chart.js**.
- Indikator status gizi visual dengan palet warna informatif (*badge alert*).

### 4. 🥣 Panduan MPASI & Piring Makan Balita
- Rekomendasi tekstur, frekuensi, dan variasi makanan sesuai milestone usia balita.
- Tips praktis untuk stimulasi nafsu makan dan pencegahan *picky eater*.

### 5. 🖨️ Cetak / Ekspor Laporan
- Tombol cetak langsung ke format PDF atau printer fisik dengan tata letak ramah cetak (*print stylesheet*).

---

## 📚 Standar & Landasan Ilmiah

Aplikasi ini mengacu pada literatur dan pedoman resmi:
1. **World Health Organization (WHO):** *Child Growth Standards: Length/height-for-age, weight-for-age, weight-for-length, weight-for-height and body mass index-for-age (2006)*.
2. **Kementerian Kesehatan Republik Indonesia:** *Peraturan Menteri Kesehatan RI No. 2 Tahun 2020 tentang Standar Antropometri Anak*.
3. **Kementerian Kesehatan Republik Indonesia:** *Peraturan Menteri Kesehatan RI No. 28 Tahun 2019 tentang Angka Kecukupan Gizi (AKG) yang Dianjurkan untuk Masyarakat Indonesia*.

---

## 📁 Struktur Berkas

```text
gizi-balita/
├── index.html        # Struktur antarmuka web semantik (HTML5)
├── style.css         # Desain responsif, modern design tokens, dan CSS print
├── app.js            # Algoritma perhitungan Z-Score, data AKG, dan grafik Chart.js
├── hero.jpg          # Ilustrasi visual header/banner
├── README.md         # Dokumentasi resmi proyek
├── LICENSE           # Lisensi Open Source (MIT)
└── .gitignore        # Berkas pengecualian Git
```

---

## 💻 Cara Menjalankan Secara Lokal

Aplikasi ini adalah **pure static web application**, sehingga **tidak memerlukan backend, database, ataupun dependensi runtime seperti Node.js**.

1. Unduh atau clone repositori ini:
   ```bash
   git clone https://github.com/<username-anda>/gizi-balita.git
   ```
2. Masuk ke direktori:
   ```bash
   cd gizi-balita
   ```
3. Buka file `index.html` langsung di browser favorit Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, dll.):
   - Cukup **klik dua kali pada file `index.html`**, atau
   - Buka via terminal (Windows PowerShell):
     ```powershell
     Start-Process index.html
     ```

---

## 🌐 Panduan Deploy ke GitHub Pages (Gratis & Langsung Online)

Anda dapat membuat aplikasi ini dapat diakses secara online oleh dosen, penilai, kader, atau masyarakat luas menggunakan **GitHub Pages**:

### Langkah 1: Buat Repositori di GitHub
1. Masuk ke akun Anda di [GitHub.com](https://github.com/).
2. Klik tombol **New** (atau ikon `+` di kanan atas > **New repository**).
3. Isi kolom **Repository name** dengan nama: `gizi-balita`.
4. Pilih **Public**.
5. Jangan centang "Add a README file" (karena kita sudah menyediakannya).
6. Klik **Create repository**.

### Langkah 2: Unggah Berkas Proyek
1. Pada halaman repositori kosong, klik tautan **uploading an existing file**.
2. Buka folder `gizi-balita` di komputer Anda, pilih semua berkas berikut lalu seret (*drag & drop*) ke browser:
   - `index.html`
   - `style.css`
   - `app.js`
   - `hero.jpg`
   - `README.md`
   - `LICENSE`
   - `.gitignore`
3. Pada bagian bawah, tulis pesan commit (misalnya: `Initial commit: Aplikasi GiziBalita`).
4. Klik **Commit changes**.

### Langkah 3: Aktifkan GitHub Pages
1. Pada halaman repositori GitHub Anda, klik menu tab **Settings** (ikon gerigi).
2. Di menu navigasi samping kiri, klik **Pages** (pada bagian *Code and automation*).
3. Di bawah judul **Build and deployment**:
   - **Source:** Pilih `Deploy from a branch`
   - **Branch:** Pilih `main` (atau `master`) dan folder `/ (root)`
4. Klik **Save**.
5. Tunggu sekitar 1–2 menit, lalu refresh halaman. Anda akan melihat banner hijau bertuliskan:
   > *"Your site is live at https://<username-anda>.github.io/gizi-balita/"*
6. Selamat! Aplikasi kalkulator nutrisi Anda sekarang sudah online dan bisa diakses dari smartphone, tablet, maupun komputer di mana saja.

---

## 🛠️ Teknologi yang Digunakan

- **HTML5:** Struktur semantik, aksesibilitas form, dan meta tag SEO.
- **CSS3:** Flexbox, CSS Grid, Glassmorphism visual effect, CSS variables, dan responsivitas layar penuh.
- **JavaScript (ES6+):** Manipulasi DOM native, kalkulasi interpolasi linier Z-score WHO, logika filter rentang umur, dan kalkulasi dinamis.
- **Chart.js (v4.4.0):** Visualisasi chart makronutrien interaktif berbasis Canvas.
- **Google Fonts:** Tipografi modern menggunakan *Nunito* & *Outfit*.

---

## ⚠️ Disclaimer Medis

Aplikasi **GiziBalita** dikembangkan sebagai sarana edukatif, skrining awal, dan alat bantu hitung berbasis literatur ilmiah publikasi WHO dan Kemenkes RI. Hasil kalkulasi ini **tidak menggantikan diagnosa klinis medis resmi dari dokter spesialis anak (Sp.A) atau ahli gizi teregistrasi (RD/Nutrisionis)**.

---

## 📄 Lisensi & Kontributor

- Proyek ini dirilis di bawah lisensi open source [MIT License](LICENSE).
- Dikembangkan untuk keperluan edukasi dan inovasi digital di bidang Farmasi dan Kesehatan Balita Indonesia.
