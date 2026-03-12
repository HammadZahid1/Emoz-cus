'use client';

import { useState, useRef } from 'react';
import ReceiptPreview from '../components/ReceiptPreview';

export default function Home() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', qty: '' });
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  function handleAddItem(e) {
    e.preventDefault();
    const name = form.name.trim();
    const price = parseFloat(form.price);
    const qty = parseInt(form.qty, 10);

    if (!name) return setError('Please enter an item name.');
    if (isNaN(price) || price <= 0) return setError('Please enter a valid price.');
    if (isNaN(qty) || qty < 1) return setError('Please enter a valid quantity (min 1).');

    setItems((prev) => [...prev, { name, price, qty }]);
    setForm({ name: '', price: '', qty: '' });
    setError('');
  }

  function handleRemoveItem(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleDownload() {
    if (!receiptRef.current) return;
    if (items.length === 0) {
      setError('Add at least one item before downloading.');
      return;
    }
    setDownloading(true);
    try {
      const html2canvasMod = await import('html2canvas');
      const html2canvas = html2canvasMod.default || html2canvasMod;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#111827',
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Size the PDF page to match the receipt aspect ratio (in mm)
      const pdfWidth = 80; // mm — receipt width
      const pdfHeight = (imgHeight / imgWidth) * pdfWidth;

      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('emoz-receipt.pdf');
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0d1117] py-8 px-4">
      {/* Page header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🧾</span>
          <h1 className="text-2xl font-bold text-white tracking-tight">Emoz Receipt</h1>
        </div>
        <p className="text-[#8b949e] text-sm ml-9">
          Generate and download receipts instantly
        </p>
      </div>

      {/* Main grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── LEFT COLUMN: Input + Item List ── */}
        <div className="space-y-6">

          {/* Item Input Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl">
            <h2 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#23c55e] inline-block" />
              Add Item
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-[#8b949e] text-xs font-medium mb-1.5 uppercase tracking-wide">
                  Item Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Biryani Special"
                  className="input-glow w-full bg-[#1c2330] border border-[#30363d] text-white placeholder-[#484f58] rounded-lg px-4 py-2.5 text-sm transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8b949e] text-xs font-medium mb-1.5 uppercase tracking-wide">
                    Price (PKR)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="450"
                    min="0"
                    step="1"
                    className="input-glow w-full bg-[#1c2330] border border-[#30363d] text-white placeholder-[#484f58] rounded-lg px-4 py-2.5 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] text-xs font-medium mb-1.5 uppercase tracking-wide">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="qty"
                    value={form.qty}
                    onChange={handleChange}
                    placeholder="1"
                    min="1"
                    className="input-glow w-full bg-[#1c2330] border border-[#30363d] text-white placeholder-[#484f58] rounded-lg px-4 py-2.5 text-sm transition-colors"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary w-full bg-[#23c55e] hover:bg-[#16a34a] text-white font-semibold rounded-lg py-2.5 text-sm"
              >
                + Add Item
              </button>
            </form>
          </div>

          {/* Added Items Table */}
          {items.length > 0 && (
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl receipt-animate">
              <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#23c55e] inline-block" />
                Items ({items.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#30363d]">
                      <th className="text-left text-[#8b949e] font-medium text-xs uppercase tracking-wide pb-2">Item</th>
                      <th className="text-center text-[#8b949e] font-medium text-xs uppercase tracking-wide pb-2">Qty</th>
                      <th className="text-right text-[#8b949e] font-medium text-xs uppercase tracking-wide pb-2">Price</th>
                      <th className="text-right text-[#8b949e] font-medium text-xs uppercase tracking-wide pb-2">Total</th>
                      <th className="pb-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-b border-[#1c2330] row-fade group">
                        <td className="py-2 text-[#e6edf3] font-medium">{item.name}</td>
                        <td className="py-2 text-[#8b949e] text-center">{item.qty}</td>
                        <td className="py-2 text-[#8b949e] text-right">
                          {item.price.toLocaleString()}
                        </td>
                        <td className="py-2 text-[#23c55e] font-semibold text-right">
                          {(item.price * item.qty).toLocaleString()}
                        </td>
                        <td className="py-2 pl-3">
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            className="text-[#484f58] hover:text-red-400 transition-colors text-lg leading-none"
                            title="Remove item"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="pt-4 text-right text-[#8b949e] font-medium text-sm pr-4">
                        Total Amount:
                      </td>
                      <td className="pt-4 text-right text-[#23c55e] font-bold text-base">
                        PKR {subtotal.toLocaleString()}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Download button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn-primary mt-5 w-full bg-gradient-to-r from-[#23c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Receipt
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: Receipt Preview ── */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl">
            <h2 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#23c55e] inline-block" />
              Receipt Preview
            </h2>
            <ReceiptPreview items={items} receiptRef={receiptRef} />
          </div>
        </div>

      </div>
    </main>
  );
}
