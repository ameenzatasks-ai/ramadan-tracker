// 50 predefined goals per profile type, distributed across the 6 mandatory categories.
// Every goal is concrete, measurable, actionable, daily. No abstractions, no overlap
// between categories, no individual prayer names in Salah, no Dua/Adhkar in Salah.

export const CATEGORIES = [
  { key: 'salah',   label: 'Salah',   blurb: 'The five daily prayers and their Sunnah units.' },
  { key: 'quran',   label: 'Quran',   blurb: 'Reading, memorizing, and reflecting on the Quran.' },
  { key: 'charity', label: 'Charity', blurb: 'Giving — specific, time-bound, and reachable.' },
  { key: 'family',  label: 'Family',  blurb: 'Time and care with the people closest to you.' },
  { key: 'adhkar',  label: 'Adhkar',  blurb: 'Daily remembrance phrases.' },
  { key: 'dua',     label: 'Dua',     blurb: 'Personal supplication.' },
];

export const ADULT_GOALS = {
  salah: [
    'Pray all five daily prayers on time',
    'Pray two units of Tahajjud each night before Fajr',
    'Pray Duha after sunrise each morning',
    'Pray Witr before sleeping each night',
    'Pray the Sunnah Mu’akkadah units with each obligatory prayer',
    'Attend Taraweeh prayer at the mosque every night',
    'Pray two units of Tahiyyat-ul-Masjid each time entering the mosque',
    'Pray two units after Wudu each time it is performed',
  ],
  quran: [
    'Read one Juz of the Quran each day',
    'Memorize one new verse each day',
    'Memorize Surah Al-Mulk by the end of Ramadan',
    'Read one short surah after Fajr each morning',
    'Listen to one Surah with its translation each day',
    'Read Surah Al-Kahf every Friday of Ramadan',
    'Reflect on five verses each day with a tafsir',
    'Recite Surah Yasin after Fajr each day',
    'Recite the last ten verses of Surah Al-Imran before sleeping',
    'Recite Surah Al-Waqi’ah each evening',
  ],
  charity: [
    'Give a small amount of charity every Friday',
    'Donate to a food drive in the last week of Ramadan',
    'Sponsor one iftar meal each week of Ramadan',
    'Donate one item of clothing each week of Ramadan',
    'Donate to a local mosque on the last Friday of Ramadan',
    'Pay Zakat al-Fitr before Eid prayer',
  ],
  family: [
    'Have iftar with family each evening',
    'Call one family member each day to check on them',
    'Read a Ramadan story to a child each night',
    'Help prepare iftar three times each week',
    'Spend 30 minutes after Maghrib with parents each day',
    'Send a kind message to a sibling each day',
    'Visit grandparents on the weekends of Ramadan',
    'Eat suhoor with family each morning',
  ],
  adhkar: [
    'Recite the morning Adhkar after Fajr each day',
    'Recite the evening Adhkar after Asr each day',
    'Say SubhanAllah, Alhamdulillah, Allahu Akbar 33 times each after Fajr',
    'Say Astaghfirullah 100 times before sleeping',
    'Recite Ayatul Kursi after every obligatory prayer',
    'Say La ilaha illa Allah 100 times each day',
    'Recite the three Quls before sleeping each night',
    'Say Allahumma A’inni ‘ala dhikrika after each prayer',
    'Say Bismillah aloud before eating each meal',
    'Say Subhana Rabbi al-A’la 33 times across the day’s sujood',
  ],
  dua: [
    'Make Dua for parents after each obligatory prayer',
    'Make Dua for the Ummah after Asr each day',
    'Memorize one new Dua each week of Ramadan',
    'Make Dua during the last third of every night',
    'Make Dua at the moment of breaking the fast each evening',
    'Make Dua between the Adhan and Iqamah for each prayer',
    'Recite the Dua of Laylatul Qadr on each of the last ten nights',
    'Make Dua for forgiveness 70 times each day',
  ],
};

export const CHILD_GOALS = {
  salah: [
    'Pray five times every day',
    'Learn the Arabic words of one prayer position each week',
    'Pray with mom or dad each evening',
    'Make Wudu by yourself each day',
    'Pray two extra Sunnah units after Dhuhr each day',
    'Memorize the at-Tashahhud by the end of Ramadan',
    'Bring a prayer mat to the mosque each Friday',
    'Pray Witr before bedtime each night',
  ],
  quran: [
    'Read one page of the Quran with a parent each day',
    'Memorize one short verse each day',
    'Learn the meaning of one verse each day',
    'Memorize Surah Al-Fatihah perfectly by the end of Ramadan',
    'Listen to a Quran story each night before bed',
    'Practice Quran reading with a parent for 15 minutes each day',
    'Memorize one new short surah by the end of Ramadan',
    'Recite Surah Al-Ikhlas three times before sleeping',
    'Color a page from a Quran story book each day',
    'Recite one short surah aloud at home each evening',
  ],
  charity: [
    'Give one small toy to charity each week of Ramadan',
    'Save one coin into a charity jar each day',
    'Share your snack with a sibling each day',
    'Help pack food for a neighbor each Friday',
    'Donate one book to the library each week of Ramadan',
    'Help carry groceries for an elder once each week',
  ],
  family: [
    'Help set the iftar table each evening',
    'Help clean up after iftar each night',
    'Read a bedtime story to a younger sibling each night',
    'Hug a family member each morning',
    'Say thank you to a family member each day',
    'Help a sibling with homework three times each week',
    'Eat suhoor with family each morning',
    'Draw a picture for a grandparent each weekend',
  ],
  adhkar: [
    'Say Bismillah before each meal',
    'Say Alhamdulillah after each meal',
    'Say Astaghfirullah ten times before bed',
    'Learn one new dhikr each week of Ramadan',
    'Say SubhanAllah ten times each morning',
    'Say Allahu Akbar ten times each evening',
    'Recite the three Quls before sleeping each night',
    'Send Salawat on the Prophet ten times each day',
    'Say La hawla wa la quwwata illa billah ten times each day',
    'Say SubhanAllahi wa bihamdihi 100 times each day',
  ],
  dua: [
    'Make Dua before eating each meal',
    'Make Dua when waking up each morning',
    'Make Dua before sleeping each night',
    'Make a Dua for your parents each day',
    'Make a Dua for your friends each day',
    'Learn one new Dua each week of Ramadan',
    'Make a Dua for the sick each Friday',
    'Make a Dua when breaking your fast each evening',
  ],
};

// Each category shows 4-5 example goals (spec). We rotate examples by hashing
// the profile id so each profile gets a stable but distinct sample.
export function getExamples(profileType, category, profileId = 0) {
  const pool = (profileType === 'child' ? CHILD_GOALS : ADULT_GOALS)[category] || [];
  if (pool.length <= 5) return pool;
  const start = Math.abs(profileId) % pool.length;
  const out = [];
  for (let i = 0; i < 5; i++) out.push(pool[(start + i) % pool.length]);
  return out;
}

export function getAllForCategory(profileType, category) {
  return (profileType === 'child' ? CHILD_GOALS : ADULT_GOALS)[category] || [];
}
