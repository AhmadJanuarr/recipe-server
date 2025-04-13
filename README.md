# Dapur Tradisional Backend v.1.1.1

Backend API untuk sistem manajemen resep makanan, dibangun menggunakan **Express**, **Prisma**, dan **Supabase (PostgreSQL)** sebagai database utama. Sistem ini mencakup autentikasi pengguna, pengelolaan resep, dan mendukung peran pengguna (admin dan user biasa).

## Fitur Utama

- **Autentikasi JWT**: Pengguna dapat mendaftar dan masuk menggunakan token JWT untuk mengakses API.
- **Pengelolaan Resep**: CRUD untuk resep makanan, memungkinkan admin untuk menambahkan, mengedit, atau menghapus resep.
- **Manajemen Pengguna**: Mendukung peran pengguna dengan izin akses yang berbeda.
- **Upload Gambar**: Upload Gambar: Upload gambar untuk resep menggunakan multer dan disimpan di `Supabase Storage`.

## Teknologi yang Digunakan

- **Express**: Framework backend untuk Node.js.
- **Prisma**: ORM untuk integrasi dengan database PostgreSQL.
- **JWT (jsonwebtoken)**: Untuk autentikasi berbasis token.
- **Supabase**: Layanan backend untuk database dan penyimpanan file.

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

## API Endpoints


<p>Daftar rute yang tersedia: </p>

| Metho  |          Endpoint           |                    Description |
| :----- | :-------------------------: | -----------------------------: |
| `POST`   |     `/api/auth/signup`      |        Mendaftar pengguna baru |
| `POST`   |     `/api/auth/signin`      |                 Login pengguna |
| `POST`   |     `/api/auth/signout`     |                         Logout |
| `POST`   |     `/api/auth/profile`     |                 Update Profile |
| `POST`   | `/api/auth/forgot-passowrd` |                 Reset Password |
| `GET`    |       `/api/recipes`        | Mendapatkan daftar semua resep |
| `POST`   |       `/api/recipes`        |         Menambahkan resep baru |
| `GET` |     `/api/recipes/:recipeName`      | Mendapatkan resep berdsarkan nama|
| `PUT`    |     `/api/recipes/:id`      |  Mengedit resep berdasarkan ID |
| `DELETE` |     `/api/recipes/:id`      | Menghapus resep berdasarkan ID |
| `POST` |     `/recipes/favorite/:recipeId`      | Menambahkan resep ke favorite |
| `DELETE` |     `/recipes/favorite/:recipeId`      | Menghapus resep dari favorite |

### Example API Request Body

<h4>Request Resep body</h4>

```http
GET /api/recipes
```
<h4>Response Resep body</h4>

**Status 200**

```json

    {
        "success": true,
        "message": "Berhasil mengambil resep",
        "data": [
            {
                "id": 1,
                "title": "Cireng(Aci Goreng)",
                "description": "Cireng adalah makanan ringan khas Sunda yang terbuat dari tepung tapioka yang digoreng hingga renyah di luar namun tetap kenyal di dalam.",
                "tips": "Untuk hasil yang lebih renyah, gunakan air panas saat mencampur adonan dan biarkan adonan sedikit dingin sebelum dibentuk.",
                "image": "https://esgmtxjujbrtwrodbhci.supabase.co/storage/v1/object/public/images/1740127808983-cireng.png",
                "difficulty": "Mudah",
                "category": "Makanan_Ringan",
                "createdAt": "2025-02-21T08:50:10.260Z",
                "updatedAt": "2025-02-21T08:50:10.260Z",
                "userId": null,
                "ingredients": [
                    {
                        "id": 1,
                        "name": "200g tepung tapioka",
                        "recipeId": 1
                    },
                    {
                        "id": 2,
                        "name": "200g tepung tapioka",
                        "recipeId": 1
                    },
                    {
                        "id": 3,
                        "name": "2 siung bawang putih, haluskan",
                        "recipeId": 1
                    },
                    {
                        "id": 4,
                        "name": "1 sdt garam",
                        "recipeId": 1
                    },
                    {
                        "id": 5,
                        "name": "1/2 sdt merica bubuk",
                        "recipeId": 1
                    },
                    {
                        "id": 6,
                        "name": "1 batang daun bawang, iris halus",
                        "recipeId": 1
                    },
                    {
                        "id": 7,
                        "name": "150ml air panas",
                        "recipeId": 1
                    },
                    {
                        "id": 8,
                        "name": "Minyak untuk menggoreng",
                        "recipeId": 1
                    }
                ],
                "steps": [
                    {
                        "id": 1,
                        "description": "Campurkan tepung tapioka, tepung terigu, bawang putih, garam, merica, dan daun bawang dalam wadah.",
                        "recipeId": 1
                    },
                    {
                        "id": 2,
                        "description": "Tuangkan air panas sedikit demi sedikit sambil diaduk hingga membentuk adonan yang bisa dipulung.",
                        "recipeId": 1
                    },
                    {
                        "id": 3,
                        "description": "Bentuk adonan menjadi bulatan pipih.",
                        "recipeId": 1
                    },
                    {
                        "id": 4,
                        "description": "Panaskan minyak dan goreng cireng hingga renyah keemasan.",
                        "recipeId": 1
                    },
                    {
                        "id": 5,
                        "description": "Sajikan dengan saus sambal atau bumbu rujak.",
                        "recipeId": 1
                    }
                ]
            }
       ]
    }
```

**Status 400**

```json
    {
        "success": false,
        "message": "Not Found 🤷‍♂️"
    }
```

<h4>Request Detail Resep body</h4>

```http
GET /api/recipes/combro
```

<h4>Response Detail Resep body</h4>

**Status 200**

```json
    {
    "success": true,
    "message": "Resep berhasil ditemukan",
    "data": {
        "id": 2,
        "title": "Combro",
        "description": "Combro adalah makanan ringan khas Jawa Barat yang berisi oncom pedas dan dibalut dengan parutan singkong.",
        "tips": "Peras singkong parut sebelum digunakan agar tidak terlalu berair dan mudah dibentuk.",
        "image": "https://esgmtxjujbrtwrodbhci.supabase.co/storage/v1/object/public/images/1740190291044-combro.png",
        "difficulty": "Sedang",
        "category": "Makanan_Ringan",
        "createdAt": "2025-02-22T02:11:33.544Z",
        "updatedAt": "2025-02-22T02:11:33.544Z",
        "userId": null,
        "ingredients": [
            {
                "id": 9,
                "name": "500g singkong parut",
                "recipeId": 2
            },
            {
                "id": 10,
                "name": "100g kelapa parut",
                "recipeId": 2
            },
            {
                "id": 11,
                "name": "1 sdt garam",
                "recipeId": 2
            },
            {
                "id": 12,
                "name": "1 sdt gula pasir",
                "recipeId": 2
            },
            {
                "id": 13,
                "name": "Minyak untuk menggoreng",
                "recipeId": 2
            },
            {
                "id": 14,
                "name": "150g oncom, hancurkan",
                "recipeId": 2
            },
            {
                "id": 15,
                "name": "2 siung bawang putih, cincang",
                "recipeId": 2
            },
            {
                "id": 16,
                "name": "3 butir bawang merah, iris halus",
                "recipeId": 2
            }
        ],
        "steps": [
            {
                "id": 6,
                "description": "Campurkan singkong, kelapa, garam, dan gula, aduk rata.",
                "recipeId": 2
            },
            {
                "id": 7,
                "description": "Tumis bawang putih, bawang merah, dan cabai hingga harum. Tambahkan oncom, garam, dan gula, aduk rata.",
                "recipeId": 2
            },
            {
                "id": 8,
                "description": "Ambil sedikit adonan singkong, pipihkan, beri isian, lalu bentuk lonjong.",
                "recipeId": 2
            },
            {
                "id": 9,
                "description": "Goreng dalam minyak panas hingga kecoklatan.",
                "recipeId": 2
            },
            {
                "id": 10,
                "description": "Sajikan selagi hangat.",
                "recipeId": 2
            }
        ],
        "nutrition": {
            "id": 2,
            "calories": 250,
            "protein": 4,
            "fat": 14,
            "carbs": 30,
            "recipeId": 2
        }
    }
}
```

**Status 404**

```json
    {
        "success": false,
        "message": "Resep tidak ditemukan"
    }
```

## Instalasi

1. Clone repo ini dan masuk ke dalam direktori:

```bash
git clone https://github.com/AhmadJanuarr/recipe-server.git
cd recipe-server
```
****
2. Install dependencies:

```bash
npm install
```

3. Buat file .env di root proyek dan tambahkan konfigurasi berikut:

```bash

# Connect to Supabase via connection pooling with Supavisor.
DATABASE_URL="postgresql://postgres.esgmtxjujbrtwrodbhci:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations.
DIRECT_URL="postgresql://postgres.esgmtxjujbrtwrodbhci:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

JWT_ACCESS_SECRET=YOUR-ACCESS
JWT_REFRESH_SECRET=YOUR-REFRESH  
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Jalankan migrasi Prisma untuk membuat tabel di database:

```bash
npx prisma db push
```

5. Jalankan server:
```bash
npm run dev
```
