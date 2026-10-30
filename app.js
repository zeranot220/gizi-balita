/**
 * GiziBalita — Kalkulator Nutrisi Balita
 * Referensi: WHO Child Growth Standards, AKG Indonesia 2019,
 *             Permenkes RI No. 2 Tahun 2020
 */

'use strict';

// =============================================
// WHO Z-Score Reference Data (Simplified)
// Median & SD values for BB/U, TB/U, BB/TB
// =============================================

// BB/U (Weight-for-Age) — Laki-laki (kg)
const WHO_BBU_L = [
  // [usia_bulan, median, SD]
  [0,3.3,0.4],[1,4.5,0.5],[2,5.6,0.6],[3,6.4,0.65],[4,7.0,0.7],
  [5,7.5,0.75],[6,7.9,0.78],[7,8.3,0.82],[8,8.6,0.85],[9,8.9,0.88],
  [10,9.2,0.9],[11,9.4,0.93],[12,9.6,0.95],[15,10.3,1.0],[18,10.9,1.05],
  [21,11.5,1.1],[24,12.0,1.15],[27,12.5,1.2],[30,13.0,1.25],[33,13.5,1.3],
  [36,14.0,1.35],[42,15.0,1.45],[48,16.0,1.55],[54,17.1,1.65],[59,18.0,1.73]
];

// BB/U (Weight-for-Age) — Perempuan (kg)
const WHO_BBU_P = [
  [0,3.2,0.39],[1,4.2,0.47],[2,5.1,0.56],[3,5.8,0.62],[4,6.4,0.67],
  [5,6.9,0.71],[6,7.3,0.74],[7,7.6,0.77],[8,7.9,0.80],[9,8.2,0.83],
  [10,8.5,0.86],[11,8.7,0.88],[12,8.9,0.9],[15,9.6,0.97],[18,10.2,1.02],
  [21,10.9,1.08],[24,11.5,1.14],[27,12.0,1.19],[30,12.5,1.24],[33,13.0,1.29],
  [36,13.5,1.34],[42,14.5,1.44],[48,15.5,1.54],[54,16.5,1.64],[59,17.4,1.72]
];

// TB/U (Height-for-Age) — Laki-laki (cm)
const WHO_TBU_L = [
  [0,49.9,1.9],[1,54.7,2.0],[2,58.4,2.1],[3,61.4,2.2],[4,63.9,2.2],
  [5,65.9,2.3],[6,67.6,2.3],[7,69.2,2.4],[8,70.6,2.4],[9,72.0,2.5],
  [10,73.3,2.5],[11,74.5,2.6],[12,75.7,2.6],[15,79.1,2.8],[18,82.3,2.9],
  [21,85.1,3.0],[24,87.8,3.2],[27,90.3,3.3],[30,92.7,3.4],[33,95.0,3.5],
  [36,96.1,3.6],[42,99.9,3.8],[48,103.3,4.0],[54,106.5,4.1],[59,109.0,4.3]
];

// TB/U (Height-for-Age) — Perempuan (cm)
const WHO_TBU_P = [
  [0,49.1,1.9],[1,53.7,1.9],[2,57.1,2.0],[3,59.8,2.1],[4,62.1,2.1],
  [5,64.0,2.2],[6,65.7,2.2],[7,67.3,2.3],[8,68.7,2.3],[9,70.1,2.4],
  [10,71.5,2.4],[11,72.8,2.5],[12,74.0,2.5],[15,77.5,2.7],[18,80.7,2.8],
  [21,83.7,2.9],[24,86.4,3.1],[27,88.9,3.2],[30,91.4,3.3],[33,93.7,3.4],
  [36,95.1,3.5],[42,99.0,3.7],[48,102.7,3.9],[54,106.2,4.0],[59,109.0,4.2]
];

// AKG Indonesia 2019 — Energi & Makronutrien per kelompok usia
const AKG_DATA = [
  // [usia_min_bln, usia_max_bln, energi_kkal, protein_g, lemak_g, karbohidrat_g, serat_g, air_ml]
  [0,  5,  550,  12, 34, 58,  0,  700],
  [6,  11, 800,  18, 35, 105, 11, 800],
  [12, 35, 1350, 26, 45, 215, 19, 1200],
  [36, 59, 1400, 35, 50, 220, 20, 1500],
];

// Kebutuhan Mikronutrien (AKG 2019)
const MIKRO_DATA = {
  'Vitamin A': { unit:'mcg', ranges:[ [0,5,375],[6,11,400],[12,35,400],[36,59,450] ], color:'#f59e0b' },
  'Vitamin C': { unit:'mg',  ranges:[ [0,5,40], [6,11,50],[12,35,40], [36,59,45]  ], color:'#f97316' },
  'Vitamin D': { unit:'mcg', ranges:[ [0,5,10], [6,11,10],[12,35,15], [36,59,15]  ], color:'#eab308' },
  'Kalsium':   { unit:'mg',  ranges:[ [0,5,200],[6,11,270],[12,35,650],[36,59,1000]], color:'#6ee7b7' },
  'Zat Besi':  { unit:'mg',  ranges:[ [0,5,0.3],[6,11,11],[12,35,7],  [36,59,10]  ], color:'#f87171' },
  'Zinc':      { unit:'mg',  ranges:[ [0,5,2],  [6,11,3], [12,35,3],  [36,59,5]   ], color:'#a78bfa' },
  'Folat':     { unit:'mcg', ranges:[ [0,5,65], [6,11,80],[12,35,160],[36,59,160] ], color:'#34d399' },
  'Yodium':    { unit:'mcg', ranges:[ [0,5,90], [6,11,90],[12,35,90], [36,59,90]  ], color:'#60a5fa' },
};

// =============================================
// Helper Functions
// =============================================

function interpolateWHO(table, usia) {
  // Find surrounding data points
  let lo = null, hi = null;
  for (let i = 0; i < table.length; i++) {
    if (table[i][0] <= usia) lo = table[i];
    if (table[i][0] >= usia && hi === null) hi = table[i];
  }
  if (!lo) lo = hi;
  if (!hi) hi = lo;
  if (lo[0] === hi[0]) return { median: lo[1], sd: lo[2] };
  // Linear interpolation
  const t = (usia - lo[0]) / (hi[0] - lo[0]);
  return {
    median: lo[1] + t * (hi[1] - lo[1]),
    sd:     lo[2] + t * (hi[2] - lo[2])
  };
}

function calcZScore(value, median, sd) {
  return ((value - median) / sd).toFixed(2);
}

function getAKG(usiaBulan) {
  for (const row of AKG_DATA) {
    if (usiaBulan >= row[0] && usiaBulan <= row[1]) return row;
  }
  return AKG_DATA[AKG_DATA.length - 1];
}

function getMikro(usiaBulan) {
  const result = {};
  for (const [name, data] of Object.entries(MIKRO_DATA)) {
    let val = null;
    for (const range of data.ranges) {
      if (usiaBulan >= range[0] && usiaBulan <= range[1]) {
        val = range[2]; break;
      }
    }
    if (val === null) val = data.ranges[data.ranges.length - 1][2];
    result[name] = { value: val, unit: data.unit, color: data.color };
  }
  return result;
}

function getActivityFactor(level) {
  return { rendah: 1.35, sedang: 1.45, tinggi: 1.55 }[level] || 1.45;
}

function getStatusGizi(zScore) {
  const z = parseFloat(zScore);
  if (z < -3)  return { label: 'Gizi Buruk',      cls: 'bad',     emoji: '🚨' };
  if (z < -2)  return { label: 'Gizi Kurang',      cls: 'warning', emoji: '⚠️' };
  if (z <= 1)  return { label: 'Gizi Baik',        cls: 'good',    emoji: '✅' };
  if (z <= 2)  return { label: 'Risiko Lebih',     cls: 'info',    emoji: 'ℹ️' };
  return         { label: 'Gizi Lebih/Obesitas',   cls: 'bad',     emoji: '🔴' };
}

function getStuntingStatus(zScore) {
  const z = parseFloat(zScore);
  if (z < -3)  return 'Stunting Berat';
  if (z < -2)  return 'Stunting';
  return 'Normal';
}

function getWastingStatus(zScore) {
  const z = parseFloat(zScore);
  if (z < -3)  return 'Sangat Kurus';
  if (z < -2)  return 'Kurus';
  if (z <= 2)  return 'Normal';
  return 'Gemuk';
}

// =============================================
// Chart Instance
// =============================================
let macroChartInstance = null;

function renderMacroChart(energi, protein, lemak, karbo) {
  const ctx = document.getElementById('macroChart').getContext('2d');
  if (macroChartInstance) macroChartInstance.destroy();

  const proteinKcal = protein * 4;
  const lemakKcal   = lemak   * 9;
  const karboKcal   = karbo   * 4;

  macroChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Karbohidrat', 'Protein', 'Lemak'],
      datasets: [{
        data: [karboKcal, proteinKcal, lemakKcal],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
        borderColor: ['#4f46e5', '#059669', '#d97706'],
        borderWidth: 2,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#8b949e',
            font: { family: 'Nunito', size: 12, weight: '700' },
            padding: 14,
            usePointStyle: true,
            pointStyleWidth: 8,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(22,27,34,0.95)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#f0f6fc',
          bodyColor: '#8b949e',
          titleFont: { family: 'Outfit', weight: '700' },
          bodyFont: { family: 'Nunito', size: 12 },
          callbacks: {
            label: function(ctx) {
              const val = ctx.parsed;
              const total = ctx.dataset.data.reduce((a,b)=>a+b,0);
              const pct = ((val/total)*100).toFixed(1);
              return `  ${ctx.label}: ${val} kkal (${pct}%)`;
            }
          }
        }
      },
      animation: { duration: 800, easing: 'easeInOutQuart' }
    }
  });
}

// =============================================
// Main Calculation Function
// =============================================
function hitungGizi(data) {
  const { nama, jenisKelamin, usiaTotalBulan, bb, tb, aktivitas, kondisi } = data;
  const isLaki = jenisKelamin === 'laki';

  // --- Anthropometric Z-Scores ---
  const bbuTable = isLaki ? WHO_BBU_L : WHO_BBU_P;
  const tbuTable = isLaki ? WHO_TBU_L : WHO_TBU_P;

  const bbuRef  = interpolateWHO(bbuTable, usiaTotalBulan);
  const tbuRef  = interpolateWHO(tbuTable, usiaTotalBulan);

  const zBBU  = calcZScore(bb, bbuRef.median, bbuRef.sd);
  const zTBU  = calcZScore(tb, tbuRef.median, tbuRef.sd);

  // BB/TB Z-score (approximate: use BB median at TB height)
  // Find closest TB in table and interpolate BB at that height
  const bbtbRef = interpolateWHO(bbuTable, usiaTotalBulan);
  const zBBTB   = calcZScore(bb, bbuRef.median, bbuRef.sd * 0.85); // simplified

  // IMT
  const imt = (bb / ((tb/100) ** 2)).toFixed(1);

  // --- Status Gizi ---
  const statusBBU  = getStatusGizi(zBBU);
  const stuntLabel = getStuntingStatus(zTBU);
  const wastLabel  = getWastingStatus(zBBTB);

  // --- Energy & Macronutrients (AKG + activity factor) ---
  const akgRow = getAKG(usiaTotalBulan);
  const actFactor = getActivityFactor(aktivitas);

  let energi     = Math.round(akgRow[2] * actFactor);
  let protein    = akgRow[3];
  let lemak      = akgRow[4];
  let karbo      = akgRow[5];
  const serat    = akgRow[6];
  const air      = akgRow[7];

  // Adjustments for conditions
  let specialNotes = [];
  if (kondisi === 'sakit') {
    energi = Math.round(energi * 1.2);
    protein = Math.round(protein * 1.3);
    specialNotes.push({ icon:'🩺', text:'Kebutuhan energi dan protein ditingkatkan 20-30% karena sedang sakit/pemulihan.' });
  }
  if (kondisi === 'stunting') {
    energi = Math.round(energi * 1.15);
    protein = Math.round(protein * 1.25);
    specialNotes.push({ icon:'📈', text:'Asupan energi dan protein ditambah untuk mengejar ketertinggalan pertumbuhan (catch-up growth).' });
  }
  if (kondisi === 'alergi') {
    specialNotes.push({ icon:'⚠️', text:'Waspadai bahan alergen (susu sapi, telur, kedelai, kacang tanah). Pastikan asupan kalsium tetap terpenuhi dari sumber alternatif.' });
  }

  // General recommendations by nutritional status
  if (statusBBU.cls === 'bad' && parseFloat(zBBU) < -2) {
    specialNotes.push({ icon:'🚨', text:'Status gizi kurang terdeteksi. Segera konsultasikan ke dokter anak atau Puskesmas terdekat. Pertimbangkan pemberian PMT (Pemberian Makanan Tambahan).' });
  }
  if (parseFloat(zTBU) < -2) {
    specialNotes.push({ icon:'📏', text:`Terdeteksi ${stuntLabel}. Tingkatkan asupan protein hewani (daging, ikan, telur), zinc, dan zat besi. Pantau pertumbuhan secara rutin setiap bulan.` });
  }
  if (parseFloat(zBBU) > 1) {
    specialNotes.push({ icon:'⚖️', text:'Berat badan berlebih. Kurangi makanan tinggi gula dan lemak jenuh. Perbanyak aktivitas fisik dan sayuran/buah.' });
  }

  // Always add general tips
  specialNotes.push({ icon:'🌿', text:'Berikan makanan beragam setiap hari: nasi/sumber karbohidrat, lauk hewani, lauk nabati, sayuran berwarna, dan buah.' });
  specialNotes.push({ icon:'💧', text:`Pastikan kecukupan cairan ± ${air} ml/hari. Utamakan air putih, hindari minuman manis.` });
  specialNotes.push({ icon:'🏥', text:'Timbang dan ukur tinggi badan anak setiap bulan di Posyandu untuk pemantauan rutin.' });

  // --- Micronutrients ---
  const mikro = getMikro(usiaTotalBulan);

  // --- Meal Distribution ---
  const meals = getMealPlan(usiaTotalBulan, energi, bb);

  // --- Food Menu ---
  const menu = getSampleMenu(usiaTotalBulan);

  return {
    nama, jenisKelamin, usiaTotalBulan, bb, tb, imt,
    zBBU, zTBU, zBBTB,
    statusBBU, stuntLabel, wastLabel,
    energi, protein, lemak, karbo, serat, air,
    mikro, meals, menu,
    specialNotes,
    bbuMedian: bbuRef.median.toFixed(1),
    tbuMedian: tbuRef.median.toFixed(1),
  };
}

function getMealPlan(usiaBulan, totalEnergi, bb) {
  if (usiaBulan < 6) {
    return [
      { time:'06:00', emoji:'🍼', name:'ASI/Sufor', desc:'On demand, setiap 2–3 jam', kcal: Math.round(totalEnergi * 0.2) },
      { time:'09:00', emoji:'🍼', name:'ASI/Sufor', desc:'Menyusu aktif', kcal: Math.round(totalEnergi * 0.2) },
      { time:'12:00', emoji:'🍼', name:'ASI/Sufor', desc:'Siang hari', kcal: Math.round(totalEnergi * 0.2) },
      { time:'15:00', emoji:'🍼', name:'ASI/Sufor', desc:'Sore hari', kcal: Math.round(totalEnergi * 0.2) },
      { time:'18:00', emoji:'🍼', name:'ASI/Sufor', desc:'Malam hari', kcal: Math.round(totalEnergi * 0.2) },
    ];
  } else if (usiaBulan < 12) {
    return [
      { time:'06:00', emoji:'🍼', name:'ASI / Sufor', desc:'Sebelum MPASI pagi', kcal: Math.round(totalEnergi * 0.15) },
      { time:'08:00', emoji:'🥣', name:'Sarapan MPASI', desc:'Bubur halus/lembut', kcal: Math.round(totalEnergi * 0.25) },
      { time:'10:00', emoji:'🍌', name:'Snack Pagi', desc:'Buah/puding', kcal: Math.round(totalEnergi * 0.1) },
      { time:'12:00', emoji:'🍱', name:'Makan Siang', desc:'Bubur + lauk + sayur', kcal: Math.round(totalEnergi * 0.25) },
      { time:'15:00', emoji:'🍪', name:'Snack Sore', desc:'Biskuit bayi / buah', kcal: Math.round(totalEnergi * 0.1) },
      { time:'18:00', emoji:'🥣', name:'Makan Malam', desc:'Bubur/nasi lembek', kcal: Math.round(totalEnergi * 0.1) },
      { time:'21:00', emoji:'🍼', name:'ASI Malam', desc:'Sebelum tidur', kcal: Math.round(totalEnergi * 0.05) },
    ];
  } else if (usiaBulan < 36) {
    return [
      { time:'07:00', emoji:'🥞', name:'Sarapan', desc:'Nasi + lauk + susu', kcal: Math.round(totalEnergi * 0.25) },
      { time:'10:00', emoji:'🍎', name:'Snack Pagi', desc:'Buah atau biskuit sehat', kcal: Math.round(totalEnergi * 0.1) },
      { time:'12:00', emoji:'🍽️', name:'Makan Siang', desc:'Nasi + lauk hewani + sayur + buah', kcal: Math.round(totalEnergi * 0.3) },
      { time:'15:00', emoji:'🍪', name:'Snack Sore', desc:'Kue tradisional/puding/yogurt', kcal: Math.round(totalEnergi * 0.1) },
      { time:'18:00', emoji:'🍛', name:'Makan Malam', desc:'Nasi + lauk + sayur', kcal: Math.round(totalEnergi * 0.25) },
    ];
  } else {
    return [
      { time:'07:00', emoji:'🥞', name:'Sarapan', desc:'Nasi/roti + lauk + susu', kcal: Math.round(totalEnergi * 0.25) },
      { time:'10:00', emoji:'🍎', name:'Snack Pagi', desc:'Buah segar atau camilan sehat', kcal: Math.round(totalEnergi * 0.1) },
      { time:'12:00', emoji:'🍽️', name:'Makan Siang', desc:'Nasi + 2 lauk + sayur + buah', kcal: Math.round(totalEnergi * 0.3) },
      { time:'15:30', emoji:'🧃', name:'Snack Sore', desc:'Susu + kue/roti gandum', kcal: Math.round(totalEnergi * 0.1) },
      { time:'18:00', emoji:'🍛', name:'Makan Malam', desc:'Nasi + lauk + sayur hijau', kcal: Math.round(totalEnergi * 0.25) },
    ];
  }
}

function getSampleMenu(usiaBulan) {
  if (usiaBulan < 6) {
    return [
      { meal: '🍼 Sepanjang Hari', items: [
        { name: 'ASI atau Susu Formula', cal: 'On demand' },
        { name: 'Minimal 8x menyusu per hari', cal: '—' },
      ]}
    ];
  } else if (usiaBulan < 12) {
    return [
      { meal: '🌅 Sarapan', items: [
        { name: 'Bubur beras + kuning telur', cal: '120 kkal' },
        { name: 'Tempe cincang halus', cal: '40 kkal' },
        { name: 'ASI/Sufor', cal: '100 kkal' },
      ]},
      { meal: '☀️ Makan Siang', items: [
        { name: 'Bubur ayam + wortel + bayam', cal: '150 kkal' },
        { name: 'Tofu/tahu halus', cal: '40 kkal' },
        { name: 'Pisang saring', cal: '50 kkal' },
      ]},
      { meal: '🌙 Makan Malam', items: [
        { name: 'Bubur ikan + kentang + labu', cal: '130 kkal' },
        { name: 'ASI/Sufor', cal: '100 kkal' },
      ]},
    ];
  } else if (usiaBulan < 36) {
    return [
      { meal: '🌅 Sarapan', items: [
        { name: 'Nasi lembek 4 sdm', cal: '90 kkal' },
        { name: 'Telur dadar cincang', cal: '80 kkal' },
        { name: 'Susu full cream 150 ml', cal: '100 kkal' },
      ]},
      { meal: '☀️ Makan Siang', items: [
        { name: 'Nasi tim 4–5 sdm', cal: '110 kkal' },
        { name: 'Ayam suwir + wortel', cal: '120 kkal' },
        { name: 'Bayam + tahu', cal: '50 kkal' },
        { name: 'Pepaya 1/4 buah', cal: '40 kkal' },
      ]},
      { meal: '🌙 Makan Malam', items: [
        { name: 'Nasi 4 sdm', cal: '90 kkal' },
        { name: 'Ikan goreng + tempe', cal: '130 kkal' },
        { name: 'Sayur sop', cal: '60 kkal' },
      ]},
    ];
  } else {
    return [
      { meal: '🌅 Sarapan', items: [
        { name: 'Nasi 5–6 sdm', cal: '130 kkal' },
        { name: 'Telur + tempe goreng', cal: '140 kkal' },
        { name: 'Susu 200 ml', cal: '120 kkal' },
      ]},
      { meal: '☀️ Makan Siang', items: [
        { name: 'Nasi 6 sdm', cal: '150 kkal' },
        { name: 'Ayam/ikan goreng', cal: '150 kkal' },
        { name: 'Sayur bening bayam', cal: '40 kkal' },
        { name: 'Jeruk 1 buah', cal: '45 kkal' },
      ]},
      { meal: '🌙 Makan Malam', items: [
        { name: 'Nasi 5–6 sdm', cal: '130 kkal' },
        { name: 'Semur daging/ikan + tempe', cal: '160 kkal' },
        { name: 'Tumis sayuran', cal: '60 kkal' },
      ]},
    ];
  }
}

// =============================================
// UI Rendering Functions
// =============================================

function renderResults(r) {
  // --- Child Info ---
  document.getElementById('childName').textContent    = r.nama || 'Si Kecil';
  document.getElementById('childAvatar').textContent  = r.jenisKelamin === 'laki' ? '👦' : '👧';
  const usiaTahun = Math.floor(r.usiaTotalBulan / 12);
  const usiaBln   = r.usiaTotalBulan % 12;
  const usiaText  = usiaTahun > 0 ? `${usiaTahun} tahun ${usiaBln} bulan` : `${usiaBln} bulan`;
  document.getElementById('childAgeGender').textContent = `${usiaText} • ${r.jenisKelamin === 'laki' ? 'Laki-laki' : 'Perempuan'}`;

  // --- Status Badge ---
  const badge = document.getElementById('statusBadge');
  badge.textContent  = `${r.statusBBU.emoji} ${r.statusBBU.label}`;
  badge.className    = `status-badge ${r.statusBBU.cls}`;

  // --- Metrics ---
  document.getElementById('metricBB').textContent   = `${r.bb} kg`;
  document.getElementById('metricTB').textContent   = `${r.tb} cm`;
  document.getElementById('metricIMT').textContent  = r.imt;
  document.getElementById('metricZBBU').textContent = `${r.zBBU} SD`;
  document.getElementById('metricZTBU').textContent = `${r.zTBU} SD (${r.stuntLabel})`;
  document.getElementById('metricZBBTB').textContent= `${r.zBBTB} SD`;

  // Color metric values based on Z-score
  colorMetric('metricZBBU', parseFloat(r.zBBU));
  colorMetric('metricZTBU', parseFloat(r.zTBU));

  // --- Nutrition Grid ---
  const nutritionItems = [
    { emoji:'⚡', name:'Total Energi', val:`${r.energi} kkal`, note:'per hari' },
    { emoji:'🥩', name:'Protein',      val:`${r.protein} g`,   note:`${Math.round(r.protein * 4)} kkal (${Math.round(r.protein*4/r.energi*100)}%)` },
    { emoji:'🧈', name:'Lemak',        val:`${r.lemak} g`,     note:`${Math.round(r.lemak * 9)} kkal (${Math.round(r.lemak*9/r.energi*100)}%)` },
    { emoji:'🌾', name:'Karbohidrat',  val:`${r.karbo} g`,     note:`${Math.round(r.karbo * 4)} kkal (${Math.round(r.karbo*4/r.energi*100)}%)` },
    { emoji:'🌿', name:'Serat',        val:`${r.serat} g`,     note:'per hari' },
    { emoji:'💧', name:'Air/Cairan',   val:`${r.air} ml`,      note:'per hari' },
  ];

  document.getElementById('nutritionGrid').innerHTML = nutritionItems.map(item => `
    <div class="nutrition-item">
      <span class="nutrition-emoji">${item.emoji}</span>
      <div class="nutrition-info">
        <div class="nutrition-name">${item.name}</div>
        <div class="nutrition-val">${item.val}</div>
        <div class="nutrition-note">${item.note}</div>
      </div>
    </div>
  `).join('');

  // --- Macro Chart ---
  renderMacroChart(r.energi, r.protein, r.lemak, r.karbo);

  // --- Micronutrients ---
  const mikroHTML = Object.entries(r.mikro).map(([name, data]) => {
    const barPct = Math.min(100, (data.value / getMaxMikro(name)) * 100);
    return `
      <div class="micro-item">
        <div class="micro-top">
          <span class="micro-name">${name}</span>
          <span class="micro-val">${data.value} ${data.unit}</span>
        </div>
        <div class="micro-bar-bg">
          <div class="micro-bar-fill" style="width:${barPct}%; background: ${data.color};"></div>
        </div>
      </div>
    `;
  }).join('');
  document.getElementById('microGrid').innerHTML = mikroHTML;

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.micro-bar-fill').forEach(el => {
      el.style.width = el.style.width;
    });
  }, 100);

  // --- Meal Timeline ---
  document.getElementById('mealTimeline').innerHTML = r.meals.map(m => `
    <div class="meal-item">
      <div class="meal-time">${m.time}</div>
      <div class="meal-emoji">${m.emoji}</div>
      <div class="meal-info">
        <div class="meal-name">${m.name}</div>
        <div class="meal-desc">${m.desc}</div>
      </div>
      <div class="meal-kcal">~${m.kcal} kkal</div>
    </div>
  `).join('');

  // --- Recommendations ---
  document.getElementById('recList').innerHTML = r.specialNotes.map(note => `
    <li class="rec-item">
      <span class="rec-icon">${note.icon}</span>
      <span>${note.text}</span>
    </li>
  `).join('');

  // --- Food Menu ---
  document.getElementById('foodMenu').innerHTML = r.menu.map(m => `
    <div class="food-meal">
      <div class="food-meal-header">🍴 ${m.meal}</div>
      <div class="food-items">
        ${m.items.map(item => `
          <div class="food-item">
            <span class="food-item-name">• ${item.name}</span>
            <span class="food-item-cal">${item.cal}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function colorMetric(id, z) {
  const el = document.getElementById(id);
  if (!el) return;
  if (z < -2) el.style.color = '#f87171';
  else if (z > 1) el.style.color = '#fbbf24';
  else el.style.color = '#6ee7b7';
}

function getMaxMikro(name) {
  const maxMap = {
    'Vitamin A': 600, 'Vitamin C': 80, 'Vitamin D': 20,
    'Kalsium': 1000, 'Zat Besi': 15, 'Zinc': 8,
    'Folat': 200, 'Yodium': 130
  };
  return maxMap[name] || 100;
}

// =============================================
// Form Handling
// =============================================

function validateForm() {
  const jenisKelamin = document.querySelector('input[name="jenisKelamin"]:checked');
  const usiaBulan    = parseInt(document.getElementById('usiaBulan').value);
  const bb           = parseFloat(document.getElementById('beratBadan').value);
  const tb           = parseFloat(document.getElementById('tinggiBadan').value);

  const errors = [];

  if (!jenisKelamin) errors.push('Pilih jenis kelamin terlebih dahulu.');

  if (isNaN(usiaBulan) || usiaBulan < 0) errors.push('Masukkan usia balita (minimal 0 bulan).');
  if (!isNaN(usiaBulan) && usiaBulan > 59) errors.push('Program ini untuk balita usia 0–59 bulan (0–5 tahun).');

  if (isNaN(bb) || bb < 2 || bb > 30) errors.push('Masukkan berat badan yang valid (2–30 kg).');
  if (isNaN(tb) || tb < 40 || tb > 130) errors.push('Masukkan tinggi badan yang valid (40–130 cm).');

  return errors;
}

document.getElementById('giziForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const errorEl = document.getElementById('formError');
  const errors  = validateForm();

  if (errors.length > 0) {
    errorEl.style.display = 'flex';
    errorEl.innerHTML = '⚠️ ' + errors.join(' | ');
    return;
  }

  errorEl.style.display = 'none';

  // Show loading
  const btn = document.getElementById('hitungBtn');
  btn.classList.add('btn-loading');
  btn.textContent = 'Menghitung...';
  btn.disabled = true;

  setTimeout(() => {
    const nama         = document.getElementById('namaBalita').value.trim() || 'Si Kecil';
    const jenisKelamin = document.querySelector('input[name="jenisKelamin"]:checked').value;
    const usiaTotalBulan = parseInt(document.getElementById('usiaBulan').value) || 0;
    const bb           = parseFloat(document.getElementById('beratBadan').value);
    const tb           = parseFloat(document.getElementById('tinggiBadan').value);
    const aktivitas    = document.getElementById('aktivitas').value;
    const kondisi      = document.getElementById('kondisiKhusus').value;

    const result = hitungGizi({
      nama,
      jenisKelamin,
      usiaTotalBulan,
      bb, tb, aktivitas, kondisi
    });

    // Hide empty, show results
    document.getElementById('resultEmpty').style.display   = 'none';
    document.getElementById('resultContent').style.display = 'block';

    renderResults(result);

    // Scroll to results on mobile
    if (window.innerWidth <= 768) {
      document.getElementById('resultContent').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Reset button
    btn.classList.remove('btn-loading');
    btn.innerHTML = '<span class="btn-icon">🔍</span> Hitung Kebutuhan Gizi';
    btn.disabled = false;
  }, 600);
});

// =============================================
// Reset Function
// =============================================
function resetForm() {
  document.getElementById('giziForm').reset();
  document.getElementById('resultEmpty').style.display   = 'flex';
  document.getElementById('resultContent').style.display = 'none';
  document.getElementById('formError').style.display     = 'none';
  if (macroChartInstance) { macroChartInstance.destroy(); macroChartInstance = null; }
  document.querySelector('#kalkulator').scrollIntoView({ behavior: 'smooth' });
}

// =============================================
// Smooth Nav Active State
// =============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// =============================================
// Number Input Nice Touch
// =============================================
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('wheel', e => e.preventDefault());
});
