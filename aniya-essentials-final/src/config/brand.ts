/**
 * Aniya Essentials — Official Brand & Order Configuration
 */
export const BRAND_CONFIG = {
  name: "Aniya Essentials",
  tagline: "Care for your hair, naturally.",

  // Official Business & Order Phone / WhatsApp Number
  whatsappNumber: "923135074177",
  whatsappDisplay: "+92 313 5074177",
  contactPhone: "+92 313 5074177",

  // Official Orders Gmail
  ordersEmail: "aniyaessentials@gmail.com",

  currency: "PKR",
  freeShippingThreshold: 2500,
  standardShippingFee: 200,
  deliveryWindow: "2–4 business days",
  paymentMethod: "Cash on Delivery (COD)",
  location: "Pakistan",
};

/**
 * Helper to generate direct WhatsApp chat links to +92 341 0701948
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
  const subject = encodeURIComponent(`[New Order #${orderId}] ${customerName} - PKR ${totalAmount.toLocaleString()}`);
  const body = encodeURIComponent(
    `Hello Aniya Essentials Team,\n\n` +
    `A new order has been placed on the website:\n\n` +
    `Order ID: #${orderId}\n` +
    `Customer Name: ${customerName}\n` +
    `Customer Phone: ${customerPhone}\n` +
    `Delivery Address: ${customerAddress}\n\n` +
    `Ordered Items:\n${itemsSummary}\n\n` +
    `Total Amount: PKR ${totalAmount.toLocaleString()} (Cash on Delivery)\n\n` +
    `Customer Support / Helpline: ${BRAND_CONFIG.contactPhone}\n`
  );

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${BRAND_CONFIG.ordersEmail}&su=${subject}&body=${body}`;
}
