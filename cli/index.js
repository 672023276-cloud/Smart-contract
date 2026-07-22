require("dotenv").config();
const { ethers } = require("ethers");
const readlineSync = require("readline-sync");
const CONTRACT_ABI = require("./abi.json");

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.error("❌ PRIVATE_KEY dan CONTRACT_ADDRESS harus diisi di file .env");
  console.error("   Salin .env.example menjadi .env lalu lengkapi nilainya.");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

function tampilkanMenu() {
  console.log("\n=====================================");
  console.log("   SISTEM PENDAFTARAN HKI (Blockchain)");
  console.log("=====================================");
  console.log("1. Daftarkan HKI Baru");
  console.log("2. Lihat Detail HKI");
  console.log("3. Lihat Total HKI Terdaftar");
  console.log("4. Keluar");
  console.log("=====================================");
}

async function daftarkanHKI() {
  console.log("\n=== DAFTARKAN HKI BARU ===");
  const namaPemilik = readlineSync.question("Nama Pemilik   : ");
  const judulHKI = readlineSync.question("Judul HKI      : ");
  const jenisHKI = readlineSync.question("Jenis HKI      : ");
  const email = readlineSync.question("Email          : ");
  const noTelepon = readlineSync.question("No. Telepon    : ");
  const uraianSingkat = readlineSync.question("Uraian Singkat : ");

  try {
    console.log("\nMengirim transaksi ke blockchain...");
    const tx = await contract.registerHKI(
      namaPemilik,
      judulHKI,
      jenisHKI,
      email,
      noTelepon,
      uraianSingkat
    );
    const receipt = await tx.wait();

    // Ambil ID HKI dari event HKIRegistered yang dipancarkan kontrak
    let idBaru = null;
    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        if (parsed && parsed.name === "HKIRegistered") {
          idBaru = parsed.args.id.toString();
        }
      } catch (_) {
        // log dari kontrak lain / tidak cocok, abaikan
      }
    }

    console.log("✅ Berhasil didaftarkan!");
    console.log("ID HKI            :", idBaru ?? "(cek manual via menu 2)");
    console.log("Transaction Hash  :", receipt.hash);
    console.log("Gas Used          :", receipt.gasUsed.toString());
    console.log("Wallet Pendaftar  :", wallet.address);
  } catch (err) {
    console.error("❌ Gagal mendaftarkan HKI:", err.reason || err.message);
  }

  readlineSync.question("\nTekan ENTER untuk kembali ke menu utama...");
}

async function lihatDetailHKI() {
  console.log("\n=== LIHAT DETAIL HKI ===");
  const id = readlineSync.question("Masukkan ID HKI: ");

  try {
    console.log("\nMengambil data dari blockchain...");
    const data = await contract.getHKI(id);

    console.log("✅ Data ditemukan!");
    console.log("-------------------------------------");
    console.log("ID                :", data.id.toString());
    console.log("Nama Pemilik      :", data.namaPemilik);
    console.log("Judul HKI         :", data.judulHKI);
    console.log("Jenis HKI         :", data.jenisHKI);
    console.log("Email             :", data.email);
    console.log("No. Telepon       :", data.noTelepon);
    console.log("Uraian Singkat    :", data.uraianSingkat);
    console.log(
      "Tanggal Daftar    :",
      new Date(Number(data.tanggalPendaftaran) * 1000).toLocaleString("id-ID")
    );
    console.log("Wallet Pendaftar  :", data.walletPendaftar);
    console.log("-------------------------------------");
  } catch (err) {
    console.error("❌ Gagal mengambil data (pastikan ID benar):", err.reason || err.message);
  }

  readlineSync.question("\nTekan ENTER untuk kembali ke menu utama...");
}

async function lihatTotalHKI() {
  console.log("\n=== TOTAL HKI TERDAFTAR ===");
  try {
    const total = await contract.getTotalHKI();
    console.log("Total HKI yang terdaftar di blockchain:", total.toString());
  } catch (err) {
    console.error("❌ Gagal mengambil total HKI:", err.reason || err.message);
  }

  readlineSync.question("\nTekan ENTER untuk kembali ke menu utama...");
}

async function main() {
  console.log("Terhubung ke RPC:", RPC_URL);
  console.log("Alamat Kontrak  :", CONTRACT_ADDRESS);
  console.log("Wallet Aktif    :", wallet.address);

  let keluar = false;
  while (!keluar) {
    tampilkanMenu();
    const pilihan = readlineSync.question("Pilih menu (1-4): ");

    switch (pilihan.trim()) {
      case "1":
        await daftarkanHKI();
        break;
      case "2":
        await lihatDetailHKI();
        break;
      case "3":
        await lihatTotalHKI();
        break;
      case "4":
        console.log("\nTerima kasih telah menggunakan Sistem HKI Blockchain.");
        console.log("Program selesai.");
        keluar = true;
        break;
      default:
        console.log("\n⚠️  Pilihan tidak valid, silakan pilih 1-4.");
    }
  }
}

main();
