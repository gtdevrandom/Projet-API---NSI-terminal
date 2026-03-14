// ============================================
// API OPENFOODFACTS - FOOD SEARCH & MANAGEMENT
// ============================================

let currentFoodData = null;
let foodSearchResults = [];

function openFoodSearchModal() {
  modal.open('food-search-modal');
  document.getElementById('food-search-input').value = '';
  document.getElementById('food-search-results').innerHTML = '';
  foodSearchResults = [];
}

function closeFoodSearchModal() {
  modal.close('food-search-modal');
}

function closeFoodDetailsModal() {
  modal.close('food-details-modal');
  currentFoodData = null;
}

async function searchFoods() {
  const query = document.getElementById('food-search-input').value.trim();
  if (!query) {
    alert('Veuillez entrer un terme de recherche');
    return;
  }

  const resultsDiv = document.getElementById('food-search-results');
  resultsDiv.innerHTML = '<div style="text-align:center;padding:20px;opacity:0.7;color:var(--text-color);">Recherche en cours...</div>';

  try {
    const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`);
    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      resultsDiv.innerHTML = '<div style="text-align:center;padding:20px;opacity:0.6;color:var(--text-color);">Aucun aliment trouvé</div>';
      return;
    }

    foodSearchResults = data.products.filter(p => p.nutriments && (p.nutriments.energy_kcal || p.nutriments.energy_100g));
    
    if (foodSearchResults.length === 0) {
      resultsDiv.innerHTML = '<div style="text-align:center;padding:20px;opacity:0.6;color:var(--text-color);">Aucun aliment avec données nutritionnelles</div>';
      return;
    }

    resultsDiv.innerHTML = foodSearchResults.slice(0, 10).map((product, idx) => `
      <div class="food-search-item" data-index="${idx}">
        <div style="font-weight:600;margin-bottom:4px;">${product.product_name || 'Produit sans nom'}</div>
        <div style="font-size:12px;opacity:0.7;">Marque: ${product.brands || 'Non spécifiée'}</div>
      </div>
    `).join('');
    
    document.querySelectorAll('.food-search-item').forEach(item => {
      const idx = parseInt(item.getAttribute('data-index'));
      item.addEventListener('click', () => selectFoodByIndex(idx));
      item.addEventListener('mouseover', function() {
        this.style.background = 'var(--input-bg)';
        this.style.opacity = '0.8';
      });
      item.addEventListener('mouseout', function() {
        this.style.background = 'var(--card-bg)';
        this.style.opacity = '1';
      });
    });
  } catch (error) {
    console.error('Erreur API Open Food Facts:', error);
    resultsDiv.innerHTML = '<div style="text-align:center;padding:20px;color:#ff6b6b;">Erreur lors de la recherche. Vérifiez votre connexion.</div>';
  }
}

function selectFoodByIndex(idx) {
  if (idx >= 0 && idx < foodSearchResults.length) {
    selectFood(foodSearchResults[idx]);
  }
}

function selectFood(product) {
  currentFoodData = product;
  
  const nutriments = product.nutriments || {};
  const calories = nutriments.energy_kcal || (nutriments.energy_100g ? nutriments.energy_100g / 100 : 0);
  const proteins = nutriments.proteins_100g || 0;
  const carbs = nutriments.carbohydrates_100g || 0;
  const fats = nutriments.fat_100g || 0;

  const detailsContent = document.getElementById('food-details-content');
  detailsContent.innerHTML = `
    <div style="padding:8px;background:var(--card-bg);border-radius:6px;color:var(--text-color);">
      <div style="font-weight:600;margin-bottom:8px;">${product.product_name || 'Produit'}</div>
      <div style="font-size:13px;margin-bottom:8px;">Marque: ${product.brands || 'Non spécifiée'}</div>
      <div style="border-top:1px solid var(--card-border);padding-top:8px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div><span style="opacity:0.7;">Calories (100g):</span> <strong>${calories.toFixed(1)} kcal</strong></div>
          <div><span style="opacity:0.7;">Protéines (100g):</span> <strong>${proteins.toFixed(1)}g</strong></div>
          <div><span style="opacity:0.7;">Glucides (100g):</span> <strong>${carbs.toFixed(1)}g</strong></div>
          <div><span style="opacity:0.7;">Lipides (100g):</span> <strong>${fats.toFixed(1)}g</strong></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('food-details-title').textContent = product.product_name || 'Détails de l\'aliment';
  document.getElementById('food-quantity-input').value = '100';
  modal.close('food-search-modal');
  modal.open('food-details-modal');
}

function addFoodToDay() {
  if (!currentFoodData) {
    alert('Veuillez sélectionner un aliment');
    return;
  }

  const quantity = parseFloat(document.getElementById('food-quantity-input').value);
  if (isNaN(quantity) || quantity <= 0) {
    alert('Veuillez entrer une quantité valide');
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const nutritionData = getNutritionData();
  if (!nutritionData[today]) nutritionData[today] = [];

  const nutriments = currentFoodData.nutriments || {};
  const calories = (nutriments.energy_kcal || (nutriments.energy_100g ? nutriments.energy_100g / 100 : 0)) * (quantity / 100);
  const proteins = (nutriments.proteins_100g || 0) * (quantity / 100);
  const carbs = (nutriments.carbohydrates_100g || 0) * (quantity / 100);
  const fats = (nutriments.fat_100g || 0) * (quantity / 100);

  const foodItem = {
    id: Date.now(),
    name: currentFoodData.product_name || 'Produit',
    quantity: quantity,
    calories: calories,
    proteins: proteins,
    carbs: carbs,
    fats: fats,
    timestamp: new Date().toISOString()
  };

  nutritionData[today].push(foodItem);
  storage.set('nutritionData', nutritionData);
  
  closeFoodDetailsModal();
  displayFoodsList();
  updateNutritionDisplay();
  updateHomeNutrition(); 
  if (window.refreshAISuggestions) {
    setTimeout(() => window.refreshAISuggestions(), 500);
  }
}

function displayFoodsList() {
  const foods = getTodayFoods();
  const foodsList = document.getElementById('foods-list');
  
  if (foods.length === 0) {
    foodsList.innerHTML = '<div style="text-align:center;opacity:0.6;color:var(--text-color);">Aucun aliment ajouté</div>';
    return;
  }

  foodsList.innerHTML = foods.map((food, idx) => `
    <div style="padding:8px;border:1px solid var(--card-border);border-radius:6px;display:flex;justify-content:space-between;align-items:center;background:var(--card-bg);color:var(--text-color);">
      <div>
        <div style="font-weight:600;">${food.name}</div>
        <div style="font-size:12px;opacity:0.7;">${food.quantity}g | ${food.calories.toFixed(0)} kcal</div>
      </div>
      <button style="background:#ff6b6b;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:12px;" onclick="removeFoodFromDay(${idx})">Supprimer</button>
    </div>
  `).join('');
}

function removeFoodFromDay(index) {
  const today = new Date().toISOString().split('T')[0];
  const nutritionData = getNutritionData();
  
  if (nutritionData[today]) {
    nutritionData[today].splice(index, 1);
    storage.set('nutritionData', nutritionData);
    displayFoodsList();
    updateNutritionDisplay();
  }
}
