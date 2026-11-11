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
  paymentMethod?: string;
  paymentReference?: string;
  senderName?: string;
  receiptImage?: string;
  courier?: string;
  trackingNumber?: string;
  city?: string;
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
 * DIRECT EMAIL NOTIFICATION
 * Dispatches order details to aniyaessentials@gmail.com via FormSubmit.co
 * and falls back to Gmail SMTP if configured.
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

  const paymentInfo = order.paymentMethod || "Cash on Delivery (COD)";
  const isBankOrWallet =
    paymentInfo.includes("Bank") ||
    paymentInfo.includes("UBL") ||
    paymentInfo.includes("Easypaisa") ||
    paymentInfo.includes("JazzCash");

  const refDetails = [
    order.paymentReference ? `Transaction ID (TID): ${order.paymentReference}` : "",
    order.senderName ? `Sender Account / Name: ${order.senderName}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  let formSubmitSent = false;

  // 1. Send via FormSubmit HTTP Gateway directly to aniyaessentials@gmail.com
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
        _subject: isBankOrWallet
          ? `🚨 [DIRECT BANK/WALLET PAYMENT] New Order #${order.orderId} from ${order.customer.name} (PKR ${order.total.toLocaleString()})`
          : `📦 [COD ORDER] New Order #${order.orderId} from ${order.customer.name} (PKR ${order.total.toLocaleString()})`,
        _template: "table",
        "Order ID": `#${order.orderId}`,
        "Courier Service": `${order.courier || "TCS Express"} (CN: ${order.trackingNumber || "Pending"})`,
        "Payment Method": paymentInfo,
        "Transaction / Sender Details": refDetails || "Cash on Delivery (Pay at Doorstep)",
        "Customer Name": order.customer.name,
        "Customer Phone": order.customer.phone,
        "Customer Delivery Address": order.customer.address,
        "Customer Email": order.customer.email || "Not provided",
        "Items Ordered": itemsText,
        "Subtotal": `PKR ${order.subtotal.toLocaleString()}`,
        "Delivery Fee": order.shipping === 0 ? "FREE" : `PKR ${order.shipping.toLocaleString()}`,
        "Total Payable": `PKR ${order.total.toLocaleString()}`,
        "Verification Note": isBankOrWallet
          ? "Customer chose Direct Payment. Check your UBL / Mobile account for this Transaction ID / Sender Name before dispatching."
          : "Collect Cash on Delivery upon parcel delivery.",
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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #faf8f5; border: 1px solid #e5ded3; border-radius: 12px; color: #182b1d;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1.5px solid #ae5d2e;">
            <h1 style="margin: 0; color: #182b1d; font-size: 26px; letter-spacing: 2px;">ANIYA ESSENTIALS</h1>
            <p style="margin: 4px 0 0; color: #ae5d2e; font-size: 13px; text-transform: uppercase; letter-spacing: 3px;">
              ${isBankOrWallet ? "Advance Payment Order" : "New Customer Order"}
            </p>
          </div>

          <div style="margin-top: 20px; background-color: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid #e5ded3;">
            <h2 style="margin: 0 0 12px; font-size: 18px; color: #182b1d;">Order #${order.orderId}</h2>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Payment Method:</strong> ${paymentInfo}</p>
            ${refDetails ? `<p style="margin: 4px 0; font-size: 14px; color: #ae5d2e;"><strong>Verification Info:</strong> ${refDetails}</p>` : ""}
            <p style="margin: 4px 0; font-size: 14px;"><strong>Courier Partner:</strong> ${order.courier || "TCS Express"} (Tracking: ${order.trackingNumber || "Pending"})</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Customer:</strong> ${order.customer.name}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Phone:</strong> <a href="tel:${order.customer.phone}" style="color: #ae5d2e;">${order.customer.phone}</a></p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Address:</strong> ${order.customer.address}</p>
          </div>

          <div style="margin-top: 20px; background-color: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid #e5ded3;">
            <h3 style="margin: 0 0 12px; font-size: 15px; color: #182b1d; text-transform: uppercase; letter-spacing: 1px;">Items Ordered</h3>
            <pre style="white-space: pre-wrap; font-family: inherit; font-size: 14px; color: #35452e; line-height: 1.6; margin: 0;">${itemsText}</pre>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td>Subtotal</td>
                <td style="text-align: right;">PKR ${order.subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td style="text-align: right;">${order.shipping === 0 ? "FREE" : `PKR ${order.shipping.toLocaleString()}`}</td>
              </tr>
              <tr style="font-size: 16px; font-weight: bold; color: #ae5d2e;">
                <td style="padding-top: 8px;">Total Payable</td>
                <td style="text-align: right; padding-top: 8px;">PKR ${order.total.toLocaleString()}</td>
              </tr>
            </table>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Aniya Essentials Orders" <${user}>`,
        to: recipientEmail,
        subject: `New Order #${order.orderId} from ${order.customer.name} (PKR ${order.total.toLocaleString()}) - ${paymentInfo}`,
        text: `New Order #${order.orderId}\nCustomer: ${order.customer.name} (${order.customer.phone})\nAddress: ${order.customer.address}\nPayment: ${paymentInfo}\n${refDetails}\nTotal: PKR ${order.total.toLocaleString()}\n\nItems:\n${itemsText}`,
        html: emailHtml,
      });

      return { success: true, status: "Sent via Gmail SMTP" };
    } catch (smtpErr: any) {
      console.error("[Email API] SMTP Error:", smtpErr.message);
      return formSubmitSent
        ? { success: true, status: "Sent via FormSubmit Gateway" }
        : { success: false, status: "Failed", error: smtpErr.message };
    }
  }

  return formSubmitSent
    ? { success: true, status: "Sent via FormSubmit Gateway" }
    : { success: false, status: "Failed to dispatch email" };
}
