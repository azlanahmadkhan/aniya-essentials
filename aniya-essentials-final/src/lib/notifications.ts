import nodemailer from "nodemailer";

export interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface OrderData {
  orderId: string;
  timestamp: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  channel?: "both" | "email" | "whatsapp";
}

/**
 * DIRECT EMAIL API NOTIFICATION
 * Dispatches order details to aniyaessentials@gmail.com.
 * Uses FormSubmit.co HTTP Gateway (100% free, no password required)
 * and falls back to Gmail SMTP if GMAIL_APP_PASSWORD is provided.
 */
export async function sendEmailNotification(order: OrderData): Promise<{
  success: boolean;
  status: string;
  error?: string;
}> {
  const recipientEmail = "aniyaessentials@gmail.com";
  const user = process.env.EMAIL_SERVER_USER || process.env.GMAIL_USER || recipientEmail;
  const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.GMAIL_APP_PASSWORD;

  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.name} (${item.size}) - PKR ${(
          item.price * item.quantity
        ).toLocaleString()}`
    )
    .join("\n");

  let formSubmitSent = false;

  // 1. Send via FormSubmit HTTP Gateway directly to aniyaessentials@gmail.com (No password needed!)
  try {
    const fsRes = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Referer: "http://localhost:3000",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify({
        _subject: `New Order #${order.orderId} from ${order.customer.name} (PKR ${order.total.toLocaleString()})`,
        _template: "table",
        "Order ID": `#${order.orderId}`,
        "Order Date": new Date(order.timestamp).toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
        "Customer Name": order.customer.name,
        "Customer Phone": order.customer.phone,
        "Customer Address": order.customer.address,
        "Customer Email": order.customer.email || "Not provided",
        "Items Ordered": itemsText,
        "Subtotal": `PKR ${order.subtotal.toLocaleString()}`,
        "Delivery Fee": order.shipping === 0 ? "FREE" : `PKR ${order.shipping.toLocaleString()}`,
        "Total Payable": `PKR ${order.total.toLocaleString()} (Cash on Delivery)`,
      }),
    });

    const fsData = await fsRes.json();
    console.log("[Email API] FormSubmit response:", fsData);
    if (fsData.success === true || fsData.success === "true") {
      formSubmitSent = true;
    }
  } catch (err: any) {
    console.error("[Email API] FormSubmit error:", err.message);
  }

  // 2. If user has also provided GMAIL_APP_PASSWORD, send via Gmail SMTP
  if (user && pass && pass.trim().length > 0) {
    try {
      const cleanPass = pass.replace(/\s+/g, "");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: user.trim(),
          pass: cleanPass,
        },
      });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #d5ddc9;">
          <div style="background: #182b1d; padding: 24px; text-align: center; color: #f6f2e9;">
            <h1 style="margin: 0; font-size: 22px; letter-spacing: 0.15em;">ANIYA ESSENTIALS</h1>
            <p style="margin: 4px 0 0 0; color: #aab79a; font-size: 11px; letter-spacing: 0.2em;">NEW ORDER #${order.orderId}</p>
          </div>
          <div style="padding: 24px; color: #182b1d;">
            <p><strong>Customer:</strong> ${order.customer.name}</p>
            <p><strong>Phone:</strong> <a href="tel:${order.customer.phone}">${order.customer.phone}</a></p>
            <p><strong>Address:</strong> ${order.customer.address}</p>
            <p><strong>Email:</strong> ${order.customer.email || "N/A"}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 16px 0;" />
            <h3 style="margin-bottom: 8px;">Items Ordered:</h3>
            <pre style="font-family: inherit; background: #f6f2e9; padding: 12px; border-radius: 6px;">${itemsText}</pre>
            <p style="font-size: 16px; font-weight: bold; color: #ae5d2e;">Total: PKR ${order.total.toLocaleString()} (Cash on Delivery)</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Aniya Essentials Orders" <${user.trim()}>`,
        to: recipientEmail,
        subject: `New Order #${order.orderId} from ${order.customer.name} (PKR ${order.total.toLocaleString()})`,
        text: `New Order #${order.orderId}\nCustomer: ${order.customer.name}\nPhone: ${order.customer.phone}\nAddress: ${order.customer.address}\n\nItems:\n${itemsText}\n\nTotal: PKR ${order.total.toLocaleString()}`,
        html: emailHtml,
      });

      console.log(`[Email API] Sent order email via Gmail SMTP to ${recipientEmail}`);
      return { success: true, status: "sent_via_gmail_smtp" };
    } catch (err: any) {
      console.error("[Email API] SMTP error:", err.message);
    }
  }

  if (formSubmitSent) {
    return { success: true, status: "sent_via_formsubmit" };
  }

  return { success: true, status: "logged_ready_for_credentials" };
}

/**
 * DIRECT WHATSAPP NOTIFICATION HELPER
 * Owner Phone: +92 313 5074177
 */
export async function sendWhatsAppNotification(order: OrderData): Promise<{
  success: boolean;
  status: string;
  error?: string;
}> {
  const ownerPhone = process.env.WHATSAPP_OWNER_NUMBER || "923135074177";
  const itemsText = order.items
    .map(
      (item) =>
        `  • ${item.quantity}x ${item.name} (${item.size}) - PKR ${(
          item.price * item.quantity
        ).toLocaleString()}`
    )
    .join("\n");

  const messageText = 
    `*NEW ORDER RECEIVED — ANIYA ESSENTIALS*\n` +
    `--------------------------------------\n` +
    `*Order ID:* #${order.orderId}\n` +
    `*Customer:* ${order.customer.name}\n` +
    `*Phone:* ${order.customer.phone}\n` +
    `*Address:* ${order.customer.address}\n` +
    `*Email:* ${order.customer.email || "Not provided"}\n\n` +
    `*Items Ordered:*\n${itemsText}\n\n` +
    `*Subtotal:* PKR ${order.subtotal.toLocaleString()}\n` +
    `*Delivery:* ${order.shipping === 0 ? "FREE" : `PKR ${order.shipping.toLocaleString()}`}\n` +
    `*Total Payable:* PKR ${order.total.toLocaleString()} (Cash on Delivery)\n` +
    `--------------------------------------\n` +
    `Reply to customer: https://wa.me/${order.customer.phone.replace(/[^0-9]/g, "")}`;

  // CallMeBot API (free WhatsApp gateway)
  const callMeBotApiKey = process.env.CALLMEBOT_API_KEY;
  if (callMeBotApiKey) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${ownerPhone}&text=${encodeURIComponent(
        messageText
      )}&apikey=${callMeBotApiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        console.log(`[WhatsApp API] Order #${order.orderId} delivered to ${ownerPhone} via CallMeBot`);
        return { success: true, status: "sent_via_callmebot" };
      }
    } catch (err: any) {
      console.error("[WhatsApp API] CallMeBot error:", err.message);
    }
  }

  // Webhook Gateway (optional)
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: ownerPhone,
          message: messageText,
          orderId: order.orderId,
          order,
        }),
      });
      if (res.ok) {
        return { success: true, status: "sent_via_webhook" };
      }
    } catch (err: any) {
      console.error("[WhatsApp API] Webhook error:", err.message);
    }
  }

  console.log(`[WhatsApp API] Message ready for ${ownerPhone}`);
  return { success: true, status: "logged_ready_for_gateway" };
}
