
# Supabase Kurulum ve Yapılandırma Rehberi

Bu döküman, projenizin veritabanı ve kimlik doğrulama işlemleri için Supabase'i nasıl doğru şekilde yapılandıracağınızı açıklamaktadır.

## Çevre Değişkenleri (Environment Variables) Nelerdir?
React/Vite projelerinde hassas verileri (API anahtarları gibi) doğrudan kod içerisine yazmak yerine `.env` adlı özel dosyalarda tutarız.

Projenizin çalışabilmesi için **kök dizinde** (src klasörünün dışında, package.json ile aynı yerde) bir `.env` dosyası bulunmalıdır.

## Adım Adım Kurulum

### 1. Dosyayı Oluşturun
Proje kök dizininde `.env` adında yeni bir dosya oluşturun.

### 2. Gerekli Değerleri Ekleyin
Aşağıdaki formatta değişkenleri bu dosyaya kopyalayın:

