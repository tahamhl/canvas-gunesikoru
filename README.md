# Güneş Koruma Oyunu / Sun Protection Game

> Güneşi tehlikeli bulutlardan korumak için heyecanlı bir maceraya hazır olun! 5 seviyeli bu oyunda, karakterinizi kontrol ederek bulutları yok edin, güçlerinizi geliştirin ve güneşin zarar görmesini engelleyin. Özel yetenekler kazanın, silahlarınızı güçlendirin ve yüksek skor elde etmeye çalışın!

**🎮 [Oyunu oynamak için tıklayın / Click to play the game](https://tahamehel.tr/game)**

## 📷 Oyun Görüntüleri / Game Screenshots

![Oyun Ekran Görüntüsü 1](screenshots/screenshot1.jpg)
![Oyun Ekran Görüntüsü 2](screenshots/screenshot2.jpg)

## 🇹🇷 Türkçe

### Proje Hakkında
Güneş Koruma Oyunu, HTML5 Canvas ve JavaScript kullanılarak geliştirilmiş, tarayıcı tabanlı bir 2D oyundur. Oyunun amacı, güneşi zararlı bulutlardan korumaktır. Oyuncu, karakterini kontrol ederek bulutları yok etmeli ve güneşin zarar görmesini engellemelidir.

### Özellikler
- **5 Seviyeli Oyun Yapısı**: Her seviye giderek zorlaşır ve yeni özellikler açılır.
- **Güç Geliştirme Sistemi**: Her seviye atladığınızda iki farklı güç geliştirme seçeneği sunulur.
- **Özel Yetenekler**: 
  - Daha güçlü silahlar
  - Daha hızlı hareket
  - Tüm bulutları yok etme özelliği
  - Zaman durdurma yeteneği
- **Mermi ve Reload Sistemi**: Sınırlı mermi sayısı ve otomatik reload mekanizması.
- **Dinamik Zorluk Seviyesi**: Her seviyede bulut sayısı, hızı ve dayanıklılığı artar.
- **Görsel Efektler**: Özel yetenekler kullanıldığında görsel efektler.
- **Oyun İçi Bildirimler**: Önemli olaylar için bildirim sistemi.
- **Duraklatma Özelliği**: Oyunu istediğiniz zaman duraklatabilirsiniz.

### Kurulum
1. Projeyi bilgisayarınıza indirin:
   ```
   git clone https://github.com/kullaniciadi/gunes-koruma-oyunu.git
   ```
2. İndirdiğiniz klasöre gidin:
   ```
   cd gunes-koruma-oyunu
   ```
3. `game.html` dosyasını herhangi bir modern web tarayıcısında açın.

### Nasıl Oynanır
- **Hareket**: W, A, S, D veya Yön Tuşları
- **Ateş**: Fare Sol Tıklaması
- **Duraklat**: ESC veya P tuşu
- **Özel Yetenek**: Fare Sağ Tıklaması (kazanıldığında)
- **Zaman Durdurma**: Fare Sağ Tıklaması (5. seviyede)

### Oyun Mekanikleri

#### Seviyeler
- **Seviye 1**: Başlangıç seviyesi, 10 bulut
- **Seviye 2**: 20 bulut, daha hızlı spawn
- **Seviye 3**: 30 bulut, daha hızlı ve dayanıklı bulutlar
- **Seviye 4**: 40 bulut, çok daha hızlı spawn
- **Seviye 5**: 50 bulut, en hızlı ve en dayanıklı bulutlar (Final seviye)

#### Güç Geliştirmeleri
1. **Seviye 1'den Seviye 2'ye**:
   - Daha Güçlü Silah: Silah gücü 2'ye çıkar, mermi sayısı 10'a yükselir
   - Daha Hızlı Hareket: Hareket hızı 4'e çıkar

2. **Seviye 2'den Seviye 3'e**:
   - Süper Güçlü Silah: Silah gücü 3'e çıkar
   - Özel Yetenek: Sağ tıklayarak tüm bulutları yok etme yeteneği

3. **Seviye 3'ten Seviye 4'e**:
   - Ultra Güçlü Silah: Silah gücü 4'e çıkar, mermi sayısı 15'e yükselir
   - Süper Hızlı Hareket: Hareket hızı 6'ya çıkar

4. **Seviye 4'ten Seviye 5'e**:
   - Mega Güçlü Silah + Can Yenileme: Silah gücü 5'e çıkar, güneş canı yenilenir
   - Zaman Durdurma + Güçlü Silah: Sağ tıklayarak zamanı durdurma yeteneği, silah gücü 4'e çıkar

#### Puan Sistemi
- Her bulut yok edildiğinde: +10 puan
- Bulut güneşe ulaştığında: -(seviye × 5) puan cezası

### Teknik Detaylar
- **Dil**: JavaScript
- **Render**: HTML5 Canvas
- **Stil**: CSS3
- **Tarayıcı Uyumluluğu**: Tüm modern tarayıcılar (Chrome, Firefox, Safari, Edge)
- **Bağımlılıklar**: Yok, tamamen vanilla JavaScript

### Projeyi Özelleştirme
Oyunun çeşitli parametrelerini `game.js` dosyasından değiştirebilirsiniz:

- Bulut sayısı: `cloudsLeft` değişkeni
- Oyuncu hızı: `player.speed` değişkeni
- Silah gücü: `player.weaponPower` değişkeni
- Zaman durdurma süresi: `timeStopDuration` değişkeni

### Katkıda Bulunma
1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inize push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Lisans
Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

---

## 🇬🇧 English

### About The Project
Sun Protection Game is a browser-based 2D game developed using HTML5 Canvas and JavaScript. The goal of the game is to protect the sun from harmful clouds. The player must control their character to destroy clouds and prevent the sun from being damaged.

### Features
- **5-Level Game Structure**: Each level gets progressively harder and unlocks new features.
- **Power Upgrade System**: Two different power upgrade options are presented each time you level up.
- **Special Abilities**: 
  - More powerful weapons
  - Faster movement
  - Ability to destroy all clouds
  - Time-stopping ability
- **Ammo and Reload System**: Limited ammo count and automatic reload mechanism.
- **Dynamic Difficulty Level**: Cloud count, speed, and durability increase with each level.
- **Visual Effects**: Visual effects when special abilities are used.
- **In-Game Notifications**: Notification system for important events.
- **Pause Feature**: You can pause the game at any time.

### Installation
1. Clone the project to your computer:
   ```
   git clone https://github.com/username/sun-protection-game.git
   ```
2. Navigate to the downloaded folder:
   ```
   cd sun-protection-game
   ```
3. Open the `game.html` file in any modern web browser.

### How to Play
- **Movement**: W, A, S, D or Arrow Keys
- **Shoot**: Left Mouse Click
- **Pause**: ESC or P key
- **Special Ability**: Right Mouse Click (when acquired)
- **Time Stop**: Right Mouse Click (at level 5)

### Game Mechanics

#### Levels
- **Level 1**: Starting level, 10 clouds
- **Level 2**: 20 clouds, faster spawn
- **Level 3**: 30 clouds, faster and more durable clouds
- **Level 4**: 40 clouds, much faster spawn
- **Level 5**: 50 clouds, fastest and most durable clouds (Final level)

#### Power Upgrades
1. **Level 1 to Level 2**:
   - More Powerful Weapon: Weapon power increases to 2, ammo count increases to 10
   - Faster Movement: Movement speed increases to 4

2. **Level 2 to Level 3**:
   - Super Powerful Weapon: Weapon power increases to 3
   - Special Ability: Ability to destroy all clouds with right-click

3. **Level 3 to Level 4**:
   - Ultra Powerful Weapon: Weapon power increases to 4, ammo count increases to 15
   - Super Fast Movement: Movement speed increases to 6

4. **Level 4 to Level 5**:
   - Mega Powerful Weapon + Health Regeneration: Weapon power increases to 5, sun health regenerates
   - Time Stop + Powerful Weapon: Ability to stop time with right-click, weapon power increases to 4

#### Scoring System
- Each cloud destroyed: +10 points
- Cloud reaches the sun: -(level × 5) point penalty

### Technical Details
- **Language**: JavaScript
- **Rendering**: HTML5 Canvas
- **Styling**: CSS3
- **Browser Compatibility**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Dependencies**: None, completely vanilla JavaScript

### Customizing the Project
You can modify various parameters of the game from the `game.js` file:

- Cloud count: `cloudsLeft` variable
- Player speed: `player.speed` variable
- Weapon power: `player.weaponPower` variable
- Time stop duration: `timeStopDuration` variable

### Contributing
1. Fork this repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

