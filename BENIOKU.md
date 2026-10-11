# Jarvis Maskot Projesi — Öğrenci Rehberi (web sürümü)

Bu klasör, rehberin GitHub Pages ile yayınlanacak web sürümüdür. Hiçbir kurulum ya da derleme gerektirmez: bütün dosyalar hazırdır, bağlantılar göreli olduğu için hem ayrı bir depoda hem de mevcut bir sitenin alt klasöründe çalışır.

## Klasör yapısı

| Yol | İçinde ne var |
| --- | --- |
| `index.html` | Rehberin tamamı (tek sayfa) |
| `css/stil.css` | Görünüm, renkler, animasyonlar, yazdırma ayarları |
| `js/site.js` | Kopyala düğmeleri, kutucuk kaydı, içindekiler, karakter vitrini |
| `gorseller/` | Ekran görüntüleri ve şekiller |
| `maskotlar/` | 8 karakterin SVG çizimleri |
| `fontlar/` | Lexend yazı tipi (SIL Open Font License, `LISANS-lexend.txt`) |
| `indir/` | Rehberin Word sürümü |
| `.nojekyll` | GitHub'ın dosyaları olduğu gibi yayınlaması için boş dosya; silme |

## Yol 1: Yeni bir depoda yayınla (tarayıcıyla, komut gerekmez)

1. github.com'da oturum aç, sağ üstteki **+** → **New repository**.
2. Ad olarak örneğin `jarvis-rehber` yaz, **Public** seç, **Create repository**.
3. Açılan sayfada **uploading an existing file** bağlantısına tıkla.
4. Bu klasörün **içindeki** her şeyi (index.html, css, js, gorseller, maskotlar, fontlar, indir, .nojekyll) sürükleyip bırak. Klasörün kendisini değil, içindekileri sürükle.
   - `.nojekyll` gizli dosya olduğu için görünmeyebilir. Dosya Gezgini'nde **Görünüm → Göster → Gizli öğeler**'i aç.
5. Alttaki **Commit changes** düğmesine bas.
6. Deponun **Settings → Pages** bölümünde **Source: Deploy from a branch**, **Branch: main**, klasör **/ (root)** seç, **Save**.
7. 1–2 dakika sonra adres sayfanın üstünde görünür: `https://KULLANICI-ADIN.github.io/jarvis-rehber/`

## Yol 2: Mevcut bir sitenin alt klasörü olarak yayınla

Örneğin Yapay Zekâ Ders Kütüphanesi deposunda `jarvis` adında bir klasör aç ve bu klasörün içindekileri oraya yükle. Adres şöyle olur: `https://KULLANICI-ADIN.github.io/DEPO-ADI/jarvis/`

## Yol 3: git ile (PowerShell, normal pencere, yönetici gerekmez)

Bu klasörde, komutları tek tek yaz:

```powershell
git init
git add .
git commit -m "Jarvis rehberi web sürümü"
git branch -M main
git remote add origin https://github.com/KULLANICI-ADIN/jarvis-rehber.git
git push -u origin main
```

Sonra Yol 1'deki 6. adımla Pages'i aç.

## Güncellemek

Değişen dosyaları aynı yere yeniden yükle (aynı adlı dosyaların üzerine yazılır). Tarayıcı eski sürümü gösterirse sayfayı **Ctrl + F5** ile yenile.

## Notlar

- Öğrencilerin işaretlediği kutucuklar yalnızca kendi tarayıcılarında (localStorage) saklanır; sunucuya hiçbir şey gönderilmez.
- Sayfa internet bağlantısı olmadan da açılır: `index.html` dosyasına çift tıklamak yeterli.
- Yazdırmak için tarayıcıda **Ctrl + P**; menüler ve düğmeler otomatik gizlenir.
