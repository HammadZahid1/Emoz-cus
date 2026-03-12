'use client';

import Image from 'next/image';

export default function ReceiptPreview({ items, receiptRef }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const now = new Date();
  const date = now.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const time = now.toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div
      ref={receiptRef}
      style={{ backgroundColor: '#111827', fontFamily: 'Inter, sans-serif' }}
      className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
    >
      {/* Header */}
      <div className="flex flex-col items-center px-6 pt-8 pb-4" style={{ backgroundColor: '#111827' }}>
        {/* Logo */}
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-600 flex items-center justify-center mb-3 bg-black">
          <Image
            src="/logo.png"
            alt="Emoz Logo"
            width={80}
            height={80}
            className="object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<span style="font-size:32px">🍽️</span>';
            }}
          />
        </div>
        <h1 style={{ color: '#23c55e', fontSize: '20px', fontWeight: 700, letterSpacing: '0.05em', margin: 0 }}>
          EMOZ
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>{date}</p>
        <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>{time}</p>
      </div>

      {/* Dashed divider */}
      <div style={{ borderTop: '2px dashed #374151', margin: '0 24px' }} />

      {/* Items table */}
      <div className="px-6 py-4" style={{ backgroundColor: '#111827' }}>
        {/* Table header */}
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: '1fr auto auto auto',
            borderBottom: '1px solid #374151',
            paddingBottom: '8px',
            marginBottom: '8px',
          }}
        >
          <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Item</span>
          <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Qty</span>
          <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Price</span>
          <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Total</span>
        </div>

        {/* Rows */}
        {items.length === 0 ? (
          <p style={{ color: '#4b5563', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
            No items added yet
          </p>
        ) : (
          items.map((item, idx) => (
            <div
              key={idx}
              className="grid gap-2"
              style={{
                gridTemplateColumns: '1fr auto auto auto',
                paddingTop: '6px',
                paddingBottom: '6px',
                borderBottom: '1px solid #1f2937',
              }}
            >
              <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 500 }}>{item.name}</span>
              <span style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center' }}>{item.qty}</span>
              <span style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'right' }}>
                {item.price.toLocaleString()}
              </span>
              <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>
                {(item.price * item.qty).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Dashed divider */}
      <div style={{ borderTop: '2px dashed #374151', margin: '0 24px' }} />

      {/* Totals */}
      <div className="px-6 py-4" style={{ backgroundColor: '#111827' }}>
        <div className="flex justify-between items-center mb-2">
          <span style={{ color: '#9ca3af', fontSize: '13px' }}>Subtotal</span>
          <span style={{ color: '#d1d5db', fontSize: '13px' }}>PKR {subtotal.toLocaleString()}</span>
        </div>
        <div style={{ borderTop: '1px solid #374151', marginTop: '8px', paddingTop: '8px' }} className="flex justify-between items-center">
          <span style={{ color: '#e5e7eb', fontSize: '15px', fontWeight: 700 }}>Total Amount</span>
          <span style={{ color: '#23c55e', fontSize: '18px', fontWeight: 800 }}>
            PKR {subtotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Dashed divider */}
      <div style={{ borderTop: '2px dashed #374151', margin: '0 24px' }} />

      {/* Footer */}
      <div
        className="flex flex-col items-center px-6 py-6"
        style={{ backgroundColor: '#111827' }}
      >
        <p style={{ color: '#23c55e', fontSize: '14px', fontWeight: 600, letterSpacing: '0.04em', margin: 0 }}>
          ✦ Thanks for ordering ✦
        </p>

        {/* JazzCash Payment Info */}
        <div style={{ borderTop: '1px dashed #374151', marginTop: '14px', paddingTop: '14px', width: '100%', textAlign: 'center' }}>
          <p style={{ color: '#d1d5db', fontSize: '12px', fontWeight: 600, margin: 0 }}>
            JazzCash: 03194652003
          </p>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '3px' }}>
            Himna Zahid
          </p>
        </div>

        <p style={{ color: '#4b5563', fontSize: '11px', marginTop: '10px' }}>
          www.emozofficial.com
        </p>
      </div>
    </div>
  );
}
