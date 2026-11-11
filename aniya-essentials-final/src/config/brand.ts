/**
 * Aniya Essentials — Official Brand & Order Configuration
 */
export const BRAND_CONFIG = {
  name: "Aniya Essentials",
  tagline: "Care for your hair, naturally.",

  // Official Business & Order Phone
  whatsappNumber: "923135074177",
  whatsappDisplay: "+92 313 5074177",
  contactPhone: "+92 313 5074177",

  // Official Orders Gmail
  ordersEmail: "aniyaessentials@gmail.com",

  // Official Bank Details for Direct Payment
  bankDetails: {
    bankName: "UBL (United Bank Limited)",
    accountTitle: "Azlan Ahmad Khan",
    iban: "PK80UNIL0109000311421826",
    accountNumber: "0109000311421826",
    branch: "Online / Any UBL Branch Pakistan",
  },

  // Official Mobile Wallets
  mobileWallets: {
    easypaisa: {
      accountTitle: "Azlan Ahmad Khan",
      number: "0313 5074177",
    },
    jazzcash: {
      accountTitle: "Azlan Ahmad Khan",
      number: "0313 5074177",
    },
  },

  // Courier Partners
  courier: {
    name: "TCS Express",
    trackingUrl: "https://www.tcsexpress.com/tracking?tracking_no=",
    deliveryDays: "3 to 5 business days",
  },

  currency: "PKR",
  freeShippingThreshold: 2500,
  standardShippingFee: 200,
  deliveryWindow: "3–5 business days",
  location: "Pakistan",
};

/**
 * Helper to generate direct WhatsApp chat link (for support inquiries only)
 */
export function getWhatsAppUrl(customMessage: string): string {
  const cleanNumber = BRAND_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(customMessage);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

/**
 * Helper to generate Gmail compose link with complete order details
 */
export function getGmailOrderUrl(
  orderId: string,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  itemsSummary: string,
  totalAmount: number
): string {
  const subject = encodeURIComponent(`[Order #${orderId}] ${customerName} - PKR ${totalAmount.toLocaleString()}`);
  const body = encodeURIComponent(
    `Hello Aniya Essentials Team,\n\n` +
    `Regarding Order #${orderId}:\n\n` +
    `Customer Name: ${customerName}\n` +
    `Customer Phone: ${customerPhone}\n` +
    `Delivery Address: ${customerAddress}\n\n` +
    `Items:\n${itemsSummary}\n\n` +
    `Total: PKR ${totalAmount.toLocaleString()}\n`
  );
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${BRAND_CONFIG.ordersEmail}&su=${subject}&body=${body}`;
}
