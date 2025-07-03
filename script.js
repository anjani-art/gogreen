// Variabel global untuk Firestore
let db;

// Pastikan DOM sudah dimuat sebelum mencoba mengakses elemen atau Firebase
document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi Firestore setelah Firebase app diinisialisasi di index.html
    // Objek `firebase` sudah tersedia secara global
    if (typeof firebase !== 'undefined' && firebase.firestore) {
        db = firebase.firestore();
        initializeAppFeatures();
    } else {
        console.error("Firebase SDK belum dimuat atau inisialisasi gagal. Pastikan koneksi internet dan konfigurasi Firebase di index.html benar.");
        alert("Terjadi kesalahan saat memuat aplikasi. Mohon coba refresh halaman atau cek koneksi internet Anda.");
    }
});


// Referensi Elemen DOM
const headerTitleEl = document.getElementById('headerTitle');
const backButtonEl = document.getElementById('backButton');
const homePageEl = document.getElementById('homePage');
const categoryGridEl = document.getElementById('categoryGrid');
const productListingsPageEl = document.getElementById('productListingsPage');
const productListingTitleEl = document.getElementById('productListingTitle');
const productListEl = document.getElementById('productList');
const productDetailPageEl = document.getElementById('productDetailPage');
const productNameEl = document.getElementById('productName');
const productCertificationsEl = document.getElementById('productCertifications');
const productIngredientsEl = document.getElementById('productIngredients');
const productProductionEl = document.getElementById('productProduction');
const productImpactEl = document.getElementById('productImpact');
const productDIYEl = document.getElementById('productDIY');

// Objek Data Produk Go Green (Data Awal untuk Populasi Firestore)
// Data ini HANYA digunakan untuk mengisi Firestore pertama kali.
const goGreenProductsData = {
    'Rumah Tangga': [
        {
            id: 'sabun-lerak',
            name: 'Sabun Cuci Piring Lerak Cair',
            desc: 'Dibuat dari buah lerak asli, agen pembersih alami dan 100% biodegradable. Aman bagi kulit dan ekosistem air.',
            details: {
                certifications: ['Eco-Certified', 'Biodegradable'],
                ingredients: 'Ekstrak buah lerak, air murni, minyak esensial lemon.',
                production: 'Diproses secara manual dengan minim energi. Limbah produksi dapat terurai dengan cepat.',
                impact: 'Mengurangi polusi air dan ketergantungan pada bahan kimia sintetis. Mengurangi limbah plastik dengan isi ulang.',
                diy: 'Anda bisa membuat sendiri cairan lerak dari buah lerak kering. Rebus dan saring! <br><br>Jika tidak ingin membuat sendiri, berikut contoh produk di Shopee: <a href="https://shopee.co.id/Sabun-Lerak-Cair-1-Liter-Alami-Organicenter-Deterjen-Cuci-Piring-Pakaian-Bayi-Batik-Clodi-Menspad-Pel-1000-ml-Zero-Waste-i.10077729.10746910519?sp_atk=d2460058-3da4-492a-977c-fabd67bbfe4d&xptdk=d2460058-3da4-492a-977c-fabd67bbfe4d" target="_blank" rel="noopener noreferrer" style="color:#6366F1; font-weight:600;">Sabun Lerak Cair (Link Eksternal)</a>'
            }
        },
        {
            id: 'pembersih-cuka',
            name: 'Pembersih Serbaguna Cuka & Lemon',
            desc: 'Formulasi alami berbasis cuka dan ekstrak lemon. Alternatif non-toksik untuk pembersih kimia.',
            details: {
                certifications: ['Natural-Ingredient'],
                ingredients: 'Cuka putih, air suling, minyak esensial lemon, baking soda.',
                production: 'Produksi rumahan/lokal dengan jejak karbon rendah.',
                impact: 'Menghindari paparan bahan kimia berbahaya, aman untuk keluarga dan hewan peliharaan, mengurangi polusi udara dalam ruangan.',
                diy: 'Campurkan cuka putih, air, dan beberapa tetes minyak esensial untuk pembersih kaca.'
            }
        },
    ],
    'Perawatan Diri': [
        {
            id: 'sabun-batang-kelapa',
            name: 'Sabun Batang Minyak Kelapa Organik',
            desc: 'Dibuat dengan minyak kelapa organik bersertifikat, tanpa pengawet atau pewangi sintetik, kemasan minimal.',
            details: {
                certifications: ['Organic Certified', 'Vegan'],
                ingredients: 'Minyak kelapa organik, air, sodium hydroxide (untuk saponifikasi), minyak esensial.',
                production: 'Metode saponifikasi dingin, tanpa panas berlebih, hemat energi.',
                impact: 'Mendukung pertanian kelapa organik, bebas mikroplastik dari sabun cair, kemasan kertas daur ulang.',
                diy: 'Resep sabun batangan DIY tersedia online, perhatikan keamanan penggunaan soda api. <br><br>Jika tidak ingin membuat sendiri, berikut contoh produk di Shopee: <a href="https://shopee.co.id/Sabun-Mandi-Herbal-VCO-Griya-Herbal-Untuk-menghaluskan-dan-hilangkan-flek-hitam-POM-NA-Halal-i.270303395.7970521397?sp_atk=d032d154-dd56-4164-a8bc-b37a6eee3efb&xptdk=d032d154-dd56-4164-a8bc-b37a6eee3efb" target="_blank" rel="noopener noreferrer" style="color:#6366F1; font-weight:600;">Sabun Mandi Herbal VCO (Link Eksternal)</a>'
            }
        },
        {
            id: 'sikat-gigi-bambu',
            name: 'Sikat Gigi Bambu',
            desc: 'Pegangan dari bambu yang biodegradable, mengurangi penggunaan plastik di kamar mandi.',
            details: {
                certifications: ['BPA-Free', 'Biodegradable Handle'],
                ingredients: 'Pegangan: Bambu Moso. Bulu sikat: Nylon-6 (dapat didaur ulang jika dipisahkan) atau serat arang bambu.',
                production: 'Produksi minimalis, bambu tumbuh cepat dan tidak memerlukan banyak air.',
                impact: 'Mengurangi limbah plastik global dari sikat gigi. Bambu adalah sumber daya terbarukan.',
                diy: 'Tidak dapat dibuat sendiri di rumah. <br><br>Berikut contoh produk sikat gigi bambu di Shopee: <a href="https://shopee.co.id/Pepsodent-Sikat-Gigi-Bambu-Natural-Soft-Isi-1-i.1517647103.28336356476?sp_atk=205d4165-3c67-4a62-9579-b1f20cc6fae8&xptdk=205d4165-3c67-4a62-9579-b1f20cc6fae8" target="_blank" rel="noopener noreferrer" style="color:#6366F1; font-weight:600;">Pepsodent Sikat Gigi Bambu (Link Eksternal)</a>'
            }
        }
    ],
    'Pakaian': [
        {
            id: 'kaus-katun-organik',
            name: 'Kaus Katun Organik',
            desc: 'Terbuat dari katun yang ditanam tanpa pestisida dan pupuk kimia, meminimalkan dampak lingkungan.',
            details: {
                certifications: ['GOTS Certified Organic Cotton', 'Fair Labor'],
                ingredients: '100% Katun Organik.',
                production: 'Ditanam tanpa bahan kimia berbahaya, mengurangi penggunaan air dan emisi. Proses pewarnaan ramah lingkungan.',
                impact: 'Meningkatkan kualitas tanah, mengurangi paparan pestisida bagi petani, mengurangi konsumsi air.',
                diy: 'Tidak dapat dibuat sendiri di rumah. <br><br>Berikut contoh produk kaus katun organik di Shopee: <a href="https://shopee.co.id/TONIQUE-Kaos-Katun-Organik-Wanita-Biru-BELLONA-Womens-Cotton-T-Shirt-i.953741345.23738667351?sp_atk=a598bf79-28ed-4bcd-bfe3-c3945d44468d&xptdk=205d4165-3c67-4a62-9579-b1f20cc6fae8&xptdk=205d4165-3c67-4a62-9579-b1f20cc6fae8" target="_blank" rel="noopener noreferrer" style="color:#6366F1; font-weight:600;">TONIQUE Kaos Katun Organik (Link Eksternal)</a>'
            }
        }
    ],
    'Kemasan': [
        {
            id: 'plastik-biodegradable',
            name: 'Kantong Plastik Biodegradable',
            desc: 'Terbuat dari pati singkong/jagung, terurai alami dalam waktu singkat tanpa meninggalkan mikroplastik.',
            details: {
                certifications: ['Compostable Certified (ASTM D6400)'],
                ingredients: 'Pati singkong/jagang, polimer nabati.',
                production: 'Diproduksi dari biomassa terbarukan, jejak karbon lebih rendah.',
                impact: 'Terurai sepenuhnya di lingkungan dalam waktu singkat (mis. 90 hari di fasilitas kompos), tidak menyumbang mikroplastik. Mengurangi ketergantungan pada plastik berbasis fosil.',
                diy: 'Tidak dapat dibuat sendiri di rumah. <br><br>Berikut contoh produk kantong plastik biodegradable di Shopee: <a href="https://shopee.co.id/Kantong-Singkong-Kresek-Ramah-Lingkungan-Cassava-T-Shirt-Bag-i.323057013.24634077620?sp_atk=0d4417c2-5b2c-452c-b654-ea8b9cd99b10&xptdk=0d4417c2-5b2c-452c-b654-ea8b9cd99b10" target="_blank" rel="noopener noreferrer" style="color:#6366F1; font-weight:600;">Kantong Singkong Kresek (Link Eksternal)</a>'
            }
        },
        {
            id: 'wadah-stainless',
            name: 'Wadah Makanan Stainless Steel',
            desc: 'Alternatif bebas plastik, tahan lama, dan dapat digunakan berulang kali untuk mengurangi limbah sekali pakai.',
            details: {
                certifications: ['Food-Grade Stainless Steel'],
                ingredients: 'Stainless Steel (Grade 304 atau 316).',
                production: 'Proses produksi energi intensif, namun produk sangat tahan lama dan dapat didaur ulang 100%.',
                impact: 'Pengganti ideal untuk plastik sekali pakai, sangat mengurangi limbah. Tahan lama (umur pakai puluhan tahun). Dapat didaur ulang tanpa kehilangan kualitas.',
                diy: 'Tidak dapat dibuat sendiri di rumah. <br><br>Berikut contoh produk wadah makanan stainless steel di Shopee: <a href="https://shopee.co.id/Panda-Home-Lunch-Box-Stainless-Sekat-3-FREE-Sendok-Dan-Sumpit-Kotak-Bekal-Makan-i.350552795.3677713347?sp_atk=5dfe6d80-06f7-4602-a9f6-394844b3daa2&xptdk=5dfe6d80-06f7-4602-a9f6-394844b3daa2" target="_blank" rel="noopener noreferrer" style="color:#6366F1; font-weight:600;">Panda Home Lunch Box (Link Eksternal)</a>'
            }
        },
        {
            id: 'tumbler-stainless',
            name: 'Tumbler Stainless Steel',
            desc: 'Tumbler tahan panas/dingin yang mengurangi penggunaan gelas sekali pakai. Ideal untuk gaya hidup zero waste.',
            details: {
                certifications: ['BPA-Free', 'Food-Grade Stainless Steel'],
                ingredients: 'Stainless Steel (mis. SUS304).',
                production: 'Produksi standar industri dengan fokus pada durabilitas untuk penggunaan jangka panjang.',
                impact: 'Mengurangi signifikan limbah gelas plastik/kertas sekali pakai. Tahan lama dan dapat didaur ulang.',
                diy: 'Tidak dapat dibuat sendiri di rumah. <br><br>Berikut contoh produk tumbler stainless steel di Shopee: <a href="https://shopee.co.id/Eatkit-Tumbler-Stainless-Steel-320ml-600ml-Tumbler-Kopi-Tumbler-Tahan-Panas-Dingin-24-Jam-i.1113470230.24322289831?sp_atk=c882ce4-f563-4b38-9cce-a3681a6722c1&xptdk=c882ce4-f563-4b38-9cce-a3681a6722c1" target="_blank" rel="noopener noreferrer" style="color:#6366F1; font-weight:600;">Eatkit Tumbler Stainless Steel (Link Eksternal)</a>'
            }
        },
    ],
    'Pertanian & Kebun': [
        {
            id: 'pupuk-eco-enzyme',
            name: 'Pupuk Cair Eco Enzyme',
            desc: 'Cairan organik serbaguna dari fermentasi sisa buah/sayuran, efektif sebagai pupuk tanaman dan pembersih alami.',
            details: {
                certifications: ['Organik', 'Biodegradable'],
                ingredients: 'Fermentasi kulit buah/sayuran, gula, air bersih.',
                production: 'Dibuat melalui proses fermentasi alami selama minimal 3 bulan.',
                impact: 'Mengurangi limbah organik rumah tangga, mengurangi penggunaan pupuk kimia, menyuburkan tanah, dan dapat membersihkan saluran air.',
                diy: 'Eco Enzyme dapat dibuat sendiri di rumah dengan mudah menggunakan sisa buah/sayuran, gula, dan air. Banyak panduan DIY tersedia online! <br><br>Jika tidak ingin membuat sendiri, berikut contoh produk Pupuk Cair Eco Enzyme di Shopee: <a href="https://shopee.co.id/ECO-ENZYME-1000ml-(1-liter)-Cairan-Organik-Beragam-Manfaat-i.1202248398.28674252673?sp_atk=136f5098-6b52-472b-aaaa-df90479ad4a0&xptdk=136f5098-6b52-472b-aaaa-df90479ad4a0" target="_blank" rel="noopener noreferrer" style="color:#6366F1; font-weight:600;">ECO ENZYME 1 Liter (Link Eksternal)</a>'
            }
        }
    ]
};

// State Aplikasi
let currentPage = 'homePage';
let currentCategory = '';

// Fungsi Navigasi Halaman
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    currentPage = pageId;

    if (pageId === 'homePage') {
        headerTitleEl.textContent = 'EcoGlow';
        backButtonEl.style.display = 'none';
    } else {
        backButtonEl.style.display = 'block';
    }
}

// Handler Tombol Kembali
backButtonEl.addEventListener('click', () => {
    if (currentPage === 'productListingsPage') {
        showPage('homePage');
    } else if (currentPage === 'productDetailPage') {
        showProductListings(currentCategory);
    }
});

// Fungsi untuk menampilkan Kategori
function renderCategories() {
    categoryGridEl.innerHTML = ''; // Bersihkan kategori sebelumnya
    for (const category in goGreenProductsData) {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('category-card');
        let iconClass = '';
        // Contoh ikon berdasarkan kategori (Anda bisa menambahkan lebih banyak)
        switch (category) {
            case 'Rumah Tangga': iconClass = 'fas fa-house-chimney'; break;
            case 'Perawatan Diri': iconClass = 'fas fa-spa'; break;
            case 'Pakaian': iconClass = 'fas fa-tshirt'; break;
            case 'Kemasan': iconClass = 'fas fa-box-open'; break;
            case 'Pertanian & Kebun': iconClass = 'fas fa-seedling'; break;
            default: iconClass = 'fas fa-leaf'; break;
        }
        categoryCard.innerHTML = `<i class="${iconClass}"></i><h3>${category}</h3>`;
        categoryCard.addEventListener('click', () => showProductListings(category));
        categoryGridEl.appendChild(categoryCard);
    }
}

// Fungsi untuk menampilkan Daftar Produk berdasarkan Kategori (Mengambil dari Firestore)
async function showProductListings(category) {
    currentCategory = category;
    productListingTitleEl.textContent = `Kategori: ${category}`;
    productListEl.innerHTML = ''; // Bersihkan daftar produk sebelumnya

    try {
        // Menggunakan API Compatibility Firebase Firestore
        // `collection` adalah metode dari instance firestore `db`
        const productsRef = db.collection('goGreenProducts');
        const querySnapshot = await productsRef.where('category', '==', category).get(); // Menggunakan `.where()` dan `.get()`

        if (querySnapshot.empty) {
            productListEl.innerHTML = '<p style="text-align: center; color: var(--text-light); margin-top: 30px;">Tidak ada produk di kategori ini.</p>';
        } else {
            querySnapshot.forEach(doc => {
                const product = doc.data();
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                productItem.innerHTML = `
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.desc}</p>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                `;
                productItem.addEventListener('click', () => showProductDetail(product));
                productListEl.appendChild(productItem);
            });
        }
        showPage('productListingsPage');
        headerTitleEl.textContent = category; // Ganti judul header dengan nama kategori
    } catch (error) {
        console.error("Error fetching products: ", error);
        productListEl.innerHTML = '<p style="text-align: center; color: red; margin-top: 30px;">Terjadi kesalahan saat memuat produk.</p>';
    }
}


// Fungsi untuk menampilkan Detail Produk
function showProductDetail(product) {
    showPage('productDetailPage');
    productDetailTitleEl.textContent = 'Detail Produk';
    headerTitleEl.textContent = product.name; // Ganti judul header dengan nama produk di bar header

    productNameEl.textContent = product.name;

    // Tampilkan sertifikasi
    productCertificationsEl.innerHTML = '';
    if (product.details.certifications && product.details.certifications.length > 0) {
        product.details.certifications.forEach(cert => {
            const span = document.createElement('span');
            span.classList.add('certification-tag');
            span.textContent = cert;
            productCertificationsEl.appendChild(span);
        });
    } else {
        productCertificationsEl.innerHTML = '<span class="certification-tag">Tidak Ada Sertifikasi Khusus</span>';
    }

    productIngredientsEl.innerHTML = product.details.ingredients || 'Tidak ada informasi.';
    productProductionEl.innerHTML = product.details.production || 'Tidak ada informasi.';
    productImpactEl.innerHTML = product.details.impact || 'Tidak ada informasi.';
    // Gunakan innerHTML karena diy sekarang mengandung tag <a>
    productDIYEl.innerHTML = product.details.diy || 'Tidak ada informasi.';
}

// Fungsi untuk mengisi data produk ke Firestore
// JALANKAN INI HANYA SEKALI untuk mempopulasi database Anda.
async function populateGoGreenProductsToFirestore() {
    console.log("Memulai populasi data ke Firestore...");
    for (const category in goGreenProductsData) {
        for (const product of goGreenProductsData[category]) {
            try {
                // Tambahkan kategori ke objek produk sebelum disimpan
                const productToSave = { ...product, category: category };
                // Menggunakan API Compatibility Firebase Firestore
                await db.collection('goGreenProducts').doc(product.id).set(productToSave); // Menggunakan `.doc()` dan `.set()`
                console.log(`Produk "${product.name}" berhasil ditambahkan/diperbarui.`);
            } catch (error) {
                console.error(`Gagal menambahkan produk "${product.name}":`, error);
            }
        }
    }
    console.log("Selesai populasi data ke Firestore.");
}

// Inisialisasi Fitur Aplikasi
function initializeAppFeatures() {
    renderCategories(); // Tampilkan kategori saat aplikasi pertama kali dimuat

    // --- PENTING: POPULASI DATA KE FIRESTORE ---
    // Jalankan fungsi populateGoGreenProductsToFirestore() HANYA SEKALI saat pertama kali setup
    // atau jika ada perubahan data mayor yang perlu disinkronkan ke database.
    // Setelah data ada di Firestore dan sudah sesuai, KOMENTARI atau HAPUS baris ini
    // untuk menghindari penulisan ulang data yang tidak perlu setiap kali aplikasi dibuka.
    // populateGoGreenProductsToFirestore();
    // --- AKHIR PENTING ---
}


// Inisialisasi PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Path service worker (tanpa garis miring di depan karena di root folder)
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker terdaftar:', registration);
            })
            .catch(error => {
                console.error('Pendaftaran Service Worker gagal:', error);
            });
    });
}
