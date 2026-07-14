import { useState } from 'react';

// Data dummy untuk menu bolu
const daftarBolu = [
  {
    id: 1,
    nama: 'Bolu Coklat Lumer',
    deskripsi: 'Bolu lembut dengan lumeran coklat pekat di tengahnya.',
    harga: 45000,
    gambar: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&q=80',
  },
  {
    id: 2,
    nama: 'Bolu Keju Panggang',
    deskripsi: 'Taburan keju melimpah dengan tekstur bolu yang gurih dan manis.',
    harga: 50000,
    gambar: 'https://images.unsplash.com/photo-1557925923-33b251d5928f?w=500&q=80',
  },
  {
    id: 3,
    nama: 'Bolu Pandan Wangi',
    deskripsi: 'Aroma pandan asli yang harum dengan tekstur super empuk.',
    harga: 40000,
    gambar: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500&q=80',
  }
];

function App() {
  const [nama, setNama] = useState('');
  const [keranjang, setKeranjang] = useState([]);
  const [pembayaran, setPembayaran] = useState('Lunas');
  const [metodePengiriman, setMetodePengiriman] = useState('Diantar ke lokasi');
  const [lokasi, setLokasi] = useState(null);
  const [loadingLokasi, setLoadingLokasi] = useState(false);

  // Fungsi tambah pesanan ke keranjang
  const tambahPesanan = (bolu) => {
    const itemExist = keranjang.find(item => item.id === bolu.id);
    if (itemExist) {
      setKeranjang(keranjang.map(item => 
        item.id === bolu.id ? { ...item, jumlah: item.jumlah + 1 } : item
      ));
    } else {
      setKeranjang([...keranjang, { ...bolu, jumlah: 1 }]);
    }
  };

  // Fungsi kurangi pesanan dari keranjang
  const kurangiPesanan = (id) => {
    const itemExist = keranjang.find(item => item.id === id);
    if (itemExist.jumlah === 1) {
      setKeranjang(keranjang.filter(item => item.id !== id));
    } else {
      setKeranjang(keranjang.map(item => 
        item.id === id ? { ...item, jumlah: item.jumlah - 1 } : item
      ));
    }
  };

  // Menghitung total harga
  const totalHarga = keranjang.reduce((total, item) => total + (item.harga * item.jumlah), 0);

  // Fungsi GPS
  const getLokasi = () => {
    setLoadingLokasi(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLokasi({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoadingLokasi(false);
        },
        (error) => {
          alert('Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.');
          setLoadingLokasi(false);
        }
      );
    } else {
      alert('Browser Anda tidak mendukung fitur geolokasi.');
      setLoadingLokasi(false);
    }
  };

  // Fungsi WA
  const kirimKeWhatsApp = (e) => {
    e.preventDefault();
    if (!nama) {
      alert('Mohon lengkapi Nama Lengkap terlebih dahulu.');
      return;
    }
    if (metodePengiriman === 'Diantar ke lokasi' && !lokasi) {
      alert('Mohon Izinkan Akses Lokasi terlebih dahulu untuk keperluan pengiriman.');
      return;
    }
    if (keranjang.length === 0) {
      alert('Mohon pilih minimal 1 kue bolu ke dalam keranjang pesanan.');
      return;
    }

    const nomorWA = '6289677705979';
    
    // Looping daftar pesanan untuk format WA
    const detailPesanan = keranjang
      .map(item => `- ${item.nama} (${item.jumlah} Box) : Rp ${(item.harga * item.jumlah).toLocaleString('id-ID')}`)
      .join('%0A');

    const linkMap = lokasi ? `https://www.google.com/maps?q=${lokasi.lat},${lokasi.lng}` : '-';

    const pesan = `Halo, saya ingin memesan Kue Bolu:%0A%0A` +
      `*Nama:* ${nama}%0A%0A` +
      `*Detail Pesanan:*%0A${detailPesanan}%0A%0A` +
      `*Total Tagihan:* Rp ${totalHarga.toLocaleString('id-ID')}%0A` +
      `*Tipe Pembayaran:* ${pembayaran}%0A` +
      `*Metode Pengiriman:* ${metodePengiriman}%0A` +
      (metodePengiriman === 'Diantar ke lokasi' ? `*Lokasi Pengiriman:* ${linkMap}%0A%0A` : '%0A') +
      `Terima kasih!`;

    const urlWA = `https://wa.me/${nomorWA}?text=${pesan}`;
    window.open(urlWA, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-10">
      {/* Main Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-lg mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Pesan Kue Bolu</h1>
        
        <form onSubmit={kirimKeWhatsApp} className="space-y-6">
          
          {/* Input Nama */}
          <div>
            <label className="block text-sm font-bold text-gray-500 tracking-wide mb-2 uppercase">Nama Lengkap</label>
            <input 
              type="text" 
              placeholder="Masukkan nama Anda..."
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5a4bfa] transition-colors bg-gray-50/50"
              required
            />
          </div>

          {/* List Menu Bolu Berbasis Kartu */}
          <div>
            <label className="block text-sm font-bold text-gray-500 tracking-wide mb-3 uppercase">Pilih Menu Bolu</label>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {daftarBolu.map((bolu) => {
                const itemDiKeranjang = keranjang.find(item => item.id === bolu.id);
                const jumlah = itemDiKeranjang ? itemDiKeranjang.jumlah : 0;

                return (
                  <div key={bolu.id} className={`flex gap-4 border p-3 rounded-xl items-center transition-colors ${jumlah > 0 ? 'border-[#5a4bfa] bg-[#5a4bfa]/5' : 'border-gray-200 bg-gray-50/50'}`}>
                    <img src={bolu.gambar} alt={bolu.nama} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 leading-tight">{bolu.nama}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{bolu.deskripsi}</p>
                      <p className="text-sm font-bold text-gray-800 mt-1">Rp {bolu.harga.toLocaleString('id-ID')}</p>
                    </div>

                    <div className="flex flex-col items-center">
                      {jumlah > 0 ? (
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                          <button type="button" onClick={() => kurangiPesanan(bolu.id)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-md font-bold transition-colors">-</button>
                          <span className="text-sm font-bold w-4 text-center">{jumlah}</span>
                          <button type="button" onClick={() => tambahPesanan(bolu)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md font-bold transition-colors">+</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => tambahPesanan(bolu)} className="bg-[#5a4bfa]/10 text-[#5a4bfa] hover:bg-[#5a4bfa] hover:text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                          Tambah
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Opsi Pengiriman */}
          <div>
            <label className="block text-sm font-bold text-gray-500 tracking-wide mb-3 uppercase">Metode Pengiriman</label>
            <div className="flex gap-3">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${metodePengiriman === 'Diantar ke lokasi' ? 'border-[#5a4bfa] bg-[#5a4bfa]/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="pengiriman" value="Diantar ke lokasi" onChange={(e) => setMetodePengiriman(e.target.value)} checked={metodePengiriman === 'Diantar ke lokasi'} className="hidden" />
                <span className={`text-sm font-bold ${metodePengiriman === 'Diantar ke lokasi' ? 'text-[#5a4bfa]' : 'text-gray-600'}`}>🛵 Diantar</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${metodePengiriman === 'Diambil ke tempat' ? 'border-[#5a4bfa] bg-[#5a4bfa]/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="pengiriman" value="Diambil ke tempat" onChange={(e) => setMetodePengiriman(e.target.value)} checked={metodePengiriman === 'Diambil ke tempat'} className="hidden" />
                <span className={`text-sm font-bold ${metodePengiriman === 'Diambil ke tempat' ? 'text-[#5a4bfa]' : 'text-gray-600'}`}>📦 Ambil Sendiri</span>
              </label>
            </div>
          </div>

          {/* Tombol Lokasi */}
          {metodePengiriman === 'Diantar ke lokasi' && (
            <div>
              <button 
                type="button" 
                onClick={getLokasi}
                className={`w-full py-4 px-4 rounded-xl font-bold border-2 transition-all ${lokasi ? 'border-green-500 text-green-700 bg-green-50 shadow-sm' : 'border-gray-200 text-gray-500 hover:bg-gray-50 border-dashed'}`}
              >
                {loadingLokasi ? 'Mencari Lokasi...' : lokasi ? '✅ Titik Lokasi Tersimpan' : '📍 Izinkan & Ambil Lokasi Pengiriman'}
              </button>
              {!lokasi && <p className="text-[11px] text-red-500 mt-2 text-center font-medium">*Wajib izinkan akses lokasi (GPS) untuk pengiriman kurir</p>}
            </div>
          )}

          {/* Ringkasan Total & QRIS */}
          <div className="border border-gray-200 p-5 rounded-2xl bg-white shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <span className="font-bold text-gray-600">Total Tagihan:</span>
              <span className="text-xl font-black text-[#5a4bfa]">Rp {totalHarga.toLocaleString('id-ID')}</span>
            </div>

            <div>
               <label className="block text-xs font-bold text-gray-400 tracking-wide text-center uppercase mb-3">Scan QRIS untuk Pembayaran</label>
               <img 
                 src="https://placehold.co/300x300/e2e8f0/475569?text=Gambar+QRIS+Kamu" 
                 alt="QRIS Pembayaran" 
                 className="w-40 h-40 object-cover mx-auto rounded-xl shadow-sm border border-gray-100"
               />
            </div>
             
             <div className="flex gap-4 justify-center bg-gray-50 p-2 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="pembayaran" value="DP 50%" onChange={(e) => setPembayaran(e.target.value)} checked={pembayaran === 'DP 50%'} className="w-4 h-4 text-[#5a4bfa] focus:ring-[#5a4bfa]" />
                  <span className="text-sm font-semibold text-gray-700">DP 50%</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="pembayaran" value="Lunas" onChange={(e) => setPembayaran(e.target.value)} checked={pembayaran === 'Lunas'} className="w-4 h-4 text-[#5a4bfa] focus:ring-[#5a4bfa]" />
                  <span className="text-sm font-semibold text-gray-700">Lunas</span>
                </label>
             </div>
          </div>

          {/* Tombol Kirim WhatsApp */}
          <button 
            type="submit" 
            className="w-full bg-[#5a4bfa] hover:bg-[#4838e0] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#5a4bfa]/30 transition-transform transform active:scale-95"
          >
            Kirim ke WhatsApp 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>

      {/* Footer Copyright */}
      <footer className="text-center text-sm text-gray-500 font-medium">
        Copyright &copy; 2026 dibuat oleh{' '}
        <a 
          href="https://portfolio-nana-suryana.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#5a4bfa] hover:text-[#4838e0] hover:underline font-bold transition-colors"
        >
          Nana Suryana
        </a>
      </footer>
    </div>
  );
}

export default App;