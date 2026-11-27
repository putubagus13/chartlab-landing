import type { SiteContent } from "./types";
import { shared } from "./shared";

const [starter, pro, mentor] = shared.packages;

export const siteId: SiteContent = {
  meta: {
    homeTitle: 'ChartLab — Platform Trading Crypto Gratis dengan Backtesting',
    homeDescription:
      'ChartLab dari Disatu: platform trading gratis untuk menganalisa market crypto. Backtest sistemmu, lihat statistiknya, dan temukan R:R terbaik.',
  },
  ui: {
    buyEbook: "Beli E-Book",
    buyPackage: "Beli Paket",
    mostPopular: "Paling Populer",
    freeBacktestBadge: "Termasuk panduan ChartLab",
    openApp: 'Buka ChartLab',
    tryFree: 'Coba ChartLab Gratis',
    freeBadge: 'Semua fitur gratis',
    seeApp: "Lihat cuplikan",
    menuOpen: "Buka menu",
    menuClose: "Tutup menu",
    skipToContent: "Lewati ke konten",
    themeLight: "Tema terang",
    themeDark: "Tema gelap",
    themeSystem: "Tema ikut sistem",
    switchLanguage: "Ganti bahasa",
    visualLabel:
      "Animasi garis tiga dimensi yang berubah bentuk secara berkala. Gerakkan kursor untuk berinteraksi",
    whatYouLearn: "Yang akan kamu pelajari",
    howToGetAccess: "Cara memulai",
    sampleData: "contoh data",
  },
  brand: { name: "ChartLab", tagline: "Belajar, uji, dan percaya pada datamu." },
  nav: [
    { label: 'Alur Trading', hash: 'workflow' },
    { label: 'ChartLab', hash: 'chartlab' },
  ],
  hero: {
    eyebrow: 'ChartLab · Platform Trading Crypto',
    title: 'Analisa market crypto dan uji sistemmu. Semua fitur gratis.',
    subtitle:
      'ChartLab adalah platform trading untuk menganalisa market crypto. Backtest sistemmu, lihat statistiknya, dan temukan R:R terbaik tanpa biaya.',
    bundleNote: 'Semua fitur gratis, termasuk backtesting.',
  },
  ebook: {
    title: "E-Book Trading Crypto",
    subtitle:
      "Panduan praktis dari dasar pasar sampai membangun dan menguji strategi sendiri.",
    chapters: [
      "Dasar pasar crypto dan cara kerja order",
      "Membaca grafik tanpa mengandalkan firasat",
      "Manajemen risiko dan ukuran posisi",
      "Merancang aturan strategi yang bisa diuji",
      "Backtest: cara membaca hasil dan menghindari jebakan",
      "Disiplin eksekusi dan jurnal trading",
    ],
    packages: [
      {
        ...starter,
        name: "Starter",
        tagline: "Mulai dari fondasi yang benar.",
        features: [
          "E-book lengkap (PDF)",
          "Panduan memakai ChartLab",
          "Update isi e-book",
        ],
        includesBacktestAccess: true,
      },
      {
        ...pro,
        name: "Pro",
        tagline: "Paling banyak dipilih untuk belajar serius.",
        features: [
          "E-book lengkap (PDF)",
          "Panduan memakai ChartLab",
          "Template strategi siap pakai",
          "Update isi e-book",
        ],
        includesBacktestAccess: true,
      },
      {
        ...mentor,
        name: "Mentor",
        tagline: "Dengan pendampingan langsung.",
        features: [
          "Semua isi paket Pro",
          "Panduan memakai ChartLab",
          "Sesi tanya jawab 1 kali",
          "Review strategi",
        ],
        includesBacktestAccess: true,
      },
    ],
  },
  chartlab: {
    title: 'ChartLab: analisa dan uji strategimu di satu tempat',
    subtitle: 'ChartLab menggabungkan analisa chart dan backtesting dalam satu platform. Semua fiturnya gratis.',
    videoSrc: shared.videoSrc,
    videoPoster: shared.videoPoster,
    videoLabel: 'Video tutorial ChartLab',
    videoNote: 'Cuplikan singkat: dari Bar Replay sampai riwayat trade.',
    features: [
      { title: 'Backtesting bawaan', description: 'Uji sistem tradingmu pada data historis dengan Bar Replay, seolah market berjalan live.', icon: shared.icons[4] },
      { title: 'Statistik hasil backtest', description: 'Lihat performa sistemmu dalam statistik yang jelas, bukan sekadar perasaan.', icon: shared.icons[0] },
      { title: 'Rekomendasi R:R terbaik', description: 'ChartLab menganalisa sistem buatanmu dan merekomendasikan rasio risk:reward terbaik.', icon: shared.icons[5] },
      { title: 'Analisa chart lengkap', description: 'Indikator, berbagai timeframe, dan watchlist multi-pair untuk membaca market.', icon: shared.icons[2] },
      { title: 'Order dengan SL, TP, dan trailing stop', description: 'Atur entry, stop loss, take profit, dan trailing stop langsung di chart.', icon: shared.icons[3] },
      { title: 'Jurnal trade otomatis', description: 'Riwayat trade dengan screenshot chart, tag, dan catatan alasan tiap trade.', icon: shared.icons[1] },
    ],
    steps: [
      { title: 'Buka ChartLab', description: 'Masuk dari browser. Gratis, tanpa biaya.' },
      { title: 'Bangun dan uji sistemmu', description: 'Pasang indikator, jalankan Bar Replay, lalu buka posisi dengan SL dan TP.' },
      { title: 'Baca statistik dan R:R', description: 'Tinjau statistik hasil backtest dan rekomendasi R:R terbaik untuk sistemmu.' },
    ],
  },
  workflow: {
    tag: "Alur trading yang tepat",
    title: "Lima tahap sebelum mempertaruhkan uang sungguhan",
    subtitle:
      "Kebanyakan pemula langsung masuk ke market. Ikuti urutan ini: belajar, susun sistem, buktikan, verifikasi di market asli, lalu amankan profit.",
    stepWord: "Langkah",
    hubLabel: "Edge-mu",
    next: "Langkah berikutnya",
    cta: 'Coba ChartLab gratis',
    note: "Data contoh untuk ilustrasi. Bukan saran keuangan.",
    steps: [
      {
        id: "learn",
        label: "Pelajari market",
        title: "Bangun fondasi dari tiga sudut pandang",
        description:
          "Sebelum trading, pelajari cara membaca market dari lebih dari satu sisi. Satu metode saja tidak cukup.",
        points: [
          {
            label: "Analisis teknikal",
            text: "Baca harga, tren, support dan resistance, serta volume untuk menentukan waktu masuk dan keluar.",
          },
          {
            label: "Analisis fundamental",
            text: "Nilai kualitas proyek: tim, tokenomics, adopsi, dan kondisi makro.",
          },
          {
            label: "Data on-chain",
            text: "Pantau dompet, arus bursa, dan aktivitas jaringan untuk melihat apa yang benar-benar dilakukan pemegang besar.",
          },
        ],
      },
      {
        id: "system",
        label: "Tentukan sistem",
        title: "Ubah ilmu menjadi aturan tertulis",
        description:
          "Gabungkan semua yang kamu pelajari menjadi satu sistem trading tanpa ruang untuk menebak atau ikut mood.",
        points: [
          {
            label: "Aturan entry",
            text: "Kondisi pasti yang harus terpenuhi sebelum kamu membeli atau menjual.",
          },
          {
            label: "Exit dan stop loss",
            text: "Level harga yang membuktikan ide trade salah dan kamu keluar.",
          },
          {
            label: "Manajemen modal",
            text: "Putuskan sebelum trade pertama: berapa modal yang dipertaruhkan per trade (misalnya 1%), seberapa besar tiap posisi, dan kapan berhenti di hari itu.",
          },
        ],
      },
      {
        id: "backtest",
        label: "Backtest",
        title: "Buktikan sistem pada data historis",
        description:
          'Jalankan aturanmu di ChartLab dengan Bar Replay, trade demi trade. Lihat statistiknya dan temukan R:R terbaik. Hanya sistem yang lolos hitungan yang lanjut.',
        points: [
          {
            label: 'Statistik hasil', text: 'Periksa statistik backtest, misalnya tingkat kemenangan dan penurunan terburuk, dan apakah manajemen modalmu membuatnya tertahankan.',
          },
          {
            label: 'R:R terbaik', text: 'ChartLab merekomendasikan rasio risk:reward terbaik dari sistem yang kamu buat. Jadikan acuan, bukan janji.',
          },
          {
            label: "Belum profit?",
            text: "Kembali ke langkah 2, perbaiki aturan, lalu uji lagi sebelum memakai uang asli.",
          },
        ],
      },
      {
        id: "live",
        label: "Market asli",
        title: "Masuk market asli dan verifikasi sistemmu",
        description:
          "Hasil masa lalu bukan jaminan. Trading di market asli dengan aturan yang sudah kamu tulis, lalu bandingkan hasilnya dengan backtest.",
        points: [
          {
            label: "Verifikasi di kondisi nyata",
            text: "Pastikan eksekusi, biaya, dan slippage sesuai asumsi backtest.",
          },
          {
            label: "Patuhi aturan",
            text: "Jangan mengubah rencana di tengah trade karena takut atau euforia.",
          },
          {
            label: "Catat di jurnal",
            text: "Catat setiap trade supaya hasil asli bisa dibandingkan dengan hasil backtest.",
          },
        ],
      },
      {
        id: "profit",
        label: "Take profit",
        title: "Amankan keuntungan yang sudah kamu raih",
        description:
          "Profit yang tidak pernah diambil hanya angka di layar. Rencanakan exit sebelum kamu entry.",
        points: [
          {
            label: "Ambil bertahap",
            text: "Ambil sebagian posisi di TP1, TP2, dan TP3, bukan semua atau tidak sama sekali.",
          },
          {
            label: "Geser stop mengikuti harga",
            text: "Naikkan stop di belakang harga agar posisi yang untung terlindungi.",
          },
          {
            label: "Evaluasi dan ulangi",
            text: "Tinjau jurnal, perbaiki aturan yang hasilnya menyimpang, lalu jalankan siklus dari awal.",
          },
        ],
      },
    ],
  },
  offer: {
    title: 'Analisa lebih tajam. Sistem teruji. Gratis.',
    subtitle: 'ChartLab menggabungkan analisa market dan backtesting dalam satu platform gratis.',
  },
  chartlabPage: {
    title: "ChartLab — Platform Trading Crypto Gratis",
    description: "Analisa market crypto, backtest sistemmu, dan temukan R:R terbaik di ChartLab. Semua fitur gratis.",
    loading: "Memuat ChartLab…",
    fallback: "ChartLab belum bisa dimuat di halaman ini. Buka di tab baru untuk memakainya langsung.",
    openNewTab: "Buka di tab baru",
    fullscreen: "Layar penuh",
    exitFullscreen: "Keluar layar penuh",
    credit: "Chart oleh Vela (LuxAlgo)",
  },
  footer: { note: "© Disatu. Konten edukasi, bukan saran keuangan." },
};
