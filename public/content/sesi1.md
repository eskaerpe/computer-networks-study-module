# Sesi 01: Pengantar Jaringan Komputer, Arsitektur Layer & Protokol TCP/IP

---

## 1. Landasan Teori & Konsep Dasar (25%)

### 1.1 Komunikasi Data (Data Communications)
Komunikasi data adalah proses pertukaran data (informasi) antara dua perangkat (*devices*) melalui suatu media transmisi (*transmission medium*), seperti kabel tembaga (UTP/Coaxial), kabel serat optik (*fiber optic*), atau gelombang elektromagnetik nirkabel (*wireless/RF*).

Untuk membentuk sistem komunikasi data yang berfungsi, diperlukan integrasi antara **perangkat keras (*hardware*)** dan **program/perangkat lunak (*software*)**. Efektivitas sistem komunikasi data diukur melalui 4 karakteristik fundamental:

1. **Delivery (Pengiriman Tepat Sasaran)**: Sistem harus mengantarkan data ke tujuan yang benar. Data hanya boleh diterima oleh perangkat atau pengguna yang dituju.
2. **Accuracy (Akurasi & Integritas Data)**: Data yang tiba harus identik dengan data yang dikirim tanpa ada bit yang rusak (*corrupted*) atau hilang.
3. **Timeliness (Ketepatan Waktu)**: Data harus dikirim tepat waktu tanpa penundaan berlebih (*delay*). Hal ini krusial untuk data *real-time* seperti streaming audio/video.
4. **Jitter (Variasi Keterlambatan Paket)**: Jitter mengukur variasi dalam waktu kedatangan paket data (ketidakkonsistenan delay). Jitter yang tinggi menyebabkan audio/video patah-patah.

```
+-------------------------------------------------------------------------+
|                5 KOMPONEN SISTEM KOMUNIKASI DATA                        |
|                                                                         |
|  [ SENDER ]  -------- ( Message / Data ) -------->  [ RECEIVER ]       |
|      |                                                    ^             |
|      +-----------> [ TRANSMISSION MEDIUM ] --------------+             |
|                                                                         |
|  [ PROTOCOL Rules ]  <------------------------->  [ PROTOCOL Rules ]   |
+-------------------------------------------------------------------------+
```

### 1.2 Lima Komponen Sistem Komunikasi Data
1. **Message (Pesan)**: Informasi/data yang dikomunikasikan (teks, angka, gambar, audio, video).
2. **Sender (Pengirim)**: Perangkat pemancar data (komputer, workstation, smartphone, kamera IP).
3. **Receiver (Penerima)**: Perangkat penerima data (komputer, printer, server, smart TV).
4. **Transmission Medium (Media Transmisi)**: Jalur fisik tempat sinyal merambat dari pengirim ke penerima (kabel twisted pair, fiber optik, gelombang mikro).
5. **Protocol (Protokol)**: Himpunan aturan (*set of rules*) yang mengatur format, sinkronisasi, dan urutan pertukaran data. Tanpa protokol, dua perangkat yang terhubung secara fisik tetap tidak dapat saling memahami.

### 1.3 Mode Aliran Data (Data Flow Directionality)
Berdasarkan arah perambatan sinyal, komunikasi data dibagi menjadi 3 mode:

```
1. SIMPLEX (Satu Arah Mutlak):
   [ Pengirim ] ----------------------------------------> [ Penerima ]
   Contoh: Keyboard -> Komputer, Antena Pemancar TV -> Pesawat TV

2. HALF-DUPLEX (Dua Arah Bergantian):
   [ Perangkat A ] <--- Waktu t1: A kirim ke B -------- [ Perangkat B ]
   [ Perangkat A ] ---- Waktu t2: B kirim ke A -------> [ Perangkat B ]
   Contoh: Walkie-Talkie (Push-to-Talk)

3. FULL-DUPLEX (Dua Arah Simultan / Bersamaan):
   [ Perangkat A ] <======== Dua arah bersamaan ========> [ Perangkat B ]
   Contoh: Jaringan Telepon Seluler, Koneksi Internet TCP/IP (Ethernet Full-Duplex)
```

---

## 2. Intuisi, Analogi & Model Mental (25%)

### 2.1 Mengapa Butuh Protocol Layering? (Analogi Pengiriman Surat Aman)
Komunikasi jaringan modern sangat kompleks: mencakup pembuatan aplikasi, kompresi, enkripsi, fragmentasi paket, routing lintas benua, hingga modulasi tegangan listrik. 

Jika seluruh tugas ini ditangani oleh **satu protokol tunggal (*Single-layer Protocol*)**, setiap perubahan kecil (misal mengganti kabel tembaga ke Wi-Fi) akan merusak seluruh sistem aplikasi.

```
===========================================================================
ANALOGI PROTOKOL 3-LAYER: PENGIRIMAN SURAT AMAN (MARIA -> ANN)
===========================================================================
[ MARIA (Pengirim) ]                                   [ ANN (Penerima) ]

Layer 3: Application (Listen/Talk)                   Layer 3: Application
  -> Tulis pesan rahasia (Plaintext)                   -> Baca pesan (Plaintext)
          |                                                    ^
          v (Turun ke Layer 2)                                 | (Naik ke Layer 3)
Layer 2: Security (Encrypt)                          Layer 2: Security (Decrypt)
  -> Enkripsi Plaintext jadi Ciphertext                -> Dekripsi Ciphertext ke Plaintext
          |                                                    ^
          v (Turun ke Layer 1)                                 | (Naik ke Layer 2)
Layer 1: Mail Handling (Pack/Send)                   Layer 1: Mail Handling
  -> Masukkan ke amplop & beri alamat (Mail)           -> Buka amplop & serahkan ciphertext
          |                                                    ^
          +================= [ US POST TRUCK ] ================+
                         (Infrastruktur Fisik Jalur Darat)
===========================================================================
```

**Prinsip Kunci yang Dipelajari:**
1. **Separation of Concerns (Modularitas)**: Maria dan Ann hanya fokus pada isi pesan (Layer 3). Jika truk pos diganti kereta cepat (Layer 1), sistem enkripsi (Layer 2) dan isi pesan tidak perlu diubah sama sekali.
2. **Peer-to-Peer Logical Communication**: Layer 2 di pengirim berkomunikasi secara logis dengan Layer 2 di penerima (keduanya memahami format *Ciphertext* yang sama).

---

## 3. Deep Dive Arsitektur: 5-Layer TCP/IP & 7-Layer OSI (30%)

### 3.1 Arsitektur 5-Layer Model TCP/IP

Model TCP/IP adalah standar de facto yang digunakan pada jaringan internet global saat ini. Arsitektur ini terdiri dari 5 lapisan hierarkis:

```
+-------------------------------------------------------------------------+
|                  ARSITEKTUR 5 LAPISAN PROTOKOL TCP/IP                   |
+---+---------------+----------------------+------------------------------+
| # | Layer         | Protokol Populer     | Unit Data (PDU) & Tugas      |
+---+---------------+----------------------+------------------------------+
| 5 | Application   | HTTP, DNS, SMTP, SSH | **Message**: Antarmuka user  |
| 4 | Transport     | TCP, UDP             | **Segment**: Process-to-Process |
| 3 | Network       | IPv4, IPv6, ICMP     | **Datagram / Packet**: Host-to-Host Routing |
| 2 | Data Link     | Ethernet, Wi-Fi, PPP | **Frame**: Hop-to-Hop MAC Delivery |
| 1 | Physical      | 1000BASE-T, Fiber, RF| **Bits (0/1)**: Sinyal Elektrik/Optik |
+---+---------------+----------------------+------------------------------+
```

---

### 3.2 Komunikasi Antar-Host Melalui Internetwork (Host vs Switch vs Router)

Salah satu konsep terpenting dalam ujian dan pemahaman jaringan adalah **mengetahui layer mana yang diimplementasikan pada masing-masing perangkat jaringan**.

```
[ HOST A ]              [ SWITCH 1 ]             [ ROUTER R1 ]            [ SWITCH 2 ]             [ HOST B ]
(L1 s/d L5)               (L1 & L2)                (L1 s/d L3)              (L1 & L2)              (L1 s/d L5)

+-----------+                                                                                       +-----------+
| 5. App    | . . . . . . . . . . ( Logical Peer Connection: App ) . . . . . . . . . . . . . . . . .| 5. App    |
+-----------+                                                                                       +-----------+
| 4. Trans  | . . . . . . . . . . ( Logical Peer Connection: Trans ) . . . . . . . . . . . . . . . | 4. Trans  |
+-----------+                                     +-----------+                                     +-----------+
| 3. Net    | . . . . . . . . . . . . . . . . . . | 3. Net    | . . . . . . . . . . . . . . . . . . | 3. Net    |
+-----------+            +-----------+            +-----------+            +-----------+            +-----------+
| 2. Link   | ---------> | 2. Link   | ---------> | 2. Link   | ---------> | 2. Link   | ---------> | 2. Link   |
+-----------+            +-----------+            +-----------+            +-----------+            +-----------+
| 1. Phys   | ---------> | 1. Phys   | ---------> | 1. Phys   | ---------> | 1. Phys   | ---------> | 1. Phys   |
+-----------+            +-----------+            +-----------+            +-----------+            +-----------+
    |                          |                        |                        |                        |
    +=====[ Link 1 (LAN) ]=====+=====[ Link 1 (LAN) ]===+=====[ Link 2 (LAN) ]===+=====[ Link 2 (LAN) ]====+
```

#### Analisis Peran Perangkat:
1. **End-Host (Source & Destination)**: Mengimplementasikan **ke-5 layer**. Menginisiasi pembuatan pesan dari layer aplikasi hingga transmisi bit fisik.
2. **Switch (Layer 2 Device)**:
   - Hanya beroperasi pada **Layer 1 (Physical)** dan **Layer 2 (Data Link)**.
   - Bertugas meneruskan *Frame* di dalam satu LAN yang sama berdasarkan **MAC Address**.
   - Switch tidak membaca ataupun mengubah IP Address (Layer 3) dan tidak tahu isi paket aplikasi.
3. **Router (Layer 3 Device / Gateway)**:
   - Beroperasi pada **Layer 1, 2, dan 3 (Network)**.
   - Menerima frame dari Link 1, membuka header data link, membaca **Destination IP Address** pada header Network, menentukan rute (*routing table*), lalu membungkus kembali paket ke dalam frame baru dengan MAC Address tujuan berikutnya di Link 2.

---

### 3.3 Proses Enkapsulasi & Dekapsulasi Data (Identical Objects)

Ketika data bergerak dari aplikasi pengirim menuju penerima, data mengalami proses pembungkusan header/trailer secara bertahap (**Enkapsulasi**) di sisi pengirim, dan pelepasan (**Dekapsulasi**) di sisi penerima:

```
[ PENGIRIM: ENKAPSULASI ]                                  [ PENERIMA: DEKAPSULASI ]

1. Application Layer:                                     1. Application Layer:
   [ User Data / Message (M) ]                               [ Membaca Message (M) ]
                 |                                                        ^
                 v                                                        |
2. Transport Layer (Tambah Header H4):                    2. Transport Layer:
   [ H4 | Message (M) ]  ===> ( SEGMENT / DATAGRAM )         [ Melepas H4 (Port Addressing) ]
                 |                                                        ^
                 v                                                        |
3. Network Layer (Tambah Header H3):                      3. Network Layer:
   [ H3 | H4 | Message (M) ]  ===> ( PACKET / DATAGRAM )     [ Melepas H3 (IP Addressing) ]
                 |                                                        ^
                 v                                                        |
4. Data Link Layer (Tambah H2 & Trailer T2):              4. Data Link Layer:
   [ H2 | H3 | H4 | M | T2 ]  ===> ( FRAME )                 [ Cek CRC di T2, Melepas H2/T2 ]
                 |                                                        ^
                 v                                                        |
5. Physical Layer:                                        5. Physical Layer:
   011010010110111001110100... ===> ( BITS )                 [ Mengubah Sinyal ke Bit Stream ]
```

* **Header H4**: Berisi nomor **Source Port** dan **Destination Port** (untuk membedakan aplikasi tujuan, misal Port 80 untuk Web, Port 443 HTTPS).
* **Header H3**: Berisi **Source IP** dan **Destination IP Address** (alamat logis global untuk routing internet).
* **Header H2 & Trailer T2**: Berisi **Source MAC** dan **Destination MAC Address** untuk pengiriman hop-to-hop lokal, serta trailer **FCS/CRC (Frame Check Sequence)** untuk mendeteksi apakah data rusak selama transmisi.

---

### 3.4 Perbandingan Model OSI (7 Layer) vs Model TCP/IP (5 Layer)

```
+------------------------------------+------------------------------------+
|         OSI MODEL (7 LAPISAN)      |       TCP/IP MODEL (5 LAPISAN)     |
+------------------------------------+------------------------------------+
| 7. Application                     |                                    |
| 6. Presentation (Enkripsi/Format)  | ===> 5. Application Layer          |
| 5. Session (Dialog & Sinkronisasi) |                                    |
+------------------------------------+------------------------------------+
| 4. Transport                       | ===> 4. Transport Layer            |
+------------------------------------+------------------------------------+
| 3. Network                         | ===> 3. Network Layer              |
+------------------------------------+------------------------------------+
| 2. Data Link                       | ===> 2. Data Link Layer            |
+------------------------------------+------------------------------------+
| 1. Physical                        | ===> 1. Physical Layer             |
+------------------------------------+------------------------------------+
```

#### Mengapa Layer Presentation & Session Digabung di TCP/IP?
* Pada model OSI, **Presentation Layer** menangani translasi karakter (ASCII/Unicode), enkripsi (SSL/TLS), dan kompresi, sedangkan **Session Layer** menangani pembukaan sesi dialog, *checkpoints*, dan sinkronisasi.
* Pada arsitektur internet TCP/IP praktis, kedua fungsi ini diserahkan langsung kepada pengembang aplikasi di **Application Layer** (misalnya HTTPS mengintegrasikan enkripsi TLS langsung di dalam payload aplikasi).

---

## 4. Topologi Fisik & Kategori Jaringan (15%)

### 4.1 Perbandingan Karakteristik Topologi Jaringan

| Topologi | Struktur & Pola Koneksi | Kelebihan Utama | Kelemahan Utama |
| :--- | :--- | :--- | :--- |
| **Mesh (Full)** | Setiap node terhubung langsung ke semua node lain via *dedicated link*. | *Fault tolerance* tertinggi, keamanan tinggi, tidak ada tabrakan data. | Biaya kabel sangat mahal, instalasi rumit, butuh banyak port I/O. |
| **Star** | Setiap node terhubung ke satu perangkat pusat (*Switch/Hub*). | Mudah dikonfigurasi, isolasi kerusakan mudah (1 kabel putus tidak mematikan lainnya). | *Single Point of Failure*: jika Switch pusat mati, seluruh jaringan lumpuh. |
| **Bus** | Semua node terhubung ke satu kabel utama (*backbone*) dengan terminator di ujungnya. | Hemat kabel, murah untuk skala kecil. | Jika kabel utama putus, seluruh jaringan mati total. Sulit melacak kerusakan. |
| **Ring** | Setiap node terhubung ke dua tetangganya membentuk loop tertutup. Sinyal berputar satu arah. | Sederhana, regenerasi sinyal di tiap node (*repeater*). | Kerusakan 1 node/kabel memutuskan seluruh lingkaran (kecuali pakai *Dual Ring*). |

### 4.2 Formula Perhitungan Topologi Mesh
Untuk jaringan *fully-connected mesh* dengan $N$ perangkat:
$$\text{Jumlah Sambungan Fisik (Links)} = \frac{N(N - 1)}{2}$$
$$\text{Jumlah Port I/O per Perangkat} = N - 1$$

*Contoh Soal*: Jika sebuah kantor memiliki 6 server dan ingin dihubungkan dengan topologi Full Mesh:
$$\text{Total Link} = \frac{6 \times 5}{2} = 15 \text{ kabel}$$
Setiap server wajib memiliki $6 - 1 = 5$ port kartu jaringan (NIC).

---

## 5. Ringkasan & Bank Soal Komprehensif (10%)

### Review Questions & Pembahasan Mendalam

#### Q1: Analisis Kegagalan Jalur pada 4 Topologi Jaringan (5 Perangkat)
Jika salah satu kabel penghubung putus pada jaringan dengan 5 node:
1. **Mesh**: Hanya komunikasi langsung antara 2 node terkait yang terputus, namun keduanya masih bisa berkomunikasi secara tidak langsung melewati node lain. 3 node lainnya sama sekali tidak terpengaruh.
2. **Star**: Hanya 1 komputer yang kabelnya putus yang terputus dari jaringan. 4 komputer lainnya tetap dapat saling berkomunikasi normal melalui switch pusat.
3. **Bus**: Jika kabel *backbone* utama terputus, seluruh komunikasi jaringan mati total karena pantulan gelombang (*signal reflection*) akibat hilangnya terminasi resistansi.
4. **Ring**: Pada single-ring standar, putusnya 1 kabel akan merusak aliran token/sinyal sehingga komunikasi seluruh 5 perangkat terhenti.

#### Q2: Mengapa Switch Tidak Bisa Menggantikan Peran Router?
**Jawaban**: Switch bekerja pada **Layer 2 (Data Link)** dan hanya mengenali **MAC Address** untuk meneruskan frame di dalam satu segmen jaringan lokal (LAN/Broadcast Domain yang sama). 

Switch tidak memiliki tabel perutean (*routing table*) berbasis **IP Address (Layer 3)** untuk mencari jalur terbaik (*path determination*) antar jaringan independen yang berbeda subnet atau berbeda teknologi fisik di internet.

#### Q3: Jelaskan Perbedaan Antara Jitter dan Latency!
* **Latency (Delay)**: Total waktu yang dibutuhkan sebuah paket data untuk merambat dari pengirim ke penerima.
* **Jitter**: Variasi atau fluktuasi dalam nilai latency antar paket yang berurutan. Jika paket 1 tiba dalam 20ms, paket 2 dalam 90ms, dan paket 3 dalam 25ms, variasi waktu inilah yang disebut Jitter.
