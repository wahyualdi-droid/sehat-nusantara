// --- 1. DATA DOKTER DALAM ARRAY BERISI OBJEK (Pertemuan 3) ---
const dataDokter = [
    { id: 1, nama: "dr. Arief Rahman, Sp.PD", poli: "Umum", hari: "Senin, Rabu, Jumat", jam: "08:00 - 12:00", status: "Praktik" },
    { id: 2, nama: "dr. Siska Melina", poli: "Umum", hari: "Selasa, Kamis, Sabtu", jam: "08:00 - 12:00", status: "Praktik" },
    { id: 3, nama: "drg. Budi Santoso", poli: "Gigi", hari: "Senin s.d. Kamis", jam: "09:00 - 14:00", status: "Praktik" },
    { id: 4, nama: "drg. Anisa Putri", poli: "Gigi", hari: "Jumat, Sabtu", jam: "09:00 - 13:00", status: "Cuti" },
    { id: 5, nama: "dr. Rian Hidayat, Sp.A", poli: "KIA", hari: "Senin, Selasa, Kamis", jam: "08:00 - 13:00", status: "Praktik" },
    { id: 6, nama: "dr. Diana Lestari, M.Gizi", poli: "Gizi", hari: "Rabu, Jumat", jam: "10:00 - 14:00", status: "Praktik" }
];

document.addEventListener("DOMContentLoaded", () => {
    // --- 2. FUNGSI SAPAAN WAKTU DINAMIS (Pertemuan 3) ---
    const elSapaan = document.getElementById("sapaan-pengguna");
    if (elSapaan) {
        const jam = new Date().getHours();
        let waktu = "Pagi";
        if (jam >= 11 && jam < 15) waktu = "Siang";
        else if (jam >= 15 && jam < 18) waktu = "Sore";
        else if (jam >= 18 || jam < 4) waktu = "Malam";

        elSapaan.innerText = `Selamat ${waktu}! Solusi kesehatan terpercaya, cepat, dan profesional untuk Anda dan keluarga di Kota Kediri.`;
    }

    // --- 3. RENDER DAN FILTER TABEL DOKTER (Pertemuan 4 & 6) ---
    const tabelDokterBody = document.getElementById("tabel-dokter-body");
    const filterPoli = document.getElementById("filter-poli");
    const btnToggleJadwal = document.getElementById("btn-toggle-jadwal");
    const wadahTabelJadwal = document.getElementById("wadah-tabel-jadwal");

    function renderTabelDokter(filter = "Semua") {
        if (!tabelDokterBody) return;
        tabelDokterBody.innerHTML = "";
        
        const filtered = filter === "Semua" ? dataDokter : dataDokter.filter(d => d.poli === filter);
        
        if (filtered.length === 0) {
            tabelDokterBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Tidak ada jadwal dokter untuk poliklinik ini.</td></tr>`;
            return;
        }

        filtered.forEach((dok, index) => {
            const badgeStatus = dok.status === "Praktik" ? "bg-success" : "bg-danger";
            const row = `<tr>
                <td>${index + 1}</td>
                <td class="fw-semibold">${dok.nama}</td>
                <td>Poliklinik ${dok.poli}</td>
                <td>${dok.hari}</td>
                <td>${dok.jam}</td>
                <td><span class="badge ${badgeStatus}">${dok.status}</span></td>
            </tr>`;
            tabelDokterBody.innerHTML += row;
        });
    }

    if (tabelDokterBody) {
        renderTabelDokter();
        
        // Event Change untuk Filter Poliklinik
        filterPoli.addEventListener("change", (e) => {
            renderTabelDokter(e.target.value);
        });

        // Event Click untuk Toggle (Tampilkan/Sembunyikan) Jadwal
        btnToggleJadwal.addEventListener("click", () => {
            if (wadahTabelJadwal.style.display === "none") {
                wadahTabelJadwal.style.display = "block";
                btnToggleJadwal.innerText = "Sembunyikan Jadwal";
                btnToggleJadwal.classList.replace("btn-secondary", "btn-outline-secondary");
            } else {
                wadahTabelJadwal.style.display = "none";
                btnToggleJadwal.innerText = "Tampilkan Jadwal";
                btnToggleJadwal.classList.replace("btn-outline-secondary", "btn-secondary");
            }
        });
    }

    // --- 4. FORM PENDAFTARAN & VALIDASI SISI KLIEN (Pertemuan 3, 4, 6, 8) ---
    const formPendaftaran = document.getElementById("form-pendaftaran");
    if (formPendaftaran) {
        const inputTglLahir = document.getElementById("tgl-lahir");
        const tampilUsia = document.getElementById("tampil-usia");
        const selectPoliForm = document.getElementById("poli");
        const selectDokterForm = document.getElementById("dokter");
        const inputKeluhan = document.getElementById("keluhan");
        const hitungKarakter = document.getElementById("hitung-karakter");

        // Batasi tanggal kunjungan (Hari ini s.d. 14 hari ke depan)
        const inputTglKunjungan = document.getElementById("tgl-kunjungan");
        if (inputTglKunjungan) {
            const today = new Date();
            const maxDate = new Date();
            maxDate.setDate(today.getDate() + 14);

            inputTglKunjungan.min = today.toISOString().split("T")[0];
            inputTglKunjungan.max = maxDate.toISOString().split("T")[0];
        }

        // Hitung Usia Otomatis dari Tanggal Lahir (Fungsi JS)
        inputTglLahir.addEventListener("change", () => {
            const tglLahirVal = new Date(inputTglLahir.value);
            const today = new Date();
            if (tglLahirVal > today) {
                tampilUsia.value = "Tanggal tidak valid!";
                return;
            }
            let tahun = today.getFullYear() - tglLahirVal.getFullYear();
            let bulan = today.getMonth() - tglLahirVal.getMonth();
            if (bulan < 0 || (bulan === 0 && today.getDate() < tglLahirVal.getDate())) {
                tahun--;
            }
            tampilUsia.value = `${tahun} tahun`;
        });

        // Pilihan Dokter Berubah Otomatis Sesuai Poliklinik (DOM)
        selectPoliForm.addEventListener("change", () => {
            const poliPilihan = selectPoliForm.value;
            selectDokterForm.innerHTML = '<option value="">-- Pilih Dokter --</option>';
            
            if (poliPilihan) {
                selectDokterForm.removeAttribute("disabled");
                const dokTersedia = dataDokter.filter(d => d.poli === poliPilihan);
                dokTersedia.forEach(d => {
                    selectDokterForm.innerHTML += `<option value="${d.nama}">${d.nama} (${d.hari})</option>`;
                });
            } else {
                selectDokterForm.setAttribute("disabled", "true");
                selectDokterForm.innerHTML = '<option value="">-- Pilih Poliklinik Dahulu --</option>';
            }
        });

        // Penghitung Karakter Keluhan (Event Input)
        inputKeluhan.addEventListener("input", () => {
            const panjang = inputKeluhan.value.length;
            hitungKarakter.innerText = `${panjang} / 200 karakter`;
        });

        // Validasi Form saat Submit (Pertemuan 8)
        formPendaftaran.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;

            // Reset Error Messages
            document.querySelectorAll(".text-danger.small").forEach(el => el.innerText = "");

            // 1. Nama Lengkap (Minimal 3 karakter, hanya huruf & spasi)
            const nama = document.getElementById("nama").value.trim();
            const regexNama = /^[A-Za-z\s]{3,}$/;
            if (!regexNama.test(nama)) {
                document.getElementById("error-nama").innerText = "Nama wajib diisi, minimal 3 karakter, hanya huruf dan spasi.";
                isValid = false;
            }

            // 2. NIK (Tepat 16 digit angka)
            const nik = document.getElementById("nik").value.trim();
            const regexNik = /^\d{16}$/;
            if (!regexNik.test(nik)) {
                document.getElementById("error-nik").innerText = "NIK wajib diisi dan harus tepat 16 digit angka.";
                isValid = false;
            }

            // 3. Tanggal Lahir (Wajib, tidak boleh masa depan)
            const tglLahir = inputTglLahir.value;
            if (!tglLahir || new Date(tglLahir) > new Date()) {
                document.getElementById("error-tgl-lahir").innerText = "Tanggal lahir wajib diisi dan tidak boleh di masa depan.";
                isValid = false;
            }

            // 4. Jenis Kelamin
            const gender = document.querySelector('input[name="gender"]:checked');
            if (!gender) {
                document.getElementById("error-gender").innerText = "Pilih salah satu jenis kelamin.";
                isValid = false;
            }

            // 5. Nomor HP (Diawali 08 atau 62, panjang 10-14 digit)
            const noHp = document.getElementById("no-hp").value.trim();
            const regexHp = /^(08|62)\d{8,12}$/;
            if (!regexHp.test(noHp)) {
                document.getElementById("error-no-hp").innerText = "Nomor HP tidak valid (diawali 08/62, panjang 10–14 digit).";
                isValid = false;
            }

            // 6. Email (Opsional, jika diisi format harus benar)
            const email = document.getElementById("email").value.trim();
            if (email && !email.includes("@")) {
                document.getElementById("error-email").innerText = "Format email tidak valid.";
                isValid = false;
            }

            // 7 & 8. Poliklinik & Dokter
            const poli = selectPoliForm.value;
            const dokter = selectDokterForm.value;
            if (!poli) {
                document.getElementById("error-poli").innerText = "Silakan pilih poliklinik.";
                isValid = false;
            }
            if (!dokter) {
                document.getElementById("error-dokter").innerText = "Silakan pilih dokter.";
                isValid = false;
            }

            // 9. Tanggal Kunjungan
            const tglKunjungan = inputTglKunjungan.value;
            if (!tglKunjungan) {
                document.getElementById("error-tgl-kunjungan").innerText = "Tanggal kunjungan wajib diisi.";
                isValid = false;
            }

            // 10. Keluhan (10 - 200 karakter)
            const keluhan = inputKeluhan.value.trim();
            if (keluhan.length < 10 || keluhan.length > 200) {
                document.getElementById("error-keluhan").innerText = "Keluhan wajib diisi antara 10 hingga 200 karakter.";
                isValid = false;
            }

            // 11. Persetujuan Checkbox
            const persetujuan = document.getElementById("persetujuan").checked;
            if (!persetujuan) {
                document.getElementById("error-persetujuan").innerText = "Anda harus mencentang kotak persetujuan data.";
                isValid = false;
            }

            // JIKA VALID: Tampilkan Modal Ringkasan dan Nomor Antrean Simulasi
            if (isValid) {
                const nomorAntrean = `${poli.toUpperCase().substring(0, 4)}-${Math.floor(100 + Math.random() * 900)}`;
                
                const isiRingkasan = document.getElementById("isi-ringkasan");
                isiRingkasan.innerHTML = `
                    <div class="text-center mb-3">
                        <span class="text-muted small">Nomor Antrean Anda</span>
                        <h2 class="text-success fw-bold display-6" style="color: var(--primary-emerald) !important;">${nomorAntrean}</h2>
                    </div>
                    <ul class="list-group list-group-flush small">
                        <li class="list-group-item d-flex justify-content-between"><span>Nama:</span> <strong>${nama}</strong></li>
                        <li class="list-group-item d-flex justify-content-between"><span>NIK:</span> <strong>${nik}</strong></li>
                        <li class="list-group-item d-flex justify-content-between"><span>Poliklinik:</span> <strong>Poliklinik ${poli}</strong></li>
                        <li class="list-group-item d-flex justify-content-between"><span>Dokter Tujuan:</span> <strong>${dokter}</strong></li>
                        <li class="list-group-item d-flex justify-content-between"><span>Tgl Kunjungan:</span> <strong>${tglKunjungan}</strong></li>
                    </ul>
                    <div class="alert alert-success mt-3 small mb-0 bg-success bg-opacity-10 text-success border-0">
                        Harap datang 15 menit sebelum jam pelayanan dengan membawa kartu identitas (KTP/KIA).
                    </div>
                `;

                // Tampilkan Modal Bootstrap
                const modalEl = new bootstrap.Modal(document.getElementById("modalRingkasan"));
                modalEl.show();
            }
        });
    }
});
// Array dataDokter oleh Mahendra
// Validasi RegEx 11 kolom form dan modal antrean oleh Hamidah
