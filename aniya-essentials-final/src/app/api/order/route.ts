import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  sendEmailNotification,
  sendWhatsAppNotification,
  OrderItem,
  OrderData,
} from "@/lib/notifications";

interface OrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  channel?: "both" | "email" | "whatsapp";
}

export async function POST(req: Request) {
  try {
    const data: OrderRequest = await req.json();

    // Validation
    if (!data.customerName || !data.customerPhone || !data.customerAddress) {
      return NextResponse.json(
        { error: "Customer name, phone number, and delivery address are required." },
        { status: 400 }
      );
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one product." },
        { status: 400 }
      );
    }

    // Generate readable Order ID: AE-XXXX (e.g. AE-7419)
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const orderId = `AE-${randomId}`;
    const timestamp = new Date().toISOString();

    const orderRecord: OrderData & {
      status: string;
      paymentMethod: string;
      emailResult?: { success: boolean; status: string; error?: string };
      whatsappResult?: { success: boolean; status: string; error?: string };
    } = {
      orderId,
      timestamp,
      status: "Confirmed",
      paymentMethod: "Cash on Delivery",
      customer: {
        name: data.customerName.trim(),
        phone: data.customerPhone.trim(),
        email: data.customerEmail?.trim() || "",
        address: data.customerAddress.trim(),
      },
      items: data.items,
      subtotal: data.subtotal,
      shipping: data.shipping,
      total: data.total,
      channel: data.channel || "both",
    };

    // 1. Direct Email API dispatch (sends straight to aniyaessentials@gmail.com)
    const emailResult = await sendEmailNotification(orderRecord);
    orderRecord.emailResult = emailResult;

    // 2. Direct WhatsApp API dispatch (sends straight to +92 341 0701948)
    const whatsappResult = await sendWhatsAppNotification(orderRecord);
    orderRecord.whatsappResult = whatsappResult;

    // 3. Store order in local orders directory for permanent bookkeeping
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const ordersFilePath = path.join(dataDir, "orders.json");
    let orders: any[] = [];
    if (fs.existsSync(ordersFilePath)) {
      try {
        const fileContent = fs.readFileSync(ordersFilePath, "utf-8");
        orders = JSON.parse(fileContent);
      } catch {
        orders = [];
      }
    }

    orders.unshift(orderRecord);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");

    console.log(
      `[Aniya Essentials] Order #${orderId} confirmed for ${data.customerName} (PKR ${data.total}). Email: ${emailResult.status}, WhatsApp: ${whatsappResult.status}`
    );

    return NextResponse.json({
      success: true,
      orderId,
      message: `Your order is confirmed and will be delivered to your address. For any questions, please contact us on +92 313 5074177.`,
      emailSent: emailResult.success,
      emailStatus: emailResult.status,
      whatsappSent: whatsappResult.success,
      whatsappStatus: whatsappResult.status,
      order: orderRecord,
    });
  } catch (error: any) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { error: "Failed to process order. Please contact +92 341 0701948 directly." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const ordersFilePath = path.join(process.cwd(), "data", "orders.json");
    if (!fs.existsSync(ordersFilePath)) {
      return NextResponse.json({ orders: [] });
    }
    const fileContent = fs.readFileSync(ordersFilePath, "utf-8");
    const orders = JSON.parse(fileContent);
    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ orders: [], error: err.message });
  }
}
