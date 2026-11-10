"use client";
const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || "256707042220";
const MSG = encodeURIComponent(
  "Hello A.A.M CASH KING1 INTERNETS, I have a payment screenshot to send for activation."
);

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${NUMBER}?text=${MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-transform"
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
        <path d="M20.52 3.48A11.9 11.9 0 0012.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.24-1.63a11.94 11.94 0 005.8 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.48-8.42zM12.05 21.8h-.01a9.86 9.86 0 01-5.02-1.37l-.36-.21-3.7.97.99-3.61-.24-.37a9.83 9.83 0 01-1.51-5.26c0-5.45 4.43-9.88 9.88-9.88 2.64 0 5.12 1.03 6.98 2.9a9.82 9.82 0 012.9 6.99c0 5.45-4.44 9.84-9.91 9.84zm5.42-7.37c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.1 4.49.71.31 1.27.49 1.7.63.71.23 1.36.19 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
      </svg>
    </a>
  );
}
