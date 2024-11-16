# Recipe Management Backend

Backend API untuk sistem manajemen resep makanan, dibangun menggunakan **Express**, **Prisma**, dan **MySQL** sebagai database utama. Sistem ini mencakup autentikasi pengguna, pengelolaan resep, dan mendukung peran pengguna (admin dan user biasa).

## Fitur Utama

- **Autentikasi JWT**: Pengguna dapat mendaftar dan masuk menggunakan token JWT untuk mengakses API.
- **Pengelolaan Resep**: CRUD untuk resep makanan, memungkinkan admin untuk menambahkan, mengedit, atau menghapus resep.
- **Manajemen Pengguna**: Mendukung peran pengguna dengan izin akses yang berbeda.
- **Upload Gambar**: Upload gambar untuk resep menggunakan `multer`.

## Teknologi yang Digunakan

- **Express**: Framework backend untuk Node.js.
- **Prisma**: ORM untuk integrasi dengan database MySQL.
- **JWT (jsonwebtoken)**: Untuk autentikasi berbasis token.
- **bcrypt**: Enkripsi kata sandi pengguna.
- **Multer**: Untuk menangani upload file (gambar resep).
- **dotenv**: Untuk manajemen variabel lingkungan.
- **Express Validator**: Untuk validasi input.

## Struktur Folder

```plaintext

.
├── prisma                # Konfigurasi Prisma client
│   ├── client
│   ├── schema.prisma
├── src
│   ├── controllers       # Controller untuk menangani request
│   ├── middleware        # Middleware untuk autentikasi dan otorisasi
│   ├── routes            # Definisi endpoint
│   └── utils             # Fungsi utility
├── .env                  # Variabel lingkungan
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```

## Persayratan

- **Node.js** v16 ke atas
- **MySQL** server

## API Endpoints

<p>Daftar rute yang tersedia: </p>

| Metho  |          Endpoint           |                    Description |
| :----- | :-------------------------: | -----------------------------: |
| POST   |     `/api/auth/signup`      |        Mendaftar pengguna baru |
| POST   |     `/api/auth/signin`      |                 Login pengguna |
| POST   |     `/api/auth/signout`     |                         Logout |
| POST   |     `/api/auth/profile`     |                 Update Profile |
| POST   | `/api/auth/forgot-passowrd` |                 Reset Password |
| GET    |       `/api/recipes`        | Mendapatkan daftar semua resep |
| POST   |       `/api/recipes`        |         Menambahkan resep baru |
| PUT    |     `/api/recipes/:id`      |  Mengedit resep berdasarkan ID |
| DELETE |     `/api/recipes/:id`      | Menghapus resep berdasarkan ID |
| DELETE |     `/api/recipes/:id`      | Menghapus resep berdasarkan ID |

## Instalasi

1. Clone repo ini dan masuk ke dalam direktori:

```bash
git clone https://github.com/AhmadJanuarr/recipe-server.git
cd recipe-server
```

2. Install dependencies:

```bash
npm install
```

3. Buat file .env di root proyek dan tambahkan konfigurasi berikut:

```bash
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
JWT_SECRET="your_jwt_secret"
```

4. Jalankan migrasi Prisma untuk membuat tabel di database:

```bash
npx prisma migrate dev
```
