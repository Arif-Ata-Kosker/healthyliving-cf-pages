# Fitness Koçluğu Web Sitesi

Bu proje, fitness koçluğu hizmetlerini tanıtan bir kişisel web sitesidir. Anasayfa, Hakkımızda, Hizmetler, PDF Kitaplar ve Hesaplayıcılar bölümlerini içerir. Responsive tasarımı sayesinde hem masaüstü hem de mobil cihazlarda optimum görüntüleme sağlar.

## Proje Yapısı

```
fitness-website
├── index.html          # Ana sayfa
├── assets
│   ├── css
│   │   └── style.css   # CSS stilleri
│   ├── js
│   │   └── main.js     # JavaScript fonksiyonları
│   ├── images          # Görseller dizini
│   │   ├── books       # PDF kitap kapakları
│   │   └── ...         # Diğer görseller
│   └── pdf             # İndirilebilir PDF dosyaları
│       ├── antrenman   # Antrenman PDF rehberleri
│       └── beslenme    # Beslenme PDF rehberleri
├── .nojekyll           # GitHub Pages için Jekyll işlemesini devre dışı bırakır
├── .gitignore          # Versiyon kontrolünde yok sayılacak dosyalar
└── README.md           # Proje dokümantasyonu
```

## Kurulum ve Dağıtım

1. GitHub Pages'te yayınlamak için:
   - GitHub hesabınıza repo olarak yükleyin
   - Reponuzun "Settings > Pages" bölümünde:
     - Source: "Deploy from a branch" seçin
     - Branch: "main" seçin
     - Folder: "/" (kök dizin) seçin
   - Save butonuna tıklayın
   - `.nojekyll` dosyasının kök dizinde olduğundan emin olun

2. Yerel olarak test etmek için:
   - Repoyu bilgisayarınıza klonlayın
   - `index.html` dosyasını bir web tarayıcısında açın

## Özellikler

- Mobil uyumlu responsive tasarım
- Ücretsiz indirilebilir PDF kaynaklar
- Fitness hesaplayıcıları (BMI, kalori ihtiyacı, vb.)
- Modern ve kullanıcı dostu arayüz
- Sosyal medya entegrasyonu

## GitHub Pages Hata Giderme

Eğer GitHub Pages'ta site görüntülenmiyorsa:
1. Ayarlarda Branch olarak "main" ve Folder olarak "/" (kök dizin) seçili olduğundan emin olun
2. `.nojekyll` dosyasının kök dizinde bulunduğunu kontrol edin
3. Dosya yollarının doğru olduğundan emin olun (örn: `./assets` yerine `assets` kullanın)