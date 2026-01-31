## Mihrali Cafe · QR Menü Sistemi

Restoran yöneticisinin kategorileri, ürünleri ve masa bazlı QR bağlantılarını tek panelden yönetebilmesi için hazırlanan Next.js tabanlı uygulama.

### Başlıca Özellikler

- NextAuth ile korunan yönetici paneli (`/admin`)
- Kategori ve ürün CRUD işlemleri, öne çıkarma ve görünürlük kontrolü
- Masa/slug yönetimi, otomatik QR oluşturma ve bağlantı kopyalama
- Misafirler için masa bazlı menü sayfası (`/menu/[slug]`)
- Prisma + SQLite veritabanı

### Kurulum

1. Bağımlılıkları kurun

```bash
npm install
```

2. Ortam değişkenlerini `.env` dosyasında tanımlayın

```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:4000"
NEXT_PUBLIC_APP_URL="http://localhost:4000"
NEXTAUTH_SECRET="rastgele-bir-deger"
ADMIN_EMAIL="admin@mihralicafe.com"
ADMIN_PASSWORD="sifre-veya-bcrypt-hashi"
RESTAURANT_NAME="Mihrali Cafe"
UPLOADTHING_SECRET="uploadthing-dashboarddaki-secret"
UPLOADTHING_APP_ID="uploadthing-dashboarddaki-app-id"
```

> `ADMIN_PASSWORD` değeri düz metin ya da bcrypt hash olabilir. Hash kullanmak için değeri `bcryptjs` ile üretip burada saklayın.
>
> UploadThing anahtarları için https://uploadthing.com/dashboard adresinden bir uygulama oluşturmanız gerekir; dosyalar `utfs.io` üzerinden servis edilir.

3. Veritabanını hazırlayın

```bash
npx prisma migrate dev
```

4. Geliştirme sunucusunu 4000 portundan başlatın

```bash
npm run dev -- --port 4000
```

### Yönetici Paneli Akışı

1. `/login` sayfasından `.env`’de tanımladığınız bilgilerle giriş yapın.
2. `/admin` içinde:
   - Sol sütundan yeni kategori ekleyin, var olanları düzenleyin veya silin.
   - Ürün formundan fiyat, görsel ve açıklama girerek ürünleri kategorilere bağlayın.
   - Masa formundan slug belirleyip masaları oluşturun; her masa kartında QR ve kopyalama seçenekleri bulunur.

### QR Kodları

- Paneldeki her masa kartı, `NEXT_PUBLIC_APP_URL/menu/[slug]` adresini QR olarak oluşturur.
- “QR linkini kopyala” butonu bağlantıyı panoya yazar; “Menüyü aç” bağlantısı masa sayfasını yeni sekmede açar.
- Hazır bir örnek görmek için `/menu/demo-masa` ziyaret edilebilir.

### Faydalı Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev -- --port 4000` | Geliştirme sunucusunu 4000’de başlatır |
| `npm run build` | Production derlemesi |
| `npm run start` | Production derlemesini çalıştırır |
| `npm run lint` | ESLint denetimi |
| `npx prisma studio` | Verileri grafik arayüzle düzenleyin |

### Notlar

- Proje Next.js 16 (App Router) ve Tailwind CSS kullanır.
- Görsel alanına yerel dosya yerine URL verilir; dosya yükleme entegre değildir.
- Varsayılan veriler boş olduğunda misafir menüsü demo içerik gösterir; yönetici panelinden veri girildiğinde gerçek içerik otomatik gelir.
