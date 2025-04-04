// Sayfa içi bağlantılara düzgün kaydırma
document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menü toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('show');
        });
    }
    
    // Düzgün sayfa içi kaydırma
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Mobil menüyü kapat
            if (mainNav.classList.contains('show')) {
                mainNav.classList.remove('show');
            }
            
            // Hedef bölüme kaydır
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Hesaplayıcı Fonksiyonları
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            calculateFitness();
        });
    }
    
    // Yağ Oranı Hesaplama için gerekli elementleri seçelim
    const fatCalculatorForm = document.getElementById("fat-calculator");
    const calculateFatBtn = document.getElementById("calculate-fat-btn");
    const fatPercentage = document.getElementById("fat-percentage");
    const fatCategory = document.getElementById("fat-category");
    const hipGroup = document.getElementById("hip-group");
    
    // Cinsiyet değiştiğinde kalça alanını göster/gizle
    const genderRadiosFat = document.getElementsByName("fat-gender");
    
    function toggleHipField() {
        const selectedGender = document.querySelector('input[name="fat-gender"]:checked').value;
        if (selectedGender === "female") {
            hipGroup.style.display = "block";
            document.getElementById("hip").required = true;
        } else {
            hipGroup.style.display = "none";
            document.getElementById("hip").required = false;
        }
    }
    
    // Sayfa yüklendiğinde kalça alanını kontrol et
    toggleHipField();
    
    // Cinsiyet değiştiğinde
    genderRadiosFat.forEach(radio => {
        radio.addEventListener("change", toggleHipField);
    });
    
    // Hesapla butonuna tıklandığında
    calculateFatBtn.addEventListener("click", function() {
        // Form doğrulaması
        const allInputs = fatCalculatorForm.querySelectorAll("input[required]");
        let isValid = true;
        
        allInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add("error");
            } else {
                input.classList.remove("error");
            }
        });
        
        if (!isValid) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }
        
        // Değerleri al
        const gender = document.querySelector('input[name="fat-gender"]:checked').value;
        const height = parseFloat(document.getElementById("fat-height").value);
        const neck = parseFloat(document.getElementById("neck").value);
        const waist = parseFloat(document.getElementById("waist").value);
        const hip = gender === "female" ? parseFloat(document.getElementById("hip").value) : 0;
        
        // Yağ oranını hesapla
        let bodyFatPercentage = 0;
        
        if (gender === "male") {
            bodyFatPercentage = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
        } else {
            bodyFatPercentage = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
        }
        
        // Sonuçları yuvarla ve görüntüle
        bodyFatPercentage = Math.max(0, Math.round(bodyFatPercentage * 10) / 10);
        fatPercentage.textContent = bodyFatPercentage.toFixed(1) + "%";
        
        // Kategorisini belirle
        let category = "";
        if (gender === "male") {
            if (bodyFatPercentage < 6) category = "Aşırı Düşük (Sporcu)";
            else if (bodyFatPercentage < 14) category = "Atletik";
            else if (bodyFatPercentage < 18) category = "Fitness";
            else if (bodyFatPercentage < 25) category = "Normal";
            else category = "Yüksek";
        } else {
            if (bodyFatPercentage < 14) category = "Aşırı Düşük (Sporcu)";
            else if (bodyFatPercentage < 21) category = "Atletik";
            else if (bodyFatPercentage < 25) category = "Fitness";
            else if (bodyFatPercentage < 32) category = "Normal";
            else category = "Yüksek";
        }
        
        fatCategory.textContent = category;
    });
});

// Fitness Hesaplayıcı Fonksiyonu
function calculateFitness() {
    // Mevcut değerleri al
    const age = parseInt(document.getElementById("age").value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const activity = parseFloat(document.getElementById("activity").value);
    
    // Vücut yağ oranını al (manuel giriş için yeni eklenen alan)
    const bodyFatPercentage = parseFloat(document.getElementById("body-fat-percentage").value) || 0;
    
    // BMI hesaplama
    const bmi = weight / ((height / 100) * (height / 100));
    const bmiRounded = Math.round(bmi * 10) / 10;
    
    // İdeal kilo aralığı hesaplama
    const minIdealWeight = Math.round(18.5 * ((height / 100) * (height / 100)));
    const maxIdealWeight = Math.round(24.9 * ((height / 100) * (height / 100)));
    
    // Yağsız vücut kütlesi (LBM) hesaplama
    let lbm = 0;
    if (bodyFatPercentage > 0) {
        // Yağ oranı girilmişse LBM hesapla
        lbm = weight * (1 - (bodyFatPercentage / 100));
    } else {
        // Yağ oranı girilmemişse tahmini LBM hesapla
        if (gender === "male") {
            // Erkekler için tahmini LBM formülü (Boer formülü)
            lbm = 0.407 * weight + 0.267 * height - 19.2;
        } else {
            // Kadınlar için tahmini LBM formülü (Boer formülü)
            lbm = 0.252 * weight + 0.473 * height - 48.3;
        }
    }
    
    // BMR hesaplama (Katch-McArdle formülü ile - yağsız vücut kütlesine dayalı)
    let bmr = 0;
    if (bodyFatPercentage > 0) {
        // Yağ oranı biliniyorsa daha doğru formül kullan
        bmr = 370 + (21.6 * lbm);
    } else {
        // Yağ oranı bilinmiyorsa Harris-Benedict formülünü kullan
        if (gender === "male") {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
    }
    
    // Günlük kalori ihtiyacı
    const dailyCalories = Math.round(bmr * activity);
    
    // BMI kategorisi belirleme
    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Zayıf";
    else if (bmi < 25) bmiCategory = "Normal";
    else if (bmi < 30) bmiCategory = "Fazla Kilolu";
    else bmiCategory = "Obez";
    
    // Sonuçları gösterme
    document.getElementById("bmi-result").textContent = bmiRounded;
    document.getElementById("bmi-category").textContent = bmiCategory;
    document.getElementById("bmr-result").textContent = Math.round(bmr); // BMR değerini yuvarlayıp göster
    document.getElementById("calorie-result").textContent = dailyCalories;
    document.getElementById("ideal-weight-result").textContent = minIdealWeight + " - " + maxIdealWeight;
    
    // Eğer yağ oranı girilmişse ekstra bilgi göster
    if (bodyFatPercentage > 0) {
        document.getElementById("lbm-container").style.display = "block";
        document.getElementById("lbm-result").textContent = Math.round(lbm * 10) / 10;
    } else {
        document.getElementById("lbm-container").style.display = "none";
    }
}

// Hesapla butonuna tıklandığında
document.getElementById("calculate-btn").addEventListener("click", function() {
    // Form doğrulaması
    const fitnessCalculatorForm = document.getElementById("fitness-calculator");
    const allInputs = fitnessCalculatorForm.querySelectorAll("input[required], select[required]");
    let isValid = true;
    
    allInputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.classList.add("error");
        } else {
            input.classList.remove("error");
        }
    });
    
    if (!isValid) {
        alert("Lütfen tüm gerekli alanları doldurun.");
        return;
    }
    
    // Hesaplama fonksiyonunu çağır
    calculateFitness();
});

// Vücut yağ oranını kalori hesaplayıcıya aktarma fonksiyonu
document.getElementById("transfer-fat-btn").addEventListener("click", function() {
    const fatPercentage = document.getElementById("fat-percentage").textContent;
    
    if (fatPercentage !== "--") {
        // Yağ yüzdesini sayıya çevir (% işaretini kaldır)
        const fatValue = parseFloat(fatPercentage.replace("%", ""));
        
        // Değeri kalori hesaplayıcıdaki alana aktar
        document.getElementById("body-fat-percentage").value = fatValue;
        
        // Sayfayı kalori hesaplayıcıya kaydır
        document.getElementById("fitness-calculator").scrollIntoView({ behavior: "smooth" });
        
        // Kullanıcıya bilgi ver
        alert("Vücut yağ oranı kalori hesaplayıcıya aktarıldı. Lütfen diğer bilgileri doldurup hesaplama yapın.");
    } else {
        alert("Lütfen önce vücut yağ oranını hesaplayın.");
    }
});

// BMI Hesaplama Fonksiyonu
function calculateBMI(weight, height) {
    return (weight / ((height / 100) * (height / 100)));
}

// BMI Kategorisi
function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Düşük Kilo';
    if (bmi >= 18.5 && bmi < 25) return 'Normal Kilo';
    if (bmi >= 25 && bmi < 30) return 'Fazla Kilo';
    if (bmi >= 30) return 'Obezite';
    return 'Bilinmeyen';
}

// BMR Hesaplama (Basal Metabolic Rate - Mifflin-St Jeor denklemi)
function calculateBMR(weight, height, age, gender) {
    if (gender === 'male') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
}