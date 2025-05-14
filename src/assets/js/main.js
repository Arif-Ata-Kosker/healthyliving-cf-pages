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
    
    // Hesaplayıcı Fonksiyonları - Bu kısmı kaldırıyoruz (aşağıda daha kapsamlı bir versiyonu var)
    // const calculateBtn = document.getElementById('calculate-btn');
    // if (calculateBtn) {
    //     calculateBtn.addEventListener('click', function() {
    //         calculateFitness();
    //     });
    // }
    
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

// Initialize fitness calculator functionality
function initializeFitnessCalculator() {
    const calculateBtn = document.getElementById("calculate-btn");
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener("click", function() {
        // Simple validation
        const age = document.getElementById("age");
        const height = document.getElementById("height");
        const weight = document.getElementById("weight");
        const activity = document.getElementById("activity");
        
        if (!age || !height || !weight || !activity) {
            console.error("Form elements not found");
            return;
        }
        
        if (!age.value || !height.value || !weight.value || !activity.value) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }
        
        // All validation passed, perform calculation
        calculateFitness();
    });
}

// Fitness Hesaplayıcı Fonksiyonu
function calculateFitness() {
    try {
        // Get form elements
        const age = parseInt(document.getElementById("age").value);
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const height = parseFloat(document.getElementById("height").value);
        const weight = parseFloat(document.getElementById("weight").value);
        const activity = parseFloat(document.getElementById("activity").value);
        
        // Optional body fat percentage
        const bodyFatPercentageElement = document.getElementById("body-fat-percentage");
        const bodyFatPercentage = bodyFatPercentageElement && bodyFatPercentageElement.value ? 
                                 parseFloat(bodyFatPercentageElement.value) : 0;
        
        // BMI calculation
        const bmi = weight / ((height / 100) * (height / 100));
        const bmiRounded = Math.round(bmi * 10) / 10;
        
        // Ideal weight range
        const minIdealWeight = Math.round(18.5 * ((height / 100) * (height / 100)));
        const maxIdealWeight = Math.round(24.9 * ((height / 100) * (height / 100)));
        
        // LBM calculation
        let lbm = 0;
        if (bodyFatPercentage > 0) {
            lbm = weight * (1 - (bodyFatPercentage / 100));
        } else {
            if (gender === "male") {
                lbm = 0.407 * weight + 0.267 * height - 19.2;
            } else {
                lbm = 0.252 * weight + 0.473 * height - 48.3;
            }
        }
        
        // BMR calculation
        let bmr = 0;
        if (bodyFatPercentage > 0) {
            bmr = 370 + (21.6 * lbm);
        } else {
            if (gender === "male") {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }
        }
        
        // Daily calorie needs
        const dailyCalories = Math.round(bmr * activity);
        
        // BMI category
        let bmiCategory = "";
        if (bmi < 18.5) bmiCategory = "Zayıf";
        else if (bmi < 25) bmiCategory = "Normal";
        else if (bmi < 30) bmiCategory = "Fazla Kilolu";
        else bmiCategory = "Obez";
        
        // Display results
        const bmiResult = document.getElementById("bmi-result");
        const bmiCategoryElement = document.getElementById("bmi-category");
        const bmrResult = document.getElementById("bmr-result");
        const calorieResult = document.getElementById("calorie-result");
        const idealWeightResult = document.getElementById("ideal-weight-result");
        const lbmContainer = document.getElementById("lbm-container");
        const lbmResult = document.getElementById("lbm-result");
        
        // Check if elements exist before updating them
        if (bmiResult) bmiResult.textContent = bmiRounded;
        if (bmiCategoryElement) bmiCategoryElement.textContent = bmiCategory;
        if (bmrResult) bmrResult.textContent = Math.round(bmr);
        if (calorieResult) calorieResult.textContent = dailyCalories;
        if (idealWeightResult) idealWeightResult.textContent = minIdealWeight + " - " + maxIdealWeight;
        
        // Show LBM results if body fat percentage is provided
        if (bodyFatPercentage > 0 && lbmContainer && lbmResult) {
            lbmContainer.style.display = "block";
            lbmResult.textContent = Math.round(lbm * 10) / 10;
        } else if (lbmContainer) {
            lbmContainer.style.display = "none";
        }
        
        // Show results section
        const resultsSection = document.querySelector(".results-section");
        if (resultsSection && resultsSection.style.display === "none") {
            resultsSection.style.display = "block";
        }
    } catch (error) {
        console.error("Hesaplama sırasında bir hata oluştu:", error);
        alert("Hesaplama yapılırken bir hata oluştu. Lütfen tüm alanları doğru doldurduğunuzdan emin olun.");
    }
}

// Vücut yağ oranını kalori hesaplayıcıya aktarma fonksiyonu
document.addEventListener("DOMContentLoaded", function() {
    const transferFatBtn = document.getElementById("transfer-fat-btn");
    if (transferFatBtn) {
        transferFatBtn.addEventListener("click", function() {
            const fatPercentage = document.getElementById("fat-percentage");
            const bodyFatInput = document.getElementById("body-fat-percentage");
            
            if (!fatPercentage || !bodyFatInput) {
                console.error("Yağ oranı aktarımı için gereken alanlar bulunamadı");
                return;
            }
            
            if (fatPercentage.textContent !== "--") {
                // Yağ yüzdesini sayıya çevir (% işaretini kaldır)
                const fatValue = parseFloat(fatPercentage.textContent.replace("%", ""));
                
                // Değeri kalori hesaplayıcıdaki alana aktar
                bodyFatInput.value = fatValue;
                
                // Sayfayı kalori hesaplayıcıya kaydır
                const fitnessCalculator = document.getElementById("fitness-calculator");
                if (fitnessCalculator) {
                    fitnessCalculator.scrollIntoView({ behavior: "smooth" });
                }
                
                // Kullanıcıya bilgi ver
                alert("Vücut yağ oranı kalori hesaplayıcıya aktarıldı. Lütfen diğer bilgileri doldurup hesaplama yapın.");
            } else {
                alert("Lütfen önce vücut yağ oranını hesaplayın.");
            }
        });
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