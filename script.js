const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const tokenContainer = document.getElementById("tokenContainer");

const boardImg = new Image();
boardImg.src = "Ular tangga.png"; // ganti dengan nama file papan
boardImg.onload = () => renderPlayers();

let players = [0,0,0,0,0,0]; 
const colors = ["red","blue","green","orange","purple","black"];

const ladders = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  51: 67,
  71: 90,
  80: 100
};

const snakes = {
  17: 7,
  54: 34,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 79
};

let currentPlayer = 0;
let currentDice = 0;
let currentQuestion = null;

// 🔹 Bank soal objektif
const questions = [
  { q: "Apa kepanjangan dari GPS?", options: ["Global Positioning System","Global Phone System","Geographical Positioning Satellite","General Positioning System"], answer: 0 },
  { q: "Siapa ilmuwan yang teorinya penting untuk GPS?", options: ["Isaac Newton","Albert Einstein","Galileo Galilei","Nikola Tesla"], answer: 1 },
  { q: "Tahun berapa GPS mencapai kemampuan operasional penuh?", options: ["1978","1983","1995","2000"], answer: 2 },
  { q: "Berapa jumlah satelit GPS sekarang?", options: ["24","28","32","36"], answer: 2 },
  { q: "Fungsi awal GPS pada awalnya adalah untuk?", options: ["Militer Amerika","Sektor pertanian","Sektor transportasi umum","Telekomunikasi"], answer: 0 },
  { q: "Insiden yang mendorong GPS untuk digunakan sipil terjadi pada tahun?", options: ["1978","1983","1995","2000"], answer: 1 },
  { q: "Pesawat yang ditembak jatuh di Uni Soviet adalah?", options: ["Korean Airlines 007","American Airlines 11","Pan Am 103","Malaysia Airlines 370"], answer: 0 },
  { q: "Satelit GPS berada di ketinggian kira-kira?", options: ["2.000 km","10.000 km","20.000 km","36.000 km"], answer: 2 },
  { q: "Nama sistem navigasi satelit umum adalah?", options: ["GPS","GNSS","BDS","GLONASS"], answer: 1 },
  { q: "Efek relativitas khusus memengaruhi waktu karena?", options: ["Gravitasi kuat","Gerakan cepat","Medan magnet","Suhu tinggi"], answer: 1 },
  { q: "Efek relativitas umum memengaruhi waktu karena?", options: ["Gerakan cepat","Medan gravitasi lemah","Gaya gesek udara","Suhu tinggi"], answer: 1 },
  { q: "Kecepatan satelit GPS saat mengorbit bumi kira-kira?", options: ["14 km/h","140 km/h","1.400 km/h","14.000 km/h"], answer: 3 },
  { q: "Jam yang digunakan di satelit GPS adalah?", options: ["Jam digital biasa","Jam atom","Jam mekanik","Jam matahari"], answer: 1 },
  { q: "Prinsip perhitungan posisi GPS disebut?", options: ["Triangulasi","Trilaterasi","Navigasi inertial","Georeferensi"], answer: 1 },
  { q: "Data utama yang dikirim satelit GPS adalah?", options: ["Waktu dan lokasi","Cuaca dan tekanan","Kecepatan dan arah","Nomor registrasi satelit"], answer: 0 },
  { q: "Google Maps merupakan?", options: ["GPS","Aplikasi pemetaan yang menggunakan GPS dan metode lain","Satelit","Jam atom"], answer: 1 },
  { q: "Sinyal GPS bergerak dengan kecepatan?", options: ["Kecepatan suara","Kecepatan cahaya","Kecepatan kendaraan","Kecepatan satelit"], answer: 1 },
  { q: "Jarak dihitung di GPS menggunakan?", options: ["Kecepatan x waktu","Massa x kecepatan","Waktu x gravitasi","Tekanan x volume"], answer: 0 },
  { q: "Tiga satelit dibutuhkan untuk?", options: ["Menentukan posisi di bumi","Menentukan waktu","Menentukan kecepatan satelit","Menentukan cuaca"], answer: 0 },
  { q: "Satelit keempat dibutuhkan untuk?", options: ["Mengoreksi waktu di receiver","Menambah sinyal radio","Mengukur kecepatan angin","Mengukur tekanan atmosfer"], answer: 0 },
  { q: "Jika efek relativitas diabaikan, GPS bisa meleset sejauh?", options: ["100 m","1 km","11 km","50 km"], answer: 2 },
  { q: "Delta T pada GPS dihitung dari?", options: ["T2-T1","T1+T2","T1-T2","T2/T1"], answer: 0 },
  { q: "Sinyal GPS dikirimkan terus-menerus oleh?", options: ["Pusat kendali bumi","Satelit GPS","Pesawat","Menara BTS"], answer: 1 },
  { q: "Jam atom satelit presisi untuk mengukur?", options: ["Gravitasi","Waktu","Arah","Kecepatan"], answer: 1 },
  { q: "Sistem navigasi Rusia disebut?", options: ["BDS","GLONASS","Galileo","IRNSS"], answer: 1 },
  { q: "Sistem navigasi Eropa disebut?", options: ["BDS","GLONASS","Galileo","IRNSS"], answer: 2 },
  { q: "Sistem navigasi Cina disebut?", options: ["BDS","GLONASS","Galileo","IRNSS"], answer: 0 },
  { q: "Sistem navigasi Jepang disebut?", options: ["BDS","GLONASS","Galileo","QZSS"], answer: 3 },
  { q: "Proyek awal GPS dikenal sebagai?", options: ["NAVStar GPS","Galileo","GLONASS","BDS"], answer: 0 },
  { q: "Satelit pertama GPS diluncurkan pada?", options: ["1970","1978","1983","1995"], answer: 1 },
  { q: "Jumlah satelit awal GPS untuk operasional penuh?", options: ["18","24","30","32"], answer: 1 },
  { q: "Google Maps bisa menentukan lokasi dengan metode?", options: ["Hanya GPS","GPS dan sinyal tower","Hanya triangulasi","Hanya sensor kamera"], answer: 1 },
  { q: "Jika sinyal HP lemah, lokasi Google Maps biasanya pakai?", options: ["GPS","Wi-Fi","Bluetooth","Sensor tekanan"], answer: 0 },
  { q: "Waktu satelit berbeda dari waktu bumi karena?", options: ["Relativitas khusus dan umum","Hanya relativitas umum","Hanya relativitas khusus","Efek cuaca"], answer: 0 },
  { q: "Jika efek relativitas tidak diperhitungkan, GPS bisa salah lokasi?", options: ["1 m","100 m","1 km","11 km"], answer: 3 },
  { q: "Keakuratan GPS saat ini bisa mencapai?", options: ["1 km","100 m","10 m","1 m"], answer: 2 },
  { q: "Untuk menghitung posisi, GPS menggunakan perhitungan jarak dari?", options: ["Satu satelit","Tiga atau empat satelit","Menara BTS","Sensor HP"], answer: 1 },
  { q: "Sinyal GPS termasuk jenis?", options: ["Gelombang suara","Gelombang elektromagnetik","Gelombang air","Gelombang mekanik"], answer: 1 },
  { q: "Penyimpangan waktu kecil di GPS bisa menyebabkan?", options: ["Sinyal lebih cepat","Kesalahan lokasi besar","Baterai habis","Sinyal mati"], answer: 1 },
  { q: "Fungsi padding pada border box di HTML?", options: ["Menambah jarak teks dengan border","Mengubah warna teks","Mengatur posisi border","Menambah ukuran font"], answer: 0 },
  { q: "Efek relativitas khusus membuat waktu satelit menjadi?", options: ["Lebih cepat","Lebih lambat","Tetap sama","Bervariasi secara acak"], answer: 1 },
  { q: "Efek relativitas umum membuat waktu satelit menjadi?", options: ["Lebih cepat","Lebih lambat","Tetap sama","Bervariasi secara acak"], answer: 0 },
  { q: "Delta T total GPS akibat relativitas sekitar?", options: ["38 mikrodetik","7 mikrodetik","45 mikrodetik","100 mikrodetik"], answer: 0 },
  { q: "Jarak kesalahan GPS jika efek relativitas tidak diperhitungkan per hari?", options: ["1 km","5 km","11,4 km","50 km"], answer: 2 },
  { q: "Nama prinsip penghitungan posisi GPS?", options: ["Trilaterasi","Triangulasi","Integrasi","Differensial"], answer: 0 },
  { q: "Sinyal dari satelit ke receiver diterima pada waktu?", options: ["T1","T2","T3","T4"], answer: 1 },
  { q: "Sistem navigasi satelit yang digunakan umum disebut?", options: ["GNSS","GPS saja","GLONASS","BDS"], answer: 0 },
  { q: "Google Maps menggunakan GPS untuk?", options: ["Menentukan lokasi","Mengirim pesan","Mengukur kecepatan internet","Mendeteksi cuaca"], answer: 0 },
  { q: "Jumlah minimum satelit untuk memperkirakan posisi di bumi?", options: ["1","2","3","4"], answer: 2 },
  { q: "Satelit GPS beroperasi sejak?", options: ["1970-an","1980-an","1990-an","2000-an"], answer: 0 },
  { q: "Sinyal GPS dipancarkan secara?", options: ["Terputus-putus","Kontinu","Sekali saja","Hanya saat diminta"], answer: 1 },
  { q: "Perhitungan jarak satelit menggunakan kecepatan sinyal dan?", options: ["Massa satelit","Waktu tempuh sinyal","Gravitasi bumi","Tekanan atmosfer"], answer: 1 },
  { q: "Satelit GPS memiliki orbit?", options: ["Dekat bumi","Medium","Tinggi sekitar 20.000 km","Di luar tata surya"], answer: 2 },
  { q: "Jumlah satelit GPS awal untuk cakupan global?", options: ["18","24","32","36"], answer: 1 },
  { q: "Kesalahan lokasi 11,4 km terjadi karena?", options: ["Tidak ada sinyal","Efek relativitas diabaikan","Baterai habis","Cuaca buruk"], answer: 1 },
  { q: "Sistem navigasi lain selain GPS disebut?", options: ["GNSS","GMS","GPRS","IMSI"], answer: 0 },
  { q: "Sistem navigasi GNSS mencakup?", options: ["GPS, GLONASS, Galileo, BDS, QZSS","Hanya GPS","Hanya Galileo","Hanya BDS"], answer: 0 },
  { q: "Google Maps menentukan lokasi tanpa GPS bisa menggunakan?", options: ["Tower BTS","Jam atom","Satelit GPS","Sensor tekanan"], answer: 0 },
  { q: "Efek Einstein penting untuk GPS karena?", options: ["Mempengaruhi akurasi waktu","Mempengaruhi warna peta","Mempengaruhi ukuran peta","Mempengaruhi baterai HP"], answer: 0 },
  { q: "Akurasinya GPS saat ini bisa mencapai?", options: ["10 m","50 m","100 m","1 km"], answer: 0 },
  { q: "Andi sedang hiking di gunung dan ingin tahu ketinggiannya, ia menggunakan alat GPS handheld, data apa yang sebenarnya diberikan GPS tentang tinggi?", options: ["Tinggi elipsoid","Tinggi orthometrik","Tinggi geoid","Tinggi permukaan laut"], answer: 0 },
{ q: "Seorang nelayan menggunakan GPS di laut untuk kembali ke titik berangkat, sistem koordinat apa yang dipakai GPS?", options: ["WGS84","UTM","Geoid","Local Datum"], answer: 0 },
{ q: "Dina menggunakan GPS untuk mencari lokasi rumahnya di peta digital, GPS bekerja dengan prinsip apa?", options: ["Triangulasi satelit","Magnet bumi","Arah matahari","Peta manual"], answer: 0 },
{ q: "Sebuah drone dilengkapi GPS agar bisa terbang otomatis ke titik tujuan, data apa yang paling penting bagi sistem navigasi ini?", options: ["Lintang dan bujur","Suhu udara","Kelembapan","Kecepatan angin"], answer: 0 },
{ q: "Budi ingin mengukur jarak antar dua titik dengan GPS, perhitungan jarak dihitung berdasarkan apa?", options: ["Koordinat lintang dan bujur","Tekanan udara","Arah kompas","Jam lokal"], answer: 0 },
{ q: "Dalam survei tanah, GPS digunakan untuk menentukan titik batas lahan, apa keuntungan menggunakan GPS dibanding meteran manual?", options: ["Lebih akurat dan cepat","Lebih murah","Tidak perlu sinyal","Tidak butuh baterai"], answer: 0 },
{ q: "Seorang sopir truk menggunakan GPS untuk memilih jalur tercepat, GPS bekerja dengan bantuan apa?", options: ["Satelit","Kompas","Magnet","Radar"], answer: 0 },
{ q: "Ketika Sinta membuka aplikasi Maps di smartphone, sinyal GPS sering terhambat di dalam gedung, apa penyebabnya?", options: ["Sinyal satelit terhalang bangunan","Kesalahan pengguna","Baterai habis","Kompas rusak"], answer: 0 },
{ q: "Arif menggunakan GPS untuk memetakan sawahnya, sistem koordinat global yang digunakan GPS adalah?", options: ["WGS84","NAD83","UTM Zone","Topografi lokal"], answer: 0 },
{ q: "Dalam penerbangan internasional, pilot menggunakan GPS untuk menentukan posisi pesawat, mengapa GPS dipilih?", options: ["Memberi posisi real-time","Tidak butuh peta","Menggunakan kompas","Lebih murah"], answer: 0 },
{ q: "Andi ingin memotret area sawah kecil dengan detail tinggi, drone jenis apa yang cocok?", options: ["Fixed Wing","Hybrid","Multirotor","Tethered"], answer: 2 },
{ q: "Sebuah perusahaan perkebunan ingin memetakan ribuan hektar lahan dengan sekali terbang, drone apa yang sebaiknya dipakai?", options: ["Multirotor","Fixed Wing","Nano UAV","Tethered"], answer: 1 },
{ q: "Dalam operasi SAR di hutan lebat, drone yang bisa melayang di satu titik akan lebih efektif. Apa jenis drone ini?", options: ["Mini UAV","Fixed Wing","Multirotor","Hybrid"], answer: 2 },
{ q: "Kelemahan utama drone multirotor dibanding fixed wing adalah?", options: ["Mahal","Durasi terbang lebih singkat","Tidak stabil","Sulit hover"], answer: 1 },
{ q: "Kelebihan utama fixed wing UAV dibanding multirotor adalah?", options: ["Mudah parkir","Bisa terbang lebih lama","Tidak butuh landasan","Mudah hover"], answer: 1 },
{ q: "Drone hybrid dikembangkan untuk mengatasi kelemahan apa?", options: ["Harga mahal","Durasi fixed wing & hover multirotor","Kapasitas baterai kecil","Keterbatasan sinyal"], answer: 1 },
{ q: "Seorang petani menggunakan drone untuk menyemprot pestisida. Apa kelebihan drone ini dibanding cara manual?", options: ["Tidak butuh operator","Tidak pakai baterai","Efisiensi waktu dan tenaga","Biaya lebih murah"], answer: 2 },
{ q: "Menggunakan drone fixed wing di area padat bangunan berisiko karena?", options: ["Sulit manuver & butuh landasan","Tidak bisa terbang jauh","Kamera tidak bisa dipasang","Baterai cepat habis"], answer: 0 },
{ q: "Drone nano sering dipakai untuk?", options: ["Pemetaan ribuan hektar","Pengintaian ruangan sempit","Membawa logistik","Transportasi orang"], answer: 1 },
{ q: "Kelemahan utama tethered UAV adalah?", options: ["Harga murah","Terbatas kabel","Baterai cepat habis","Tidak bisa stabil"], answer: 1 },
{ q: "Fotogrametri adalah teknik untuk?", options: ["Menghitung koordinat dengan GPS","Mengukur tanah dengan meteran","Mengukur dan membuat peta dari foto udara","Menentukan cuaca"], answer: 2 },
{ q: "Dalam fotogrametri drone, kelebihan utama adalah?", options: ["Menghasilkan peta cepat dan detail","Selalu gratis","Tidak butuh kamera","Tidak butuh pengolahan data"], answer: 0 },
{ q: "Jika ingin pemetaan 3D gedung, metode yang digunakan dalam fotogrametri adalah?", options: ["Radar satelit","Sketsa manual","Pengolahan citra overlap","Mengukur langsung dengan meteran"], answer: 2 },
{ q: "Menggunakan drone untuk fotogrametri di cuaca berangin punya kelemahan yaitu?", options: ["Baterai awet","Data bisa blur atau meleset","Proses jadi lebih cepat","Kualitas kamera naik"], answer: 1 },
{ q: "Dalam fotogrametri, overlap antar foto penting untuk?", options: ["Memperbesar drone","Mengurangi kamera","Menghemat baterai","Membuat model 3D akurat"], answer: 3 },
{ q: "Drone mini biasanya dipakai untuk?", options: ["Pengawasan nasional","Transportasi manusia","Penelitian luar angkasa","Pemetaan lahan menengah"], answer: 3 },
{ q: "Kelebihan multirotor UAV dibanding fixed wing adalah?", options: ["Tidak butuh baterai","Durasi lebih lama","Bisa hover dan take-off vertikal","Lebih murah selalu"], answer: 2 },
{ q: "Drone balap lebih mengutamakan kelebihan apa?", options: ["Kemampuan mapping","Durasi lama","Kapasitas muatan","Kecepatan dan kelincahan"], answer: 3 },
{ q: "Drone fotogrametri harus punya kamera dengan resolusi tinggi. Mengapa?", options: ["Supaya bisa hover lebih lama","Agar detail objek jelas pada peta","Supaya drone lebih ringan","Supaya baterai hemat"], answer: 1 },
{ q: "Jika lahan sempit ingin dipetakan cepat, jenis drone yang paling cocok adalah?", options: ["Hybrid","Tethered","Multirotor","Fixed Wing"], answer: 2 },
{ q: "Andi mengukur batas lahan dengan GPS, ia tidak perlu menarik meteran panjang. Kelebihan GPS dalam kasus ini adalah?", options: ["Menghemat waktu","Lebih murah","Tidak butuh satelit","Tidak pakai baterai"], answer: 0 },
{ q: "Budi mencoba menggunakan GPS di dalam gedung, tetapi sinyal tidak stabil. Ini merupakan kelemahan GPS karena?", options: ["Sinyal satelit terhalang","Baterai boros","Jam tidak sinkron","Tidak ada peta"], answer: 0 },
{ q: "Dalam pemetaan luas sawah, GPS sangat membantu karena?", options: ["Memberikan koordinat langsung","Tidak pernah salah","Tidak butuh operator","Tidak memerlukan satelit"], answer: 0 },
{ q: "Di daerah pegunungan yang curam, kelemahan GPS sering muncul yaitu?", options: ["Sinyal sulit diterima","Data selalu salah","GPS tidak bekerja dengan baterai","Koordinat otomatis tepat"], answer: 0 },
{ q: "Penggunaan GPS untuk survei memiliki kelebihan dibanding metode manual yaitu?", options: ["Data lebih cepat dan akurat","Tidak perlu satelit","Lebih mudah di dalam ruangan","Tanpa biaya sama sekali"], answer: 0 },
{ q: "Menggunakan GPS saat cuaca mendung atau hujan deras sering menyebabkan?", options: ["Akurasi menurun","Data lebih jelas","Koordinat tetap sempurna","Baterai lebih hemat"], answer: 0 },
{ q: "Dalam navigasi laut, kelebihan GPS adalah?", options: ["Memberikan posisi real-time","Hanya berfungsi di darat","Tidak bisa dipakai saat hujan","Membutuhkan kabel panjang"], answer: 0 },
{ q: "Kelemahan GPS yang sering dirasakan pengguna smartphone di perkotaan adalah?", options: ["Multipath akibat pantulan gedung","Data lebih cepat","Koordinat selalu salah","GPS tidak perlu satelit"], answer: 0 },
{ q: "Dalam survei skala besar, kelebihan GPS adalah?", options: ["Mampu mencakup area luas dengan cepat","Tidak butuh sinyal satelit","Tanpa baterai","Koordinat selalu salah"], answer: 0 },
{ q: "Saat baterai GPS habis di lapangan, kelemahan GPS dibanding metode manual terlihat karena?", options: ["Alat tidak bisa digunakan","Koordinat otomatis benar","Tidak ada sinyal meteran","Data tetap tersimpan"], answer: 0 },
{ q: "Kelebihan GPS dalam survei pertanian adalah?", options: ["Memudahkan pemetaan lahan","Tidak pernah error","Bisa dipakai di dalam rumah","Selalu gratis"], answer: 0 },
{ q: "Penggunaan GPS untuk akurasi tinggi butuh waktu lama karena?", options: ["Butuh koreksi diferensial","Tidak ada satelit","Meteran lebih cepat","Tidak pakai jam"], answer: 0 },
{ q: "Kelemahan GPS yang paling mengganggu di area hutan lebat adalah?", options: ["Sinyal satelit sulit masuk","Data otomatis hilang","Koordinat jadi negatif","Tidak bisa menyimpan posisi"], answer: 0 },
{ q: "Dalam pemetaan jalan raya, GPS berguna karena?", options: ["Memberikan jalur dan koordinat dengan cepat","Tidak perlu satelit","Bisa dipakai tanpa baterai","Lebih lambat dari manual"], answer: 0 },
{ q: "Kelebihan GPS dibanding kompas tradisional adalah?", options: ["Memberikan koordinat lintang bujur","Tidak butuh satelit","Tidak pernah rusak","Tidak butuh baterai"], answer: 0 },
{ q: "Salah satu kelemahan GPS adalah ketergantungan pada?", options: ["Sinyal satelit","Meteran panjang","Peta manual","Magnet bumi"], answer: 0 },
{ q: "Menggunakan GPS dalam survei konstruksi mempercepat pekerjaan karena?", options: ["Posisi bisa ditentukan secara langsung","Meteran lebih akurat","Tidak perlu baterai","Selalu gratis"], answer: 0 },
{ q: "Di lembah sempit dengan tebing tinggi, kelemahan GPS adalah?", options: ["Sinyal satelit terhalang","Akurasi semakin tinggi","Tidak butuh koreksi","Baterai semakin awet"], answer: 0 },
{ q: "Kelebihan utama GPS dibanding metode tradisional adalah?", options: ["Data spasial akurat dan real-time","Tidak butuh alat","Tidak perlu operator","Selalu bebas error"], answer: 0 },
{ q: "Dalam survei kota besar, kelemahan GPS sering muncul karena?", options: ["Multipath dari pantulan gedung","GPS tidak bisa dipakai siang hari","Koordinat otomatis salah","GPS tidak ada satelit"], answer: 0 },

];

// 🔹 Pool soal acak tanpa pengulangan
let shuffledQuestions = [];
let questionIndex = 0;

// 🔹 Fungsi shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 🔹 Inisialisasi shuffle di awal
function initQuestions() {
  shuffledQuestions = shuffleArray([...questions]);
  questionIndex = 0;
}

// 🔹 Posisi ke koordinat
function getCoordinates(pos){
  if(pos <= 0) return {x:5, y:470};
  let row = Math.floor((pos-1)/10);
  let col = (row % 2 === 0) ? (pos-1)%10 : 9-((pos-1)%10);
  let x = col * (canvas.width/10) + 25;
  let y = canvas.height - (row+1)*(canvas.height/10) + 25;
  return {x,y};
}

// 🔹 Render papan & token
function renderPlayers(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(boardImg,0,0,canvas.width,canvas.height);

  tokenContainer.innerHTML = "";
  players.forEach((pos,i)=>{
    let {x,y} = getCoordinates(pos);
    let token = document.createElement("div");
    token.classList.add("token");
    token.style.background = colors[i];
    token.style.left = (canvas.offsetLeft + x - 14) + "px";
    token.style.top = (canvas.offsetTop + y - 14) + "px";
    token.innerText = i+1;
    tokenContainer.appendChild(token);
  });
}

// 🔹 Lempar dadu
function rollDice(){
  currentPlayer = parseInt(document.getElementById("playerSelect").value);
  currentDice = Math.floor(Math.random()*6)+1;
  document.getElementById("diceResult").innerText = "Dadu: " + currentDice;
  showQuestion();
}

// 🔹 Tampilkan soal acak tanpa pengulangan
function showQuestion() {
  if (questionIndex >= shuffledQuestions.length) {
    initQuestions(); // reset & shuffle ulang jika semua soal habis
  }

  currentQuestion = shuffledQuestions[questionIndex];
  questionIndex++;

  document.getElementById("questionBox").style.display = "block";
  document.getElementById("questionText").innerText = currentQuestion.q;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  currentQuestion.options.forEach((opt, i) => {
    let btn = document.createElement("div");
    btn.classList.add("option");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(i);
    optionsDiv.appendChild(btn);
  });
}

// 🔹 Cek jawaban
function checkAnswer(selectedIndex){
  document.getElementById("questionBox").style.display = "none";

  if(selectedIndex === currentQuestion.answer){
    let move = confirm("✅ Jawaban benar! Mau bergerak sesuai dadu ("+currentDice+")?");
    if(move){
      movePlayer(currentPlayer, currentDice);
    }
  } else {
    let nextPos = players[currentPlayer] + currentDice;
    if(snakes[nextPos]){
      players[currentPlayer] = snakes[nextPos];
      alert("❌ Jawaban salah, kena ular! Turun ke "+ players[currentPlayer]);
    } else {
      alert("❌ Jawaban salah, tidak bergerak.");
    }
    renderPlayers();
  }
}

// 🔹 Pindahkan pemain otomatis
function movePlayer(p, steps){
  let oldPos = players[p];
  players[p] += steps;

  if(players[p] in ladders) players[p] = ladders[players[p]];
  if(players[p] in snakes) players[p] = snakes[players[p]];

  // tukar posisi jika tabrakan
  for(let i=0;i<players.length;i++){
    if(i!==p && players[i]===players[p]){
      players[i] = oldPos;
      alert(`🔄 Tim ${p+1} dan Tim ${i+1} bertukar posisi!`);
    }
  }

  if(players[p] >= 100){
    alert("🎉 Tim " + (p+1) + " MENANG!");
    players = [0,0,0,0,0,0];
  }
  renderPlayers();
}

// 🔹 Pindah manual
function movePlayerManual(){
  const teamIndex = parseInt(document.getElementById("playerSelect").value);
  const manualPos = parseInt(document.getElementById("manualPos").value);

  if(manualPos>=1 && manualPos<=100){
    players[teamIndex] = manualPos;
    renderPlayers();
  } else {
    alert("Posisi harus antara 1 dan 100");
  }
}

// 🔹 Inisialisasi pool soal di awal
initQuestions();
