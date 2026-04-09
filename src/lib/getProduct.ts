export async function getProducts() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSjiljD7H8GZbDskFKcZ1v9UTCSq8B2YmqcDW6j2flxEFag5MfjVEb91b3sO-OaYJKD-q3DhaHLHBS6/pub?gid=0&single=true&output=csv";

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 } // Update data setiap 60 detik
    });
    const csvText = await response.text();

    const rows = csvText.split('\n').slice(1);
    return rows.map((row) => {
      const columns = row.split(',');
      return {
        id: columns[0]?.trim(),
        nama: columns[1]?.trim(),
        // Tambahkan pengecekan agar tidak Rp 0 jika kolomnya aneh
        harga: parseInt(columns[3]?.replace(/[^0-9]/g, "")) || 0,
        kategori: columns[2]?.trim(),
        deskripsi: columns[4]?.trim(),
        // PERBAIKAN DISINI: Jika kosong, kasih null atau link gambar default
        gambar: columns[5]?.trim() || "https://via.placeholder.com/400?text=No+Image",
      };
    });
  } catch (error) {
    console.error("Gagal ambil data:", error);
    return [];
  }
}