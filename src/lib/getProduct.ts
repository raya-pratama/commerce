export async function getProducts() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSjiljD7H8GZbDskFKcZ1v9UTCSq8B2YmqcDW6j2flxEFag5MfjVEb91b3sO-OaYJKD-q3DhaHLHBS6/pub?gid=0&single=true&output=csv";

  try {
    const response = await fetch(url, { 
  cache: 'no-store',
});
    const csvText = await response.text();

    const rows = csvText.split('\n').slice(1);
    return rows.map((row) => {
      const columns = row.split(',');
      const rawGambar = columns[5] || '';
      return {
        id: columns[0]?.trim(),
        nama: columns[1]?.trim(),
        harga: parseInt(columns[3]?.replace(/[^0-9]/g, "")) || 0,
        kategori: columns[2]?.trim(),
        deskripsi: columns[4]?.trim(),
        gambar: rawGambar.trim()
      };
    });
  } catch (error) {
    console.error("Gagal ambil data:", error);
    return [];
  }
}