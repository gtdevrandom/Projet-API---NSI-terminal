// ==========================================
// 1. RÉCUPÉRATION DES DONNÉES UTILISATEUR
// ==========================================

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

// ==========================================
// 2. FORMATAGE DES DONNÉES POUR L'IA
// ==========================================

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

// ==========================================
// 3. APPEL API À L'IA
// ==========================================

async function callAI(prompt, maxTokens = 200) {
  try {

    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [
          { role: "system", content: "Tu es KaliFit, un assistant fitness expert et bienveillant. Ne fait pas de mise en forme (gras, italique, etc.) et ne fait pas sous forme de points. Fait une seule suggestion." },
          { role: "user", content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    const result = await response.json();

    if (result.choices && result.choices[0]) {
      return result.choices[0].message.content.trim();
    }

    return null;

  } catch (error) {
    console.error("Erreur IA:", error);
    return null;
  }
}

// ==========================================
// 4. GÉNÉRATION DES SUGGESTIONS
// ==========================================

// 4.1 Suggestion Nutrition
async function generateNutritionSuggestion() {

  const data = formatDataForAI();

  const mealsText = data.recentMeals.length > 0 
    ? data.recentMeals.map(m => `${m.date}: ${m.name}`).join(', ')
    : "Aucun repas enregistré";

  const prompt = `Tu es un nutritionniste expert. Basé sur les repas récents: ${mealsText}
Donne 1 suggestion courte et pratique pour améliorer l'alimentation. Réponds en français.Ne fait pas de mise en forme (gras, italique, etc.) et ne fait pas sous forme de points.`;

  return await callAI(prompt, 200);
}

// 4.2 Suggestion Entraînement
async function generateWorkoutSuggestion() {

  const data = formatDataForAI();

  const sessionsText = data.recentSessions.length > 0 
    ? data.recentSessions.map(s => `${s.date}: ${s.type} (${s.duration}min)`).join(', ')
    : "Aucune séance enregistrée";

  const weightInfo = data.lastWeight
    ? `Poids actuel: ${data.lastWeight}kg, Objectif: ${data.goal}kg`
    : "Pas de données de poids";

  const prompt = `Tu es un coach fitness expert.
Séances récentes: ${sessionsText}
${weightInfo}

Donne 1 suggestion d'entraînement courte (2-3 phrases). Réponds en français. Ne fait pas de mise en forme (gras, italique, etc.) et ne fait pas sous forme de points.ss`;

  return await callAI(prompt, 200);
}

// 4.3 Suggestion Statistiques & Encouragement
async function generateStatisticsSuggestion() {

  const data = getUserData();
  
  // Calcul des statistiques
  const weightData = data.weight;
  const sessions = data.sessions;
  const sleepData = data.sleep;
  const goals = data.goals;
  
  // Poids
  let weightProgress = "";
  if (weightData.length >= 2) {
    const currentWeight = weightData[weightData.length - 1].value;
    const startWeight = weightData[0].value;
    const change = startWeight - currentWeight;
    if (change > 0) {
      weightProgress = `Perte de ${change.toFixed(1)}kg (${startWeight}kg → ${currentWeight}kg)`;
    } else if (change < 0) {
      weightProgress = `Prise de ${Math.abs(change).toFixed(1)}kg (${startWeight}kg → ${currentWeight}kg)`;
    } else {
      weightProgress = `Poids stable à ${currentWeight}kg`;
    }
  } else if (weightData.length === 1) {
    weightProgress = `Poids initial: ${weightData[0].value}kg`;
  } else {
    weightProgress = "Aucune donnée de poids";
  }
  
  // Séances
  let sessionsStats = "Aucune séance enregistrée";
  if (sessions.length > 0) {
    const thisWeekSessions = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return sessionDate >= oneWeekAgo;
    }).length;
    
    const totalSessions = sessions.length;
    const avgDuration = Math.round(sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length);
    sessionsStats = `${totalSessions} séances totales, ${thisWeekSessions} cette semaine, ${avgDuration}min en moyenne`;
  }
  
  // Sommeil
  let sleepStats = "Aucune donnée de sommeil";
  if (sleepData.length > 0) {
    const avgSleep = (sleepData.reduce((sum, s) => sum + s.duration, 0) / sleepData.length).toFixed(1);
    const lastSleep = sleepData[sleepData.length - 1].duration;
    sleepStats = `Sommeil moyen: ${avgSleep}h, Dernière nuit: ${lastSleep}h`;
  }
  
  // Objectifs
  let goalInfo = "Aucun objectif défini";
  if (goals.weightGoal && goals.weight) {
    const direction = goals.weightGoal === 'lose' ? 'perdre' : 'gagner';
    goalInfo = `Objectif: ${direction} pour atteindre ${goals.weight}kg`;
  }
  
  const prompt = `Tu es un coach fitness bienveillant et motivant. Basé sur les statistiques suivantes de l'utilisateur:
- Progression poids: ${weightProgress}
- Entraînements: ${sessionsStats}
- Sommeil: ${sleepStats}
- Objectif: ${goalInfo}

Donne un message d'encouragement court (2-3 phrases maximum) qui:
1. Reconnaît les efforts et la progression
2. Motive l'utilisateur à continuer
3. Donne un conseil spécifique basé sur ses données

Réponds en français. Ne fait pas de mise en forme (gras, italique, etc.) et ne fait pas sous forme de points.`;

  return await callAI(prompt, 250);
}

// ==========================================
// 5. MISE À JOUR DES SUGGESTIONS DANS L'UI
// ==========================================

async function updateAllAISuggestions() {

  try {

    const nutritionSuggestion = await generateNutritionSuggestion();
    if (nutritionSuggestion) {
      const nutritionCard = document.querySelectorAll('.ia-text')[0];
      if (nutritionCard) {
        nutritionCard.innerHTML = nutritionSuggestion.split('\n').slice(0,3).join('<br>');
        nutritionCard.classList.add('ia-updated');
      }
    }

    const workoutSuggestion = await generateWorkoutSuggestion();
    if (workoutSuggestion) {
      const workoutCard = document.querySelectorAll('.ia-text')[1];
      if (workoutCard) {
        workoutCard.innerHTML = workoutSuggestion.split('\n').slice(0,3).join('<br>');
        workoutCard.classList.add('ia-updated');
      }
    }

    const statisticsSuggestion = await generateStatisticsSuggestion();
    if (statisticsSuggestion) {
      const statsCard = document.querySelector('#screen-stats .ia-text');
      if (statsCard) {
        statsCard.innerHTML = statisticsSuggestion.split('\n').slice(0,3).join('<br>');
        statsCard.classList.add('ia-updated');
      }
    }

  } catch (error) {
    console.error("Erreur lors de la mise à jour IA:", error);
  }
}

// ==========================================
// 6. RAFRAÎCHISSEMENT DES SUGGESTIONS
// ==========================================

function refreshAISuggestions() {
  updateAllAISuggestions().catch(error =>
    console.error("Erreur rafraîchissement IA:", error)
  );
}

window.refreshAISuggestions = refreshAISuggestions;

// ==========================================
// 7. INITIALISATION ET MISE À JOUR AUTOMATIQUE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  setTimeout(() => {
    updateAllAISuggestions();
    console.log('[IA] Suggestions mises à jour');
  }, 1500);

});

setInterval(() => {

  updateAllAISuggestions();
  console.log('[IA] Rafraîchissement automatique');

}, 7200000);

// ==========================================
// 8. OBSERVATEUR DE STOCKAGE LOCALE
// ==========================================

const originalSet = Storage.prototype.setItem;

Storage.prototype.setItem = function(key, value) {

  originalSet.call(this, key, value);

  if (['weightData','mealsData','sessionsData','sleepData','nutritionData'].includes(key)) {

    console.log(`[IA] Données mises à jour: ${key}`);

    if (window.refreshAISuggestions) {
      setTimeout(() => window.refreshAISuggestions(), 300);
    }

  }

};
