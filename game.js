// Canvas ve context ayarları
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Fare imlecini değiştir
canvas.style.cursor = 'crosshair';

// Tüm sayfa için sağ tık menüsünü ve metin seçimini engelle
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
});

// Oyun değişkenleri
let score = 0;
let level = 1;
let cloudsLeft = 10; // Level 1'de 10 bulut
let cloudsDestroyed = 0;
let gameActive = true;
let gameStarted = false; // Oyun başlangıçta başlamamış olmalı
let powerUpSelected = false;
let specialAbilityAvailable = false;
let isPaused = false;
let isTimeStopped = false; // Zaman durdurma özelliği
let timeStopDuration = 5000; // Zaman durdurma süresi (ms)
let timeStopStartTime = 0; // Zaman durdurma başlangıç zamanı
let timeStopRemaining = 0; // Kalan zaman durdurma süresi
let showingNotification = false; // Bildirim gösteriliyor mu?
let notificationMessage = ""; // Bildirim mesajı
let notificationTimeout = null; // Bildirim zamanlayıcısı

// Mermi ve reload değişkenleri
let ammoCount = 5; // Başlangıçta 5 mermi
let maxAmmo = 5; // Maksimum mermi sayısı
let isReloading = false; // Reload durumu
let reloadTime = 1000; // Reload süresi (ms)
let reloadStartTime = 0; // Reload başlangıç zamanı

// Oyuncu özellikleri
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    speed: 2, // Hızı daha da azalttım
    color: '#4CAF50',
    weaponPower: 1
};

// Güneş özellikleri
const sun = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 40,
    color: '#FDB813',
    health: 100
};

// Mermi özellikleri
const bullets = [];
const bulletSpeed = 10;
const bulletRange = 300;

// Bulut özellikleri
const clouds = [];
let cloudSpawnRate = 2000; // ms - Başlangıç spawn hızı
let lastCloudSpawn = 0;
let maxCloudsOnScreen = 5; // Ekranda aynı anda maksimum bulut sayısı
const cloudColors = [
    'rgba(200, 200, 200, 0.8)', // Level 1
    'rgba(150, 150, 150, 0.8)', // Level 2
    'rgba(100, 100, 100, 0.8)',  // Level 3
    'rgba(70, 70, 70, 0.9)',   // Level 4
    'rgba(50, 50, 50, 0.95)'   // Level 5
];

// Fare pozisyonu
const mouse = {
    x: 0,
    y: 0
};

// Tuş basma durumları
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    up: false,
    down: false,
    left: false,
    right: false
};

// Event Listeners
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        return;
    }
    
    if (gameActive) {
        fireBullet();
    }
});

document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w': keys.w = true; break;
        case 'a': keys.a = true; break;
        case 's': keys.s = true; break;
        case 'd': keys.d = true; break;
        case 'arrowup': keys.up = true; break;
        case 'arrowdown': keys.down = true; break;
        case 'arrowleft': keys.left = true; break;
        case 'arrowright': keys.right = true; break;
        case 'escape': togglePause(); break; // ESC tuşu ile pause
        case 'p': togglePause(); break; // P tuşu ile pause
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w': keys.w = false; break;
        case 'a': keys.a = false; break;
        case 's': keys.s = false; break;
        case 'd': keys.d = false; break;
        case 'arrowup': keys.up = false; break;
        case 'arrowdown': keys.down = false; break;
        case 'arrowleft': keys.left = false; break;
        case 'arrowright': keys.right = false; break;
    }
});

// Sağ tık özel yetenek
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    if (gameActive && !isPaused) {
        // Özel yetenek (bulut yok etme) varsa kullan
        if (specialAbilityAvailable) {
            console.log("Özel yetenek kullanıldı!");
            useSpecialAbility();
        }
        // Zaman durdurma özelliği varsa kullan
        else if (isTimeStopped === false && level === 5 && timeStopRemaining > 0) {
            console.log("Zaman durdurma özelliği kullanıldı!");
            startTimeStop();
        }
    }
    
    return false;
});

// Seviye atlama butonları
document.getElementById('powerWeapon').addEventListener('click', () => {
    console.log(`Level ${level} için güçlü silah seçildi`);
    
    if (level === 1) {
        // Level 1'den Level 2'ye geçiş - Daha güçlü silah
        player.weaponPower = 2;
        startLevel2();
    } else if (level === 2) {
        // Level 2'den Level 3'e geçiş - Süper güçlü silah
        player.weaponPower = 3;
        startLevel3();
    } else if (level === 3) {
        // Level 3'ten Level 4'e geçiş - Ultra güçlü silah
        player.weaponPower = 4;
        startLevel4();
    } else if (level === 4) {
        // Level 4'ten Level 5'e geçiş - Mega güçlü silah ve güneş canı yenileme
        player.weaponPower = 5;
        sun.health = 100; // Güneş canını yenile
        startLevel5();
    }
    
    powerUpSelected = true;
    document.getElementById('levelUp').style.display = 'none';
});

document.getElementById('speedMovement').addEventListener('click', () => {
    console.log(`Level ${level} için hız/özel yetenek seçildi`);
    
    if (level === 1) {
        // Level 1'den Level 2'ye geçiş - Daha hızlı hareket
        player.speed = 4;
        startLevel2();
    } else if (level === 2) {
        // Level 2'den Level 3'e geçiş - Özel yetenek
        specialAbilityAvailable = true;
        showNotification('Özel yetenek kazandınız! Sağ tıklayarak tüm bulutları yok edebilirsiniz (sadece bir kez kullanılabilir ve 2 level boyunca geçerlidir).');
        startLevel3();
    } else if (level === 3) {
        // Level 3'ten Level 4'e geçiş - Süper hızlı hareket
        player.speed = 6;
        startLevel4();
    } else if (level === 4) {
        // Level 4'ten Level 5'e geçiş - Zaman durdurma özelliği + Silah güçlendirme
        timeStopRemaining = timeStopDuration;
        player.weaponPower = 4; // Silahı da güçlendir
        showNotification('Zaman durdurma özelliği ve güçlü silah kazandınız! Sağ tıklayarak 5 saniye boyunca zamanı durdurabilirsiniz.');
        startLevel5();
    }
    
    powerUpSelected = true;
    document.getElementById('levelUp').style.display = 'none';
});

// Yeniden başlatma butonu
document.getElementById('restartGame').addEventListener('click', () => {
    resetGame();
    document.getElementById('gameOver').style.display = 'none';
});

// Oyun fonksiyonları
function fireBullet() {
    // Mermi yoksa veya reload oluyorsa ateş etme
    if (ammoCount <= 0 || isReloading) {
        if (!isReloading) {
            startReload();
        }
        return;
    }
    
    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    const velocity = {
        x: Math.cos(angle) * bulletSpeed,
        y: Math.sin(angle) * bulletSpeed
    };
    
    bullets.push({
        x: player.x,
        y: player.y,
        velocity,
        radius: 5,
        color: '#FFF',
        distance: 0,
        power: player.weaponPower
    });
    
    // Mermi sayısını azalt
    ammoCount--;
    
    // Mermi bittiyse reload başlat
    if (ammoCount <= 0) {
        startReload();
    }
}

function spawnCloud() {
    // Zaman durdurma aktifse bulut oluşturma
    if (isTimeStopped) return;
    
    const now = Date.now();
    // Ekranda maksimum bulut sayısını aşmadık ve hala yok edilmesi gereken bulut var mı?
    if (now - lastCloudSpawn > cloudSpawnRate && 
        clouds.length < maxCloudsOnScreen && 
        cloudsDestroyed < cloudsLeft) {
        
        lastCloudSpawn = now;
        
        // Rastgele kenardan bulut oluştur
        let x, y;
        const side = Math.floor(Math.random() * 4);
        
        switch(side) {
            case 0: // Üst
                x = Math.random() * canvas.width;
                y = -30;
                break;
            case 1: // Sağ
                x = canvas.width + 30;
                y = Math.random() * canvas.height;
                break;
            case 2: // Alt
                x = Math.random() * canvas.width;
                y = canvas.height + 30;
                break;
            case 3: // Sol
                x = -30;
                y = Math.random() * canvas.height;
                break;
        }
        
        const size = 20 + Math.random() * 20;
        let cloudSpeedValue = 0.5;
        
        // Level'e göre hız ayarla
        if (level === 2) cloudSpeedValue = 0.75;
        if (level === 3) cloudSpeedValue = 1;
        if (level === 4) cloudSpeedValue = 1.5;
        if (level === 5) cloudSpeedValue = 2; // Level 5'te daha hızlı
        
        // Bulut oluştur
        const cloud = {
            x,
            y,
            radius: size,
            color: cloudColors[level - 1], // Level'e göre renk
            health: level, // Level'e göre can (1, 2, 3 veya 4)
            speed: cloudSpeedValue, // Bulutun hızını sakla
            // Bulut şekli için rastgele değerler
            offsetX1: Math.random() * 10 - 5,
            offsetY1: Math.random() * 10 - 5,
            offsetX2: Math.random() * 10 - 5,
            offsetY2: Math.random() * 10 - 5,
            offsetX3: Math.random() * 10 - 5,
            offsetY3: Math.random() * 10 - 5
        };
        
        clouds.push(cloud);
        
        console.log(`Yeni bulut oluşturuldu. Ekrandaki bulut sayısı: ${clouds.length}`);
    }
}

function movePlayer() {
    if (keys.w || keys.up) player.y -= player.speed;
    if (keys.s || keys.down) player.y += player.speed;
    if (keys.a || keys.left) player.x -= player.speed;
    if (keys.d || keys.right) player.x += player.speed;
    
    // Sınırlar içinde tut
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        bullet.x += bullet.velocity.x;
        bullet.y += bullet.velocity.y;
        bullet.distance += Math.sqrt(
            Math.pow(bullet.velocity.x, 2) + 
            Math.pow(bullet.velocity.y, 2)
        );
        
        // Menzil kontrolü
        if (bullet.distance > bulletRange) {
            bullets.splice(i, 1);
            continue;
        }
        
        // Ekran dışı kontrolü
        if (
            bullet.x < 0 || 
            bullet.x > canvas.width || 
            bullet.y < 0 || 
            bullet.y > canvas.height
        ) {
            bullets.splice(i, 1);
            continue;
        }
        
        // Bulut çarpışma kontrolü
        for (let j = clouds.length - 1; j >= 0; j--) {
            const cloud = clouds[j];
            const distance = Math.sqrt(
                Math.pow(bullet.x - cloud.x, 2) + 
                Math.pow(bullet.y - cloud.y, 2)
            );
            
            if (distance < bullet.radius + cloud.radius) {
                cloud.health -= bullet.power;
                
                if (cloud.health <= 0) {
                    clouds.splice(j, 1);
                    score += 10;
                    cloudsDestroyed++;
                    
                    console.log(`Bulut yok edildi! Toplam: ${cloudsDestroyed}/${cloudsLeft}`);
                    
                    // Tüm bulutlar yok edildi mi kontrol et
                    if (cloudsDestroyed >= cloudsLeft) {
                        if (level === 5) {
                            victory();
                        } else {
                            levelUp();
                        }
                    }
                }
                
                bullets.splice(i, 1);
                break;
            }
        }
    }
}

function updateClouds() {
    // Zaman durdurma aktifse bulutları hareket ettirme
    if (isTimeStopped) return;
    
    for (let i = clouds.length - 1; i >= 0; i--) {
        const cloud = clouds[i];
        
        // Güneşe doğru hareket
        const angle = Math.atan2(sun.y - cloud.y, sun.x - cloud.x);
        
        cloud.x += Math.cos(angle) * cloud.speed;
        cloud.y += Math.sin(angle) * cloud.speed;
        
        // Güneş çarpışma kontrolü
        const distance = Math.sqrt(
            Math.pow(cloud.x - sun.x, 2) + 
            Math.pow(cloud.y - sun.y, 2)
        );
        
        if (distance < cloud.radius + sun.radius) {
            clouds.splice(i, 1);
            sun.health -= 10;
            
            // Level'e göre puan cezası
            const penaltyPoints = level * 5; // Level 1: -5, Level 2: -10, Level 3: -15, vb.
            score = Math.max(0, score - penaltyPoints); // Puan 0'ın altına düşmesin
            
            if (sun.health <= 0) {
                gameOver();
            }
        }
    }
}

function levelUp() {
    console.log(`Level ${level + 1}'e geçiliyor!`);
    
    // Level 2 için buton metinlerini güncelle
    if (level === 1) {
        document.getElementById('powerWeapon').textContent = 'Daha Güçlü Silah';
        document.getElementById('speedMovement').textContent = 'Daha Hızlı Hareket';
    } 
    // Level 3 için buton metinlerini güncelle
    else if (level === 2) {
        document.getElementById('powerWeapon').textContent = 'Süper Güçlü Silah';
        document.getElementById('speedMovement').textContent = 'Özel Yetenek';
    }
    // Level 4 için buton metinlerini güncelle
    else if (level === 3) {
        document.getElementById('powerWeapon').textContent = 'Ultra Güçlü Silah';
        document.getElementById('speedMovement').textContent = 'Süper Hızlı Hareket';
    }
    // Level 5 için buton metinlerini güncelle
    else if (level === 4) {
        document.getElementById('powerWeapon').textContent = 'Mega Güçlü Silah + Can Yenileme';
        document.getElementById('speedMovement').textContent = 'Zaman Durdurma + Güçlü Silah';
    }
    
    document.getElementById('levelUp').style.display = 'block';
    gameActive = false;
}

function startLevel2() {
    console.log("Level 2 başladı!");
    level = 2; // Level değerini güncelle
    cloudsLeft = 20; // Level 2'de 20 bulut
    cloudsDestroyed = 0;
    maxCloudsOnScreen = 8; // Level 2'de daha fazla bulut
    cloudSpawnRate = 1500; // Level 2'de daha hızlı spawn
    
    // Level 2'de silah güçlendiyse mermi sayısını artır
    if (player.weaponPower > 1) {
        maxAmmo = 10;
        reloadTime = 500; // 0.5 saniye
    }
    
    document.getElementById('clouds-left').textContent = cloudsLeft;
    document.getElementById('clouds-destroyed').textContent = cloudsDestroyed;
    document.getElementById('level').textContent = level;
    gameActive = true;
}

function startLevel3() {
    console.log("Level 3 başladı!");
    level = 3; // Level değerini güncelle
    cloudsLeft = 30; // Level 3'te 30 bulut
    cloudsDestroyed = 0;
    maxCloudsOnScreen = 10; // Level 3'te daha fazla bulut
    cloudSpawnRate = 1000; // Level 3'te çok daha hızlı spawn
    
    // Level 3'te silah güçlendiyse mermi sayısını artır
    if (player.weaponPower > 1) {
        maxAmmo = 10;
        reloadTime = 500; // 0.5 saniye
    }
    
    document.getElementById('clouds-left').textContent = cloudsLeft;
    document.getElementById('clouds-destroyed').textContent = cloudsDestroyed;
    document.getElementById('level').textContent = level;
    gameActive = true;
}

function startLevel4() {
    console.log("Level 4 başladı!");
    level = 4; // Level değerini güncelle
    cloudsLeft = 40; // Level 4'te 40 bulut
    cloudsDestroyed = 0;
    maxCloudsOnScreen = 12; // Level 4'te daha fazla bulut
    cloudSpawnRate = 800; // Level 4'te çok daha hızlı spawn
    
    // Level 4'te silah güçlendiyse mermi sayısını artır
    if (player.weaponPower > 1) {
        maxAmmo = 15;
        reloadTime = 300; // 0.3 saniye
    }
    
    document.getElementById('clouds-left').textContent = cloudsLeft;
    document.getElementById('clouds-destroyed').textContent = cloudsDestroyed;
    document.getElementById('level').textContent = level;
    gameActive = true;
}

function startLevel5() {
    console.log("Level 5 başladı! (Final Level)");
    level = 5; // Level değerini güncelle
    cloudsLeft = 50; // Level 5'te 50 bulut
    cloudsDestroyed = 0;
    maxCloudsOnScreen = 15; // Level 5'te daha fazla bulut
    cloudSpawnRate = 600; // Level 5'te çok daha hızlı spawn
    
    // Level 5'te silah güçlendiyse mermi sayısını artır
    if (player.weaponPower > 1) {
        maxAmmo = 20;
        reloadTime = 200; // 0.2 saniye
    }
    
    document.getElementById('clouds-left').textContent = cloudsLeft;
    document.getElementById('clouds-destroyed').textContent = cloudsDestroyed;
    document.getElementById('level').textContent = level;
    gameActive = true;
}

function gameOver() {
    gameActive = false;
    document.getElementById('gameOver').style.display = 'block';
    
    // Oyun sonu puan gösterimi
    const gameOverElement = document.getElementById('gameOver');
    const scoreElement = document.createElement('div');
    scoreElement.className = 'final-score';
    scoreElement.innerHTML = `Toplam Puan: <span>${score}</span>`;
    
    // Eğer daha önce eklenmediyse ekle
    if (!gameOverElement.querySelector('.final-score')) {
        gameOverElement.insertBefore(scoreElement, document.getElementById('restartGame'));
    } else {
        // Varsa güncelle
        gameOverElement.querySelector('.final-score span').textContent = score;
    }
}

function victory() {
    gameActive = false;
    
    // Oyun sonu puan gösterimi
    const victoryElement = document.createElement('div');
    victoryElement.className = 'level-up';
    victoryElement.style.display = 'block';
    victoryElement.innerHTML = `
        <h2>Tebrikler! Oyunu Kazandınız!</h2>
        <div class="final-score">Toplam Puan: <span>${score}</span></div>
        <button id="restartAfterVictory">Yeniden Başla</button>
    `;
    
    document.querySelector('.game-container').appendChild(victoryElement);
    
    // Yeniden başlatma butonu
    document.getElementById('restartAfterVictory').addEventListener('click', () => {
        document.querySelector('.game-container').removeChild(victoryElement);
        resetGame();
    });
}

function resetGame() {
    // Oyun değişkenlerini sıfırla
    score = 0;
    level = 1;
    cloudsLeft = 10;
    cloudsDestroyed = 0;
    maxCloudsOnScreen = 5;
    cloudSpawnRate = 2000; // Başlangıç spawn hızı
    gameActive = true;
    gameStarted = false; // Oyun başlangıç ekranını gösterme
    powerUpSelected = false;
    specialAbilityAvailable = false; // Özel yetenek sıfırlanıyor
    isPaused = false;
    isTimeStopped = false;
    timeStopRemaining = 0;
    
    // Mermi değişkenlerini sıfırla
    ammoCount = 5;
    maxAmmo = 5;
    isReloading = false;
    reloadTime = 1000;
    
    // Oyuncu özelliklerini sıfırla
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.speed = 2;
    player.weaponPower = 1;
    
    // Güneş sağlığını sıfırla
    sun.health = 100;
    
    // Mermileri ve bulutları temizle
    bullets.length = 0;
    clouds.length = 0;
    
    // Buton metinlerini sıfırla
    document.getElementById('powerWeapon').textContent = 'Daha Güçlü Silah';
    document.getElementById('speedMovement').textContent = 'Daha Hızlı Hareket';
    
    // UI'ı güncelle
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('clouds-left').textContent = cloudsLeft;
    document.getElementById('clouds-destroyed').textContent = cloudsDestroyed;
    
    console.log("Oyun sıfırlandı!");
}

function drawStartScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFF';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Güneş Koruma Oyunu', canvas.width / 2, canvas.height / 2 - 150);
    
    ctx.font = '20px Arial';
    ctx.fillText('Güneşi zararlı bulutlardan koru!', canvas.width / 2, canvas.height / 2 - 110);
    
    // Kontroller
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    const startX = canvas.width / 2 - 250;
    let lineY = canvas.height / 2 - 70;
    const lineHeight = 30;
    
    ctx.fillText('KONTROLLER:', startX, lineY); lineY += lineHeight;
    ctx.fillText('• Hareket: W, A, S, D veya Yön Tuşları', startX, lineY); lineY += lineHeight;
    ctx.fillText('• Ateş: Fare Sol Tıklaması', startX, lineY); lineY += lineHeight;
    ctx.fillText('• Duraklat: ESC veya P tuşu', startX, lineY); lineY += lineHeight;
    ctx.fillText('• Özel Yetenek: Fare Sağ Tıklaması (kazanıldığında)', startX, lineY); lineY += lineHeight;
    ctx.fillText('• Zaman Durdurma: Fare Sağ Tıklaması (5. seviyede)', startX, lineY); lineY += lineHeight;
    
    // Oyun bilgileri
    lineY += 10;
    ctx.fillText('OYUN BİLGİLERİ:', startX, lineY); lineY += lineHeight;
    ctx.fillText('• Her 5 atıştan sonra otomatik reload olur', startX, lineY); lineY += lineHeight;
    ctx.fillText('• Her seviyede güç seçimi yapabilirsin', startX, lineY); lineY += lineHeight;
    ctx.fillText('• Bulutlar güneşe ulaşırsa güneş zarar görür', startX, lineY); lineY += lineHeight;
    ctx.fillText('• Tüm bulutları yok edersen bir sonraki seviyeye geçersin', startX, lineY); lineY += lineHeight;
    
    ctx.textAlign = 'center';
    ctx.font = '24px Arial';
    ctx.fillText('Başlamak için tıkla', canvas.width / 2, canvas.height - 20);
}

function draw() {
    // Ekranı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!gameStarted) {
        drawStartScreen();
        requestAnimationFrame(draw);
        return;
    }
    
    if (isPaused) {
        showPauseScreen();
        requestAnimationFrame(draw);
        return;
    }
    
    // Güneşi çiz (daha gerçekçi)
    drawSun();
    
    // Oyuncuyu çiz
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
    
    // Silahı çiz
    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(
        player.x + Math.cos(angle) * 30,
        player.y + Math.sin(angle) * 30
    );
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#333';
    ctx.stroke();
    ctx.closePath();
    
    // Mermileri çiz
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
        ctx.closePath();
    });
    
    // Bulutları çiz
    clouds.forEach(cloud => {
        drawCloud(cloud);
    });
    
    // Güneş sağlık barı
    const healthBarWidth = 200;
    const healthBarHeight = 10;
    ctx.fillStyle = '#333';
    ctx.fillRect(
        canvas.width / 2 - healthBarWidth / 2,
        20,
        healthBarWidth,
        healthBarHeight
    );
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(
        canvas.width / 2 - healthBarWidth / 2,
        20,
        (sun.health / 100) * healthBarWidth,
        healthBarHeight
    );
    
    // Sağlık yüzdesi
    ctx.fillStyle = '#FFF';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${sun.health}%`, canvas.width / 2 + healthBarWidth / 2 + 10, 30);
    
    // Skor ve seviye güncelleme
    document.getElementById('score').textContent = score;
    document.getElementById('clouds-left').textContent = cloudsLeft;
    document.getElementById('clouds-destroyed').textContent = cloudsDestroyed;
    
    // Özel yetenek göstergesi
    if (specialAbilityAvailable) {
        ctx.fillStyle = '#FF0000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('Özel Yetenek: HAZIR (Sağ Tık)', canvas.width - 10, 30);
    }
    
    // Zaman durdurma göstergesi
    if (level === 5 && timeStopRemaining > 0 && !isTimeStopped) {
        ctx.fillStyle = '#00BFFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('Zaman Durdurma: HAZIR (Sağ Tık)', canvas.width - 10, 60);
    }
    
    // Zaman durdurma aktifse geri sayım göster
    if (isTimeStopped) {
        const remainingSeconds = Math.ceil(timeStopRemaining / 1000);
        ctx.fillStyle = '#00BFFF';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${remainingSeconds}`, canvas.width / 2, 50);
        
        // Ekrana mavi yarı-saydam bir katman ekle
        ctx.fillStyle = 'rgba(0, 191, 255, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Stat ekranı
    drawStatPanel();
    
    // Reload göstergesi
    if (isReloading) {
        drawReloadIndicator();
    }
    
    // Bildirim göster
    if (showingNotification) {
        drawNotification();
    }
}

// Güneşi çiz (daha gerçekçi)
function drawSun() {
    // Ana güneş dairesi
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    
    // Gradyan oluştur
    const gradient = ctx.createRadialGradient(
        sun.x, sun.y, 0,
        sun.x, sun.y, sun.radius
    );
    gradient.addColorStop(0, '#FFF176'); // İç kısım daha açık sarı
    gradient.addColorStop(0.7, '#FDB813'); // Orta kısım normal sarı
    gradient.addColorStop(1, '#F57F17'); // Dış kısım turuncu-kırmızı
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Güneş ışınları
    const rayCount = 12;
    const rayLength = 15;
    
    ctx.strokeStyle = '#F57F17';
    ctx.lineWidth = 3;
    
    for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        const startX = sun.x + Math.cos(angle) * sun.radius;
        const startY = sun.y + Math.sin(angle) * sun.radius;
        const endX = sun.x + Math.cos(angle) * (sun.radius + rayLength);
        const endY = sun.y + Math.sin(angle) * (sun.radius + rayLength);
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

// Bulutu çiz (daha gerçekçi)
function drawCloud(cloud) {
    ctx.fillStyle = cloud.color;
    
    // Ana bulut dairesi
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Ek bulut parçaları
    ctx.beginPath();
    ctx.arc(cloud.x + cloud.radius * 0.5 + cloud.offsetX1, cloud.y - cloud.radius * 0.2 + cloud.offsetY1, cloud.radius * 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(cloud.x - cloud.radius * 0.5 + cloud.offsetX2, cloud.y - cloud.radius * 0.3 + cloud.offsetY2, cloud.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(cloud.x + cloud.radius * 0.3 + cloud.offsetX3, cloud.y + cloud.radius * 0.2 + cloud.offsetY3, cloud.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
}

// Stat paneli çiz
function drawStatPanel() {
    // Stat panel arkaplanı
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(canvas.width - 200, canvas.height - 120, 190, 110);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width - 200, canvas.height - 120, 190, 110);
    
    // Stat başlığı
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('OYUNCU BİLGİLERİ', canvas.width - 105, canvas.height - 100);
    
    // Stat bilgileri
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    // Seviye
    ctx.fillText(`Seviye: ${level}`, canvas.width - 190, canvas.height - 75);
    
    // Silah gücü
    ctx.fillText(`Silah Gücü: ${player.weaponPower}`, canvas.width - 190, canvas.height - 55);
    
    // Hareket hızı
    ctx.fillText(`Hareket Hızı: ${player.speed}`, canvas.width - 190, canvas.height - 35);
    
    // Mermi durumu
    ctx.fillText(`Mermi: ${ammoCount}/${maxAmmo}`, canvas.width - 190, canvas.height - 15);
    
    // Zaman durdurma durumu
    if (level === 5 && timeStopRemaining > 0) {
        const remainingSeconds = Math.ceil(timeStopRemaining / 1000);
        ctx.fillText(`Zaman Durdurma: ${remainingSeconds}s`, canvas.width - 190, canvas.height + 5);
    }
}

// Reload göstergesi çiz
function drawReloadIndicator() {
    const now = Date.now();
    const elapsedTime = now - reloadStartTime;
    const progress = Math.min(elapsedTime / reloadTime, 1);
    
    // Reload yazısı
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('RELOAD', player.x, player.y - 40);
    
    // İlerleme çubuğu
    const barWidth = 50;
    const barHeight = 5;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(player.x - barWidth / 2, player.y - 30, barWidth, barHeight);
    
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x - barWidth / 2, player.y - 30, barWidth * progress, barHeight);
}

function update() {
    if (gameActive && gameStarted && !isPaused && !showingNotification) {
        movePlayer();
        updateBullets();
        
        // Zaman durdurma kontrolü
        if (isTimeStopped) {
            const now = Date.now();
            const elapsedTime = now - timeStopStartTime;
            timeStopRemaining = Math.max(0, timeStopDuration - elapsedTime);
            
            // Zaman durdurma süresi bittiyse
            if (timeStopRemaining <= 0) {
                isTimeStopped = false;
                console.log("Zaman durdurma sona erdi!");
            }
        } else {
            // Zaman durdurma aktif değilse normal güncelleme
            spawnCloud();
            updateClouds();
        }
        
        checkReload(); // Reload durumunu kontrol et
    }
}

// Oyun döngüsü
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Özel yetenek fonksiyonu
function useSpecialAbility() {
    if (!specialAbilityAvailable) return;
    
    // Tüm bulutları yok et
    const destroyedCount = clouds.length;
    if (destroyedCount === 0) return; // Bulut yoksa bir şey yapma
    
    clouds.length = 0;
    cloudsDestroyed += destroyedCount;
    score += destroyedCount * 10;
    
    console.log(`Özel yetenek ile ${destroyedCount} bulut yok edildi. Toplam: ${cloudsDestroyed}/${cloudsLeft}`);
    
    // Özel yeteneği devre dışı bırak
    specialAbilityAvailable = false;
    
    // Efekt göster
    showSpecialAbilityEffect();
    
    // Tüm bulutlar yok edildi mi kontrol et
    if (cloudsDestroyed >= cloudsLeft) {
        // Eğer son level değilse bir sonraki levele geç
        if (level < 5) {
            setTimeout(() => {
                levelUp();
            }, 1000); // Efekti gösterdikten sonra level atlama ekranını göster
        } else {
            // Son levelse oyunu bitir
            setTimeout(() => {
                victory();
            }, 1000);
        }
    }
}

// Özel yetenek efekti
function showSpecialAbilityEffect() {
    // Ekranda parlama efekti
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Efekt metni
    setTimeout(() => {
        const text = "TÜM BULUTLAR YOK EDİLDİ!";
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }, 100);
}

// Pause fonksiyonu
function togglePause() {
    if (!gameStarted || !gameActive) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        // Pause ekranını göster
        showPauseScreen();
    }
}

// Pause ekranı
function showPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFF';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('OYUN DURAKLATILDI', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.font = '20px Arial';
    ctx.fillText('Devam etmek için ESC veya P tuşuna basın', canvas.width / 2, canvas.height / 2);
}

// Reload başlat
function startReload() {
    if (isReloading) return;
    
    isReloading = true;
    reloadStartTime = Date.now();
    console.log("Reload başladı!");
}

// Reload durumunu kontrol et
function checkReload() {
    if (!isReloading) return;
    
    const now = Date.now();
    const elapsedTime = now - reloadStartTime;
    
    if (elapsedTime >= reloadTime) {
        // Reload tamamlandı
        isReloading = false;
        ammoCount = maxAmmo;
        console.log("Reload tamamlandı! Yeni mermi sayısı:", ammoCount);
    }
}

// Zaman durdurma başlat
function startTimeStop() {
    if (isTimeStopped || timeStopRemaining <= 0) return;
    
    isTimeStopped = true;
    timeStopStartTime = Date.now();
    console.log("Zaman durdurma başladı! Süre:", timeStopRemaining / 1000, "saniye");
}

// Bildirim göster
function showNotification(message) {
    notificationMessage = message;
    showingNotification = true;
    
    // Önceki zamanlayıcıyı temizle
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    
    // Otomatik kapanma zamanlayıcısını kaldır, kullanıcı OK butonuna basmalı
}

// Bildirim çiz
function drawNotification() {
    // Yarı saydam arka plan
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Bildirim kutusu
    const boxWidth = 500;
    const boxHeight = 200;
    const boxX = (canvas.width - boxWidth) / 2;
    const boxY = (canvas.height - boxHeight) / 2;
    
    // Kutu arka planı
    ctx.fillStyle = '#333';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    
    // Kutu kenarlığı
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
    // Başlık
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Bildirim', canvas.width / 2, boxY + 40);
    
    // Mesaj
    ctx.font = '16px Arial';
    
    // Mesajı satırlara böl
    const maxLineWidth = boxWidth - 40;
    const words = notificationMessage.split(' ');
    let lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxLineWidth) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);
    
    // Satırları çiz
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], canvas.width / 2, boxY + 80 + i * 25);
    }
    
    // OK butonu
    const buttonWidth = 100;
    const buttonHeight = 40;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = boxY + boxHeight - 60;
    
    // Buton arka planı
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    // Buton kenarlığı
    ctx.strokeStyle = '#FFF';
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    // Buton metni
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('OK', canvas.width / 2, buttonY + 25);
    
    // Buton tıklama olayı
    canvas.onclick = function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        if (
            mouseX >= buttonX && 
            mouseX <= buttonX + buttonWidth && 
            mouseY >= buttonY && 
            mouseY <= buttonY + buttonHeight
        ) {
            showingNotification = false;
            canvas.onclick = null; // Tıklama olayını kaldır
        }
    };
}

// Oyunu başlat
resetGame();
gameLoop(); 