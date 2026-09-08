# Sesi 02: Induksi Matematika dan Fungsi Rekursif (Mathematical Induction and Recursive Function)

**Dosen Pengampu:** Henry Lucky, S.Kom. M.Kom.  
**Mata Kuliah:** COMP6049 – Algorithm Design and Analysis (Desain dan Analisis Algoritma)  
**Institusi:** BINUS University  

---

## 1. Garis Besar Materi & Capaian Pembelajaran

### Garis Besar Materi Sesi 02
1. **Induksi Matematika (*Mathematical Induction*)**
2. **Fungsi Rekursif (*Recursive Function*)**

### Capaian Pembelajaran / Learning Outcomes (LO)
- **LO 1:** Menjelaskan konsep fundamental dalam analisis algoritma (*Explain fundamental concept of analysis algorithms*).
- **LO 2:** Menerapkan teknik-teknik dan metode desain algoritma (*Apply algorithm techniques and methods*).
- **LO 3:** Menyelesaikan masalah spesifik dengan menggunakan algoritma yang tepat (*Solve a problem using specific algorithm*).
- **LO 4:** Membandingkan berbagai macam metode perancangan algoritma (*Compare several algorithm design methods*).

---

## 2. Intuisi & Gambaran Mental (Mental Model)

> **Intuisi Efek Domino untuk Induksi Matematika:**  
> Bayangkan kamu mendirikan deretan kartu domino yang tak terhingga jumlahnya ($D_1, D_2, D_3, \dots, D_n$). Bagaimana cara memastikan SELURUH domino akan jatuh?  
> 1. Kamu harus memastikan **domino pertama ($D_1$) bisa dijatuhkan** (Base Case).  
> 2. Kamu harus memastikan bahwa **jika sembarang domino ke-$k$ ($D_k$) jatuh, sentuhannya PASTI menjatuhkan domino berikutnya ($D_{k+1}$)** (Inductive Step).  
> Jika kedua kondisi ini terpenuhi, maka secara otomatis seluruh domino hingga tak terhingga pasti akan jatuh!

> **Intuisi Boneka Rusia (Matryoshka) untuk Rekursi:**  
> Fungsi rekursif seperti membuka boneka kayu Matryoshka. Di dalam boneka besar terdapat boneka serupa yang lebih kecil. Kamu akan terus membuka boneka yang lebih kecil (Recursive Step) sampai menemukan boneka terkecil terkunci yang tidak bisa dibuka lagi (Base Case). Setelah boneka terkecil ditemukan, kamu mulai menutup kembali boneka-boneka tersebut dari dalam ke luar sampai kembali ke boneka terbesar.

---

## 3. Rumus dan Sifat-Sifat Deret Sumasi (Summation Formulas & Properties)

Sebelum mempelajari induksi matematika untuk analisis kompleksitas algoritma, berikut adalah rumus-rumus dan sifat dasar deret sumasi yang wajib dikuasai:

1. **Linearitas Sumasi (Linearity):**
   $$\sum_{k=1}^n (c \cdot a_k + b_k) = c \sum_{k=1}^n a_k + \sum_{k=1}^n b_k$$
   *(Konstanta $c$ dapat dikeluarkan dari sumasi, dan sumasi dua deret dapat dipisah).*

2. **Deret Aritmatika (Arithmetic Series):**
   $$\sum_{k=1}^n k = 1 + 2 + 3 + \dots + n = \frac{n(n+1)}{2}$$

3. **Sumasi Kuadrat dan Kubik (Sums of Squares & Cubes):**
   $$\sum_{k=1}^n k^2 = 1^2 + 2^2 + 3^2 + \dots + n^2 = \frac{n(n+1)(2n+1)}{6}$$
   $$\sum_{k=1}^n k^3 = 1^3 + 2^3 + 3^3 + \dots + n^3 = \left(\frac{n(n+1)}{2}\right)^2$$

4. **Deret Geometri (Geometric Series):**
   $$\sum_{k=0}^n x^k = 1 + x + x^2 + \dots + x^n = \frac{x^{n+1} - 1}{x - 1} \quad (\text{untuk } x \neq 1)$$

5. **Deret Harmonik (Harmonic Series):**
   $$H_n = \sum_{k=1}^n \frac{1}{k} = 1 + \frac{1}{2} + \frac{1}{3} + \dots + \frac{1}{n} = \ln n + O(1)$$

6. **Pengintegralan dan Pendiferensialan Deret (Integrating & Differentiating Series)**

7. **Deret Teleskopik (Telescopic Series):**
   $$\sum_{k=1}^n (a_k - a_{k-1}) = a_n - a_0$$

8. **Pengindeksan Ulang Sumasi (Reindexing Summations):**
   $$\sum_{k=1}^n a_k = \sum_{j=1}^n a_{n-j+1}$$

9. **Perkalian / Produk (Products):**
   $$\prod_{k=1}^n a_k = a_1 \times a_2 \times \dots \times a_n$$

### Rumus Matematika Tambahan (Penyegaran)
- **Sifat Eksponen dan Logaritma:**
  $$a^{\log_b c} = c^{\log_b a}$$
  $$\log_b (x \cdot y) = \log_b x + \log_b y$$
- **Fungsi Pembulatan (Floor & Ceiling):**
  $$\lfloor x \rfloor \leq x \leq \lceil x \rceil$$

---

## 4. Teknik Pembuktian Induksi Matematika

### Definisi Induksi Matematika
**Induksi Matematika** adalah metode pembuktian matematis yang digunakan untuk membuktikan bahwa suatu pernyataan, persamaan, atau proposisi $P(n)$ bernilai **benar untuk semua bilangan bulat positif / cacah** $n \in \mathbb{N}$ (di mana $n \geq 1$).

### Langkah-Langkah Pembuktian Induksi (Induction Steps):
1. **Langkah Basis (Base Step):**  
   Buktikan bahwa $P(1)$ (atau batas bawah pertama $P(n_0)$) bernilai **BENAR**.
2. **Langkah Induksi (Inductive Step):**  
   Asumsikan bahwa $P(k)$ bernilai **BENAR** untuk suatu bilangan bulat sembarang $k$ (Hipotesis Induksi). Berdasarkan asumsi tersebut, buktikan bahwa $P(k+1)$ juga bernilai **BENAR**.
3. **Kesimpulan (Conclusion):**  
   Jika kedua langkah berhasil dibuktikan, maka pernyataan $P(n)$ bernilai **BENAR untuk semua $n \geq 1$** ($\forall n \, P(n)$).

---

## 5. Contoh Soal Pembuktian Terperinci (Worked Examples)

### Contoh 1: Pembuktian Jumlah $n$ Bilangan Asli Pertama

**Pernyataan yang Akan Dibuktikan:**  
Buktikan bahwa jumlah $n$ bilangan asli pertama adalah $\sum_{i=1}^n i = \frac{n(n+1)}{2}$ untuk semua $n \geq 1$.

#### Langkah 1: Langkah Basis ($n = 1$)
- Ruas Kiri (LHS): $1$
- Ruas Kanan (RHS): $\frac{1(1+1)}{2} = \frac{2}{2} = 1$
- **Hasil:** LHS = RHS = 1. Langkah basis **TERBUKTI BENAR**.

#### Langkah 2: Langkah Induksi
Asumsikan bahwa pernyataan $P(k)$ bernilai **BENAR** untuk $n = k$:
$$1 + 2 + 3 + \dots + k = \frac{k(k+1)}{2} \quad \text{--- (Hipotesis Induksi)}$$

Sekarang kita harus membuktikan bahwa $P(k+1)$ juga bernilai **BENAR**, yaitu menunjukkan bahwa:
$$1 + 2 + 3 + \dots + k + (k+1) = \frac{(k+1)((k+1)+1)}{2} = \frac{(k+1)(k+2)}{2}$$

**Proses Pembuktian:**  
Tambahkan suku $(k+1)$ pada kedua ruas Hipotesis Induksi:
$$\text{LHS} = (1 + 2 + 3 + \dots + k) + (k+1)$$

Substitusikan nilai dari Hipotesis Induksi ke kelompok $k$ suku pertama:
$$\text{LHS} = \frac{k(k+1)}{2} + (k+1)$$

Faktorkan $(k+1)$ dari kedua suku:
$$\text{LHS} = (k+1) \left( \frac{k}{2} + 1 \right) = (k+1) \left( \frac{k+2}{2} \right) = \frac{(k+1)(k+2)}{2}$$
$$\text{LHS} = \text{RHS}$$

#### Langkah 3: Kesimpulan
Karena Langkah Basis dan Langkah Induksi telah terbukti benar, maka menurut Prinsip Induksi Matematika, rumus $\sum_{i=1}^n i = \frac{n(n+1)}{2}$ bernilai **BENAR untuk semua bilangan bulat positif $n \ge 1$**.

---

### Contoh 2: Pembuktian Jumlah Kuadrat $\sum_{i=1}^n i^2 = \frac{n(n+1)(2n+1)}{6}$

#### Langkah 1: Langkah Basis ($n = 1$)
- LHS: $1^2 = 1$
- RHS: $\frac{1(1+1)(2(1)+1)}{6} = \frac{1 \times 2 \times 3}{6} = 1$
- LHS = RHS = 1 $\rightarrow$ **TERBUKTI BENAR**.

#### Langkah 2: Langkah Induksi
Asumsikan $P(k)$ benar untuk $n = k$:
$$\sum_{i=1}^k i^2 = \frac{k(k+1)(2k+1)}{6}$$

Buktikan $P(k+1)$ benar:
$$\sum_{i=1}^{k+1} i^2 = \left( \sum_{i=1}^k i^2 \right) + (k+1)^2 = \frac{k(k+1)(2k+1)}{6} + (k+1)^2$$

Faktorkan $(k+1)$:
$$\sum_{i=1}^{k+1} i^2 = (k+1) \left[ \frac{k(2k+1)}{6} + (k+1) \right] = (k+1) \left[ \frac{2k^2 + k + 6k + 6}{6} \right]$$
$$\sum_{i=1}^{k+1} i^2 = (k+1) \left[ \frac{2k^2 + 7k + 6}{6} \right] = \frac{(k+1)(k+2)(2k+3)}{6}$$
$$\text{LHS} = \text{RHS} \rightarrow \mathbf{TERBUKTI \,\, BENAR!}$$

---

## 6. Fungsi Rekursif dan Konsep Modul

### Konsep Modul dalam Pemrograman
Satu atau beberapa baris algoritma yang menjalankan fungsi tertentu dapat dikelompokkan ke dalam satu unit tersendiri yang disebut **Modul**. Modul sangat berguna jika sekumpulan instruksi algoritma perlu dipanggil atau dijalankan berulang kali oleh berbagai proses berbeda.

#### Istilah Modul dalam Berbagai Bahasa Pemrograman:
- **Procedure (Prosedur):** Modul yang menjalankan serangkaian aksi tanpa mengembalikan nilai secara langsung.
- **Sub / Subroutine:** Istilah sub-program umum (misalnya di VB / Fortran).
- **Function (Fungsi):** Modul yang menerima input dan mengembalikan suatu nilai keluaran (*return value*).

#### Pemanggilan Modul:
Sebuah modul dapat dipanggil oleh:
1. Program Utama (*Main Program*)
2. Modul Lain (*Other Modules*)
3. Modul Itu Sendiri (*The Module Itself*) $\rightarrow$ **Teknik Rekursif**

#### Komunikasi Parameter dengan Pemanggil:
- **Pass by Value (Berdasarkan Nilai):** Nilai data disalin ke dalam modul. Perubahan variabel di dalam modul tidak mempengaruhi variabel asli milik pemanggil.
- **Pass by Reference / Location (Berdasarkan Referensi/Alamat Memori):** Alamat memori variabel dikirimkan ke modul. Perubahan di dalam modul akan langsung mengubah nilai variabel asli pada pemanggil.

---

### Algoritma Rekursif (Recursive Algorithm)

#### Definisi Rekursi
**Rekursi** adalah teknik perancangan algoritma di mana suatu fungsi/modul memanggil dirinya sendiri. Teknik ini memecah masalah yang kompleks menjadi sub-masalah yang lebih kecil namun bertipe sama:
1. Memecah masalah utama menjadi sub-masalah yang lebih kecil.
2. Menyelesaikan masing-masing sub-masalah kecil tersebut.
3. Menggabungkan solusi sub-masalah menjadi solusi lengkap dari masalah utama.

---

### Contoh Kasus: Perhitungan Faktorial ($N!$)

**Definisi Matematis Faktorial:**  
$$0! = 1$$  
$$1! = 1$$  
$$N! = N \times (N-1)! \quad \text{untuk } N > 1$$

#### Perbandingan Pseudocode: Algoritma Iteratif vs Algoritma Rekursif

```pseudocode
// 1. Algoritma Faktorial Iteratif (Menggunakan Perulangan)
module FaktorialIteratif(N)
    r = 1
    for i = 1 to N do
        r = r * i
    end for
    result = r
end module
```

```pseudocode
// 2. Algoritma Faktorial Rekursif (Memanggil Diri Sendiri)
module FaktorialRekursif(N)
    if N <= 1 then
        result = 1             // Kondisi Batas / Base Case
    else
        result = N * FaktorialRekursif(N - 1) // Pemanggilan Rekursif
    end if
end module
```

---

### Pelacakan Eksekusi Stack Memori (Call Stack Execution Trace)

Mari kita lacak pemanggilan `FaktorialRekursif(4)` pada memori komputer:

1. `FaktorialRekursif(4)` dipanggil $\rightarrow$ Menunggu hasil `4 * FaktorialRekursif(3)` *(Push Stack Frame 1)*
2. `FaktorialRekursif(3)` dipanggil $\rightarrow$ Menunggu hasil `3 * FaktorialRekursif(2)` *(Push Stack Frame 2)*
3. `FaktorialRekursif(2)` dipanggil $\rightarrow$ Menunggu hasil `2 * FaktorialRekursif(1)` *(Push Stack Frame 3)*
4. `FaktorialRekursif(1)` dipanggil $\rightarrow$ Memenuhi `N <= 1`, mengembalikan `1` **(Base Case Tercapai!)** *(Pop Stack Frame 4)*
5. Menghitung: `2 * 1 = 2` mengembalikan `2` *(Pop Stack Frame 3)*
6. Menghitung: `3 * 2 = 6` mengembalikan `6` *(Pop Stack Frame 2)*
7. Menghitung: `4 * 6 = 24` mengembalikan **`24`** *(Pop Stack Frame 1)*

---

### Kelemahan dan Resiko Rekursi (Disadvantages of Recursive)

Meskipun algoritma rekursif sangat elegan dan ringkas, ada dua kerugian/resiko utama yang harus diperhatikan:

1. **Alokasi Memori (Memory Allocation & Call Stack Overhead):**
   - Setiap kali modul memanggil dirinya sendiri, sistem akan mengalokasikan *stack frame* baru di dalam memori (*Call Stack*) untuk menyimpan variabel lokal, parameter, dan alamat kembalian (*return address*).
   - Rekursi yang terlalu dalam dapat menghabiskan memori RAM dan menyebabkan kesalahan fatal **Stack Overflow**.

2. **Kondisi Batas (Finite Condition / Base Case):**
   - Algoritma rekursif wajib memiliki kondisi penghentian yang jelas (*Base Case*).
   - Jika kondisi batas tidak dirancang dengan benar, algoritma akan terus memanggil dirinya tanpa henti (*infinite recursion / infinite loop*) yang berujung pada program terhenti (*crash*).

---

## 7. Soal Latihan & Evaluasi Mandiri (Practice & Self-Assessment)

### Kuis Interaktif & Kartu Kilat (Quiz & Flashcards)

#### Kartu Kilat (Flashcards)
1. **Q:** Apa fungsi utama Base Case pada fungsi rekursif?  
   **A:** Berfungsi sebagai kondisi penghentian agar fungsi berhenti memanggil dirinya sendiri dan mencegah stack overflow.
2. **Q:** Apa bedanya Pass by Value dan Pass by Reference?  
   **A:** Pass by Value menyalin data (variabel asli tidak berubah), sedangkan Pass by Reference mengirim alamat memori (variabel asli berubah).
3. **Q:** Apa saja 2 langkah utama dalam induksi matematika?  
   **A:** Langkah Basis ($P(1)$ benar) dan Langkah Induksi ($P(k)$ benar $\implies P(k+1)$ benar).

#### Kuis Pilihan Ganda
1. Apa hasil sumasi dari $\sum_{k=1}^{100} k$?
   - A) 5000
   - B) 5050 *(Jawaban Benar)*
   - C) 5100
   - D) 10000
   *Penjelasan: Menggunakan rumus aritmatika $\frac{n(n+1)}{2} = \frac{100 \times 101}{2} = 5050$.*

2. Risiko utama menggunakan fungsi rekursif tanpa Base Case yang terdefinisi dengan baik adalah:
   - A) Memory Leak di Hard Disk
   - B) Stack Overflow / Infinite Loop *(Jawaban Benar)*
   - C) Sintaks Error pada Compiler
   - D) Variabel menjadi Null
   *Penjelasan: Pemanggilan rekursif berulang terus menumpuk stack frame di memori hingga batas Call Stack habis.*

---

## 8. Ringkasan & Buku Referensi

### Ringkasan Poin Kunci
1. Induksi Matematika digunakan untuk membuktikan kebenaran persamaan deret pada analisis algoritma melalui Langkah Basis dan Langkah Induksi.
2. Fungsi Rekursif memecah masalah besar menjadi sub-masalah serupa melalui pemanggilan modul sendiri.
3. Setiap fungsi rekursif wajib memiliki *Base Case* untuk mencegah perulangan tak terbatas dan kegagalan memori *Call Stack*.

### Buku Referensi
1. Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2022). *Introduction to Algorithms* (4th ed.). The MIT Press.
2. Sridhar, S. (2015). *Design and Analysis of Algorithms* (1st ed.). Oxford University Press.
