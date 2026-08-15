# **SOLUTECH TECHNICAL TEST** 

Backend Developer - Next.js · Prisma · PostgreSQL _Format: Take-home - dikerjakan di local, dikumpulkan via GitHub_ 

## **1. Pengantar** 

Test ini bertujuan menilai kemampuan kandidat dalam membangun backend website yang rapi, terstruktur, dan production-ready menggunakan Next.js, Prisma, dan PostgreSQL. Kami lebih menghargai kualitas kode, kebenaran business logic, dan keamanan dibanding banyaknya fitur. 

Kerjakan sesuai kemampuan terbaik. Jika ada bagian yang tidak sempat diselesaikan, tuliskan asumsi dan rencananya di README - hal itu tetap kami nilai. 

## **2. Studi Kasus** 

Bangun sebuah REST API sederhana untuk modul inti sebuah toko online (e-commerce): pengelolaan product dan pembuatan order. Skalanya dibuat kecil, namun struktur dan kualitas kode diharapkan mencerminkan project production. 

Test ini berfokus pada sisi backend, sehingga seluruh endpoint cukup diuji melalui Postman. Membuat frontend sederhana untuk bagian admin (mis. management product) bersifat opsional dan menjadi nilai tambah dalam penilaian (lihat bagian 5). 

## **3. Tech Stack (Wajib)** 

- Next.js (App Router, route handlers) dengan TypeScript. 

- Prisma (ORM) di atas PostgreSQL. 

- Arsitektur berlapis (route handler, service, dan repository). 

- Input validation di setiap endpoint (boleh menggunakan library, misalnya Zod). 

## **4. Requirement Wajib** 

Desain endpoint (penamaan, struktur, dan HTTP method) dibebaskan, selama dapat mendukung seluruh requirement di bawah ini. 

### **Authentication** 

- Mekanisme login yang menghasilkan JWT (boleh via httpOnly cookie atau bearer token). 

- Fitur product dan order hanya dapat diakses setelah login. 

- Pengujian endpoint yang protected dilakukan melalui Postman dengan menyertakan token JWT hasil login (mis. pada header Authorization). 

- Register opsional, atau cukup memakai user yang di-seed. 

### **Product** 

- CRUD product (create, read (list dan detail), update, serta soft delete). 

- List product yang mendukung pagination dan search berdasarkan nama. 

Solutech Technical Test - Backend Developer  |  Halaman 1 

### **Order** 

- Pembuatan order yang menerima daftar product beserta quantity. 

- Saat order dibuat, kurangi stok product dan hitung total harga di dalam satu database transaction. 

- Menampilkan daftar order milik user yang sedang login (bukan milik semua user). 

### **Arsitektur & Kualitas** 

- Terapkan layered architecture dengan pemisahan jelas antara route handler, service, dan repository. 

- Validasi seluruh input dan kembalikan HTTP status code yang sesuai (mis. 200/201/400/401/404/409/500). 

- Error handling yang konsisten di setiap endpoint. 

### **Database** 

- Sertakan file SQL berisi perintah create table. 

- Sediakan seed/data awal melalui Prisma seed (wajib, minimal 1 user dan beberapa product). 

- Saat penilaian, kami akan menjalankan repository di local, menjalankan command SQL create table di database lokal, menjalankan seed, lalu menghubungkannya ke project. Pastikan langkah ini dijelaskan di README. 

### **Konfigurasi** 

- Sertakan file .env.example berisi variabel yang dibutuhkan. 

- Jelaskan nilai variabel tersebut di README, sehingga website dapat dijalankan tanpa perlu mengirim file .env secara terpisah. 

## **5. Nilai Tambah (Opsional)** 

Bagian berikut tidak wajib. Mengerjakannya menjadi nilai tambah, namun tidak mengerjakannya tidak mengurangi kelayakan kandidat. 

- Caching pada endpoint list product menggunakan Redis. 

- Unit atau integration test. 

- Rate limiting atau request logging. 

- Membuat frontend sederhana untuk bagian admin guna melakukan CRUD (mis. management product). 

## **6. Yang Dikumpulkan (Deliverables)** 

1. Link repository GitHub - repository wajib dibuat public dan kirimkan link-nya. 

2. Website dapat dijalankan di local dengan mengikuti README (tanpa konfigurasi rumit). 

3. File SQL untuk create table beserta seed (Prisma) di dalam repository. 

4. Postman collection (file .json) berisi seluruh endpoint beserta contoh request, termasuk contoh penyertaan token untuk endpoint yang protected. 

5. README berisi: penjelasan singkat tentang project/repository, cara setup dan menjalankan di local (termasuk konfigurasi database via .env, command create table SQL, dan perintah seed Prisma), keputusan teknis dan asumsi, daftar fitur yang selesai/belum, serta estimasi waktu pengerjaan. 

Solutech Technical Test - Backend Developer  |  Halaman 2 

## **7. Ekspektasi Kami** 

Secara umum kami menilai struktur dan kerapian kode, kebenaran business logic (terutama stok dan transaction), keamanan (auth dan penanganan input), desain database, serta kualitas dokumentasi dan penjelasan tertulis kandidat. Solusi yang sederhana namun benar dan rapi lebih dihargai daripada yang rumit tetapi berantakan. 

Kami menilai keputusan dan trade-off, bukan kesempurnaan. Tuliskan alasan di README jika ada jalan pintas yang diambil karena keterbatasan waktu. 

## **8. Aturan & Catatan** 

- Boleh menggunakan library atau AI tools, tetapi kandidat harus paham dan bisa menjelaskan kode yang ditulis. 

- Commit secara bertahap ke GitHub. Kami melihat history commit sebagai indikator proses berpikir. 

**Selamat mengerjakan!** 

Solutech Technical Test - Backend Developer  |  Halaman 3 

