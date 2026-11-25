import type { SiteContent } from './types'
import { shared } from './shared'

const [starter, pro, mentor] = shared.packages

export const siteId: SiteContent = {
  meta: {
    homeTitle: 'Disatu — E-Book Trading Crypto & Web App Backtest',
    homeDescription:
      'Pelajari trading crypto lewat e-book Disatu dan dapatkan akses gratis ke web app backtest untuk menguji strategimu.',
    aboutTitle: 'Tentang Saya — Disatu',
    aboutDescription: 'Profil dan pengalaman di balik e-book dan web app backtest Disatu.',
  },
  ui: {
    buyEbook: 'Beli E-Book',
    buyPackage: 'Beli Paket',
    mostPopular: 'Paling Populer',
    freeBacktestBadge: 'Gratis akses Web App Backtest',
    openApp: 'Buka Web App',
    freeForBuyers: 'Gratis untuk pembeli e-book',
    seeApp: 'Lihat Web App',
    menuOpen: 'Buka menu',
    menuClose: 'Tutup menu',
    skipToContent: 'Lewati ke konten',
    themeLight: 'Tema terang',
    themeDark: 'Tema gelap',
    themeSystem: 'Tema ikut sistem',
    switchLanguage: 'Ganti bahasa',
    orbLabel: 'Bola titik-titik bergaya stipple',
    orbHint: 'Geser untuk memutar',
    whatYouLearn: 'Yang akan kamu pelajari',
    howToGetAccess: 'Cara mendapatkan akses',
    sampleData: 'contoh data',
    experienceTitle: 'Pengalaman',
    skillsTitle: 'Keahlian',
    aboutCta: 'Pelajari strategi saya di e-book',
  },
  brand: { name: 'Disatu', tagline: 'Belajar, uji, dan percaya pada datamu.' },
  nav: [
    { label: 'E-Book', page: 'home', hash: 'ebook' },
    { label: 'Web App Backtest', page: 'home', hash: 'backtest' },
    { label: 'Tentang Saya', page: 'about' },
  ],
  hero: {
    eyebrow: 'E-book + Web App Backtest',
    title: 'Uji strategi crypto-mu sebelum mempertaruhkan uang.',
    subtitle:
      'Belajar trading crypto secara terstruktur lewat e-book Disatu, lalu buktikan setiap ide dengan data historis di web app backtest kami.',
    bundleNote: 'Setiap paket e-book = akses gratis Web App Backtest.',
  },
  ebook: {
    title: 'E-Book Trading Crypto',
    subtitle: 'Panduan praktis dari dasar pasar sampai membangun dan menguji strategi sendiri.',
    chapters: [
      'Dasar pasar crypto dan cara kerja order',
      'Membaca grafik tanpa mengandalkan firasat',
      'Manajemen risiko dan ukuran posisi',
      'Merancang aturan strategi yang bisa diuji',
      'Backtest: cara membaca hasil dan menghindari jebakan',
      'Disiplin eksekusi dan jurnal trading',
    ],
    packages: [
      {
        ...starter,
        name: 'Starter',
        tagline: 'Mulai dari fondasi yang benar.',
        features: ['E-book lengkap (PDF)', 'Akses Web App Backtest', 'Update isi e-book'],
        includesBacktestAccess: true,
      },
      {
        ...pro,
        name: 'Pro',
        tagline: 'Paling banyak dipilih untuk belajar serius.',
        features: ['E-book lengkap (PDF)', 'Akses Web App Backtest', 'Template strategi siap pakai', 'Update isi e-book'],
        includesBacktestAccess: true,
      },
      {
        ...mentor,
        name: 'Mentor',
        tagline: 'Dengan pendampingan langsung.',
        features: ['Semua isi paket Pro', 'Akses Web App Backtest', 'Sesi tanya jawab 1 kali', 'Review strategi'],
        includesBacktestAccess: true,
      },
    ],
  },
  backtest: {
    title: 'Web App Backtest Crypto',
    subtitle: 'Uji ide trading-mu pada data historis dan lihat hasilnya dengan jelas, tanpa menulis kode.',
    appUrl: shared.appUrl,
    features: [
      { title: 'Data historis pasar', description: 'Uji strategi pada berbagai pasangan crypto dan rentang waktu.', icon: shared.icons[0] },
      { title: 'Hasil cepat', description: 'Dapatkan hasil backtest dalam hitungan detik.', icon: shared.icons[1] },
      { title: 'Banyak indikator', description: 'Gabungkan indikator untuk membangun aturan masuk dan keluar.', icon: shared.icons[2] },
      { title: 'Metrik risiko', description: 'Lihat win rate, max drawdown, dan profit factor.', icon: shared.icons[3] },
      { title: 'Bandingkan versi', description: 'Ubah parameter dan bandingkan hasilnya berdampingan.', icon: shared.icons[4] },
      { title: 'Fokus pada bukti', description: 'Putuskan berdasarkan data, bukan perasaan.', icon: shared.icons[5] },
    ],
    steps: [
      { title: 'Beli e-book', description: 'Pilih paket yang sesuai lalu selesaikan pembayaran.' },
      { title: 'Terima akses lewat email', description: 'Kami kirim e-book dan akses web app ke email-mu.' },
      { title: 'Mulai backtest', description: 'Masuk ke web app dan uji strategi pertamamu.' },
    ],
  },
  offer: {
    title: 'Satu paket e-book, akses penuh Web App Backtest.',
    subtitle: 'Belajar teorinya, lalu buktikan sendiri dengan data.',
  },
  about: {
    name: '[ISI] Nama Lengkap',
    headline: '[ISI] Trader & pengembang di balik Disatu',
    bio: '[ISI] Tulis ringkasan singkat tentang dirimu, latar belakang, dan alasan membangun Disatu.',
    location: '[ISI] Kota, Indonesia',
    socials: shared.socials,
    skills: ['Trading crypto', 'Backtesting', 'Manajemen risiko', 'React', 'TypeScript'],
    experiences: [
      {
        role: '[ISI] Jabatan',
        company: '[ISI] Perusahaan',
        period: '[ISI] 2022 — Sekarang',
        description: '[ISI] Deskripsi singkat peran.',
        highlights: ['[ISI] Pencapaian utama pertama', '[ISI] Pencapaian utama kedua'],
      },
      {
        role: '[ISI] Jabatan sebelumnya',
        company: '[ISI] Perusahaan',
        period: '[ISI] 2019 — 2022',
        description: '[ISI] Deskripsi singkat peran.',
        highlights: ['[ISI] Pencapaian utama'],
      },
    ],
  },
  footer: { note: '© Disatu. Konten edukasi, bukan saran keuangan.' },
}
