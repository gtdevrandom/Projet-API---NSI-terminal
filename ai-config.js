// Token Hugging Face
const HF_TOKEN = "";

// Récupère les données utilisateur
function getUserData() {
  const weightData = storage.get('weightData', []);
  const sleepData = storage.get('sleepData', []);
  const mealsData = storage.get('mealsData', []);
  const sessionsData = storage.get('sessionsData', []);
  const goals = storage.get('goals', {});
  const settings = storage.get('settings', {});
  
  return {
    weight: weightData,
    sleep: sleepData,
    meals: mealsData,
    sessions: sessionsData,
    goals: goals,
    settings: settings
  };
}

// Formatte les données pour l'IA
function formatDataForAI() {
  const data = getUserData();
  
  const lastWeight = data.weight.length > 0 ? data.weight[data.weight.length - 1].value : null;
  const lastSleep = data.sleep.length > 0 ? data.sleep[data.sleep.length - 1].duration : null;
  const recentMeals = data.meals.slice(-3);
  const recentSessions = data.sessions.slice(-3);
  
  return {
    lastWeight: lastWeight,
    height: data.settings.height || null,
    goal: data.goals.weightGoal || null,
    lastSleep: lastSleep,
    recentMeals: recentMeals,
    recentSessions: recentSessions
  };
}

// Génère une suggestion nutritionnelle
async function generateNutritionSuggestion() {
  const data = formatDataForAI();
  
  const mealsText = data.recentMeals.length > 0 
    ? data.recentMeals.map(m => `${m.date}: ${m.name}`).join(', ')
    : "Aucun repas enregistré";
  
  const prompt = `Tu es un nutritionniste expert. Basé sur les repas récents: ${mealsText}
Donne 3 suggestions courtes et pratiques pour améliorer l'alimentation. Réponds en français, format texte simple sans numérotation.`;

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [
          { role: "system", content: "Tu es KaliFit, un assistant fitness expert et bienveillant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const result = await response.json();
    
    if (result.choices && result.choices[0]) {
      return result.choices[0].message.content.trim();
    }
    return null;
  } catch (error) {
    console.error("Erreur IA Nutrition:", error);
    return null;
  }
}

// Génère une suggestion d'entraînement
async function generateWorkoutSuggestion() {
  const data = formatDataForAI();
  
  const sessionsText = data.recentSessions.length > 0 
    ? data.recentSessions.map(s => `${s.date}: ${s.type} (${s.duration}min)`).join(', ')
    : "Aucune séance enregistrée";
  
  const weightInfo = data.lastWeight ? `Poids actuel: ${data.lastWeight}kg, Objectif: ${data.goal}kg` : "Pas de données de poids";
  
  const prompt = `Tu es un coach fitness expert. 
Séances récentes: ${sessionsText}
${weightInfo}

Donne une suggestion d'entraînement courte (2-3 phrases) adaptée. Réponds en français.`;

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [
          { role: "system", content: "Tu es KaliFit, un assistant fitness expert et bienveillant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const result = await response.json();
    
    if (result.choices && result.choices[0]) {
      return result.choices[0].message.content.trim();
    }
    return null;
  } catch (error) {
    console.error("Erreur IA Entraînement:", error);
    return null;
  }
}

// Génère une suggestion de sommeil
async function generateSleepSuggestion() {
  const data = formatDataForAI();
  
  const sleepInfo = data.lastSleep ? `Sommeil dernière nuit: ${data.lastSleep}h` : "Pas de données de sommeil";
  
  const prompt = `Tu es un expert en sommeil et santé.
${sleepInfo}

Donne une suggestion pour améliorer le sommeil (2-3 phrases). Réponds en français.`;

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [
          { role: "system", content: "Tu es KaliFit, un assistant fitness expert et bienveillant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    const result = await response.json();
    
    if (result.choices && result.choices[0]) {
      return result.choices[0].message.content.trim();
    }
    return null;
  } catch (error) {
    console.error("Erreur IA Sommeil:", error);
    return null;
  }
}

// Met à jour les suggestions IA dans le HTML
async function updateAllAISuggestions() {
  try {
    // Suggestion Nutrition
    const nutritionSuggestion = await generateNutritionSuggestion();
    if (nutritionSuggestion) {
      const nutritionCard = document.querySelectorAll('.ia-text')[0];
      if (nutritionCard) {
        nutritionCard.innerHTML = nutritionSuggestion.split('\n').slice(0, 3).join('<br>');
        nutritionCard.classList.add('ia-updated');
      }
    }

    // Suggestion Entraînement
    const workoutSuggestion = await generateWorkoutSuggestion();
    if (workoutSuggestion) {
      const workoutCard = document.querySelectorAll('.ia-text')[1];
      if (workoutCard) {
        workoutCard.innerHTML = workoutSuggestion.split('\n').slice(0, 3).join('<br>');
        workoutCard.classList.add('ia-updated');
      }
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des suggestions IA:", error);
  }
}

// Fonction pour rafraîchir les suggestions immédiatement
function refreshAISuggestions() {
  updateAllAISuggestions().catch(error => console.error("Erreur lors du rafraîchissement IA:", error));
}

// Export globale pour accès dans script.js
window.refreshAISuggestions = refreshAISuggestions;

// Lance les suggestions au chargement
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    updateAllAISuggestions();
    console.log('[IA] Suggestions mises à jour au chargement');
  }, 1500);
});

// Rafraîchir les suggestions toutes les 2 heures
setInterval(() => {
  updateAllAISuggestions();
  console.log('[IA] Rafraîchissement automatique');
}, 7200000);

// Observer les changements de données dans le localStorage
const originalSet = Storage.prototype.setItem;
Storage.prototype.setItem = function(key, value) {
  originalSet.call(this, key, value);
  
  // Rafraîchir les suggestions quand certaines données changent
  if (['weightData', 'mealsData', 'sessionsData', 'sleepData', 'nutritionData'].includes(key)) {
    console.log(`[IA] Données mises à jour: ${key}`);
    if (window.refreshAISuggestions) {
      setTimeout(() => window.refreshAISuggestions(), 300);
    }
  }
};
