# Sesi 01: Pengantar Jaringan Komputer & Komunikasi Data

## 1. Landasan Teori & Konsep Dasar (20%)

### 1.1 Komunikasi Data (Data Communications)
Komunikasi data adalah pertukaran data antara dua perangkat melalui media transmisi tertentu seperti kabel tembaga, serat optik, atau gelombang nirkabel (wireless).

Sistem komunikasi data yang efektif bergantung pada 4 karakteristik utama:
1. **Delivery (Pengiriman)**: Sistem harus mengirimkan data ke tujuan yang tepat.
2. **Accuracy (Akurasi)**: Sistem harus mengirimkan data secara akurat tanpa korupsi.
3. **Timeliness (Tepat Waktu)**: Sistem harus mengirimkan data pada waktu yang tepat (terutama data real-time seperti audio/video).
4. **Jitter**: Variasi dalam waktu kedatangan paket data (penundaan yang tidak konsisten).

### 1.2 Komponen Komunikasi Data
Sistem komunikasi data terdiri dari 5 komponen utama:
- **Message**: Informasi/data yang dikirim (teks, angka, gambar, audio, video).
- **Sender**: Perangkat pengirim data (komputer, HP, kamera).
- **Receiver**: Perangkat penerima data (komputer, TV, smartphone).
- **Transmission Medium**: Jalur fisik tempat pesan merambat (kabel UTP, koaksial, fiber optik, radio).
- **Protocol**: Aturan baku yang mengatur proses komunikasi data.

### 1.3 Mode Transmisi Data (Data Flow)
1. **Simplex**: Transmisi satu arah (misal: keyboard ke CPU, pemancar TV ke TV).
2. **Half-Duplex**: Transmisi dua arah bergantian, tidak bisa bersamaan (misal: Walkie-Talkie).
3. **Full-Duplex**: Transmisi dua arah sekaligus dalam waktu bersamaan (misal: telepon, percakapan HTTPS).

---

## 2. Intuisi & Model Mental (20%)

> **Analogi Pengiriman Surat & Protokol**
> Bayangkan kamu mengirim surat fisik. Pesan adalah kertas surat, sender adalah kamu, receiver adalah temanmu, media transmisi adalah jalan raya/kurir, dan protokol adalah format penulisan alamat, perangko, serta bahasa yang dipahami kedua pihak.

### Kriteria Utama Jaringan
- **Performance (Kinerja)**: Diukur berdasarkan *Delay/Latency* (waktu tempuh) dan *Throughput* (jumlah data per detik).
- **Reliability (Keandalan)**: Dilihat dari frekuensi kegagalan komponen dan waktu pemulihan (*Availability*).
- **Security (Keamanan)**: Perlindungan data dari kerusakan atau akses pihak tak berwenang (*Unauthorized users*).

---

## 3. Topologi & Kategori Jaringan (30%)

### 3.1 Topologi Fisik (Physical Topology)

| Topologi | Cara Kerja & Karakteristik | Kelebihan | Kekurangan |
| :--- | :--- | :--- | :--- |
| **Mesh** | Setiap perangkat terhubung *point-to-point* ke semua perangkat lain ($N(N-1)/2$ koneksi). | Sangat aman, tidak ada kemacetan (*dedicated link*), *fault tolerance* tinggi. | Mahal, pemasangan kabel sangat rumit & butuh banyak port. |
| **Star** | Setiap perangkat terhubung ke satu *central device* (Hub/Switch). | Mudah dipasang, jika 1 kabel putus yang lain tetap hidup. | Jika central node mati, seluruh jaringan lumpuh (*single point of failure*). |
| **Bus** | Satu kabel utama (*backbone*) menghubungkan semua perangkat via *drop lines* & *taps*. | Hemat kabel, cocok untuk jaringan kecil. | Jika backbone putus, seluruh jaringan mati. Sukar melacak kerusakan. |
| **Ring** | Setiap perangkat terhubung ke dua tetangganya membentuk lingkaran tertutup. | Sederhana, pengiriman sinyal regeneratif di tiap node. | Satu link putus merusak seluruh lingkaran (kecuali pakai dual ring). |

### 3.2 Kategori Jaringan Berdasarkan Jangkauan
- **LAN (Local Area Network)**: Jangkauan kecil (gedung, kantor, rumah). Transfer rate tinggi.
- **MAN (Metropolitan Area Network)**: Jangkauan seukuran kota atau kampus.
- **WAN (Wide Area Network)**: Jangkauan geografis luas (antar kota, negara, benua). Contoh: koneksi antar ISP.

### 3.3 Model Layering: OSI vs TCP/IP

#### Model OSI (7 Layers)
1. **Application**: Antarmuka aplikasi pengguna (HTTP, FTP, SMTP).
2. **Presentation**: Enkripsi, kompresi, format data (SSL/TLS, JPEG).
3. **Session**: Manajemen sesi komunikasi (RPC, NetBIOS).
4. **Transport**: Komunikasi end-to-end, segmentasi, kontrol alur & error (TCP, UDP).
5. **Network**: Pengalamatan logis (IP) & routing paket (IPv4, IPv6, ICMP).
6. **Data Link**: Pengalamatan fisik (MAC), framing, node-to-node hop (Ethernet, Wi-Fi).
7. **Physical**: Transmisi bit mentah melalui media fisik (kabel UTP, gelombang radio).

#### Model TCP/IP (5 Layers)
- Application Layer (Menggabungkan Application, Presentation, Session OSI)
- Transport Layer
- Network Layer (Internet Layer)
- Data Link Layer
- Physical Layer

---

## 4. Strategi & Edge Cases (20%)

### Perbandingan Matriks Topologi (Formula Koneksi Mesh)
Untuk $N$ perangkat dalam topologi fully-connected mesh:
$$\text{Jumlah Link Fisik} = \frac{N(N-1)}{2}$$
$$\text{Jumlah Port per Perangkat} = N - 1$$

*Contoh*: Jika ada 5 perangkat, jumlah kabel = $\frac{5 \times 4}{2} = 10$ kabel, dan tiap perangkat butuh 4 port I/O.

### Common Pitfalls
- **Salah Membedakan Throughput vs Bandwidth**: Bandwidth adalah kapasitas maksimal saluran, sedangkan Throughput adalah kecepatan riil data yang berhasil terkirim.
- **Single Point of Failure pada Star Topology**: Banyak yang mengira Star topology paling tahan banting, padahal kerentanan utamanya ada pada Switch/Hub tengah.

---

## 5. Bank Soal & Assessment Data (10%)

### Review Questions & Answers

#### Q1: Analisis Kegagalan Koneksi Topologi
Jika terjadi failure pada 1 sambungan kabel fisik:
- **a. Mesh Topology (5 devices)**: Hanya 2 perangkat terkait yang kehilangan jalur langsung, namun masih bisa berkomunikasi via perangkat lain. Sisa jaringan 100% berfungsi normal.
- **b. Star Topology (5 devices)**: Hanya 1 perangkat bersangkutan yang terisolasi. 4 perangkat lain tetap dapat berkomunikasi lancar via Central Hub/Switch.
- **c. Bus Topology (5 devices)**: Jika jalur utama (*backbone*) putus, seluruh komunikasi jaringan mati total karena pantulan sinyal (*reflection*) dan hilangnya terminator.
- **d. Ring Topology (5 devices)**: Pada single ring, putusnya 1 kabel memutus aliran ring sehingga seluruh jaringan gagal berkomunikasi.

#### Q2: Perbedaan Half-Duplex dan Full-Duplex
- **Half-Duplex**: Data dapat mengalir dua arah tetapi **TIDAK bersamaan**. Saat A mengirim, B hanya bisa menerima (contoh: Walkie-Talkie).
- **Full-Duplex**: Data dapat mengalir ke dua arah **SECARA BERSAMAAN**. A dan B bisa saling mengirim dan menerima data di waktu yang sama (contoh: Panggilan Telepon, Fast Ethernet full-duplex).

