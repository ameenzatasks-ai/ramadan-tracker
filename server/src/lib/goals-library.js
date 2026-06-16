// Ramadan goals library — 6 categories with curated suggestions
// Each goal can be expanded into 30 daily variations or used as-is.

export const CATEGORIES = ['salah', 'quran', 'charity', 'family', 'adhkar', 'dua'];

export const GOALS_BY_CATEGORY = {
  salah: [
    'Pray all five daily prayers',
    'Pray all five daily prayers on time',
    'Pray all five daily prayers without rushing',
    'Pray all five daily prayers with focus (khushu)',
    'Pray all five daily prayers in congregation if possible',
    'Avoid delaying any of the five daily prayers',
    'Pray all five daily prayers without distractions',
    'Maintain consistency in all five daily prayers',
    'Pray all five daily prayers with intention and presence',
    'Ensure no obligatory prayer is missed today',
  ],
  quran: [
    'Read at least one page of the Quran today',
    'Read at least two pages of the Quran today',
    'Read one short surah from the Quran today',
    'Memorize one new verse today',
    'Review one previously memorized verse today',
    'Recite Quran slowly with attention to meaning',
    'Listen to Quran recitation for at least 10 minutes',
    'Read Quran with translation for one page',
    'Practice correct pronunciation (tajweed) while reading',
    'Reflect on one verse after reading today',
  ],
  charity: [
    'Give a small amount of charity today',
    'Give charity every Friday',
    'Donate food or water to someone in need',
    'Help someone financially in a small way today',
    'Contribute to a mosque or community cause',
    'Feed a fasting person today',
    'Donate to a verified charity organization',
    'Set aside a small amount for charity today',
    'Give charity quietly without seeking recognition',
    'Help someone in need using money or resources today',
  ],
  family: [
    'Spend at least 10 focused minutes with family today',
    'Speak kindly to all family members today',
    'Help a family member with a task today',
    'Check in on a family member\'s well-being',
    'Eat one meal together with family',
    'Resolve any tension calmly with family today',
    'Show patience with family throughout the day',
    'Express gratitude to a family member today',
    'Make time to listen to a family member today',
    'Do one act of kindness for family today',
  ],
  adhkar: [
    'Recite morning adhkar today',
    'Recite evening adhkar today',
    'Say tasbih (SubhanAllah) 33 times today',
    'Say tahmid (Alhamdulillah) 33 times today',
    'Say takbir (Allahu Akbar) 34 times today',
    'Engage in adhkar for at least 5 minutes',
    'Remember Allah during free moments today',
    'Recite a short dhikr consistently today',
    'Maintain mindfulness of Allah throughout the day',
    'End the day with remembrance of Allah',
  ],
  dua: [
    'Make dua at least once today',
    'Make dua for yourself today',
    'Make dua for your parents today',
    'Make dua for your family today',
    'Make dua for the Ummah today',
    'Make dua before iftar today',
    'Make dua with sincerity and focus',
    'Ask Allah for forgiveness today',
    'Make dua for guidance today',
    'Make dua for someone in need today',
  ],
};

// Get category display name
export function getCategoryLabel(category) {
  const labels = {
    salah: 'Salah (Prayer)',
    quran: 'Quran',
    charity: 'Charity',
    family: 'Family',
    adhkar: 'Adhkar (Remembrance)',
    dua: 'Dua (Supplication)',
  };
  return labels[category] || category;
}

// Get suggested goals for a category
export function getSuggestedGoals(category) {
  return GOALS_BY_CATEGORY[category] || [];
}
