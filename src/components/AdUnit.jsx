import React, { useEffect } from 'react';

const AdUnit = ({ slotId, format = "auto" }) => {
  useEffect(() => {
    try {
      // Push script adsense setiap kali komponen di-load
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense Error:", e);
    }
  }, []);

  return (
    <div className="my-6 flex justify-center items-center overflow-hidden rounded-xl shadow-sm border border-gray-100 bg-white min-h-[100px]">
      <p className="text-[10px] text-gray-300 absolute">IKLAN ADSENSE</p>
      {/* Script Iklan */}
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%' }}
           data-ad-client="ca-pub-3569362599427137"  // ID Pub lo (udah gue masukin)
           data-ad-slot="5236520310" // Slot ID dinamis
           data-ad-format={format}
           data-full-width-responsive="true"></ins>
    </div>
  );
};

export default AdUnit;