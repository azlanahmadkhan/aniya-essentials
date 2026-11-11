import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  sendEmailNotification,
  OrderItem,
  OrderData,
} from "@/lib/notifications";

interface OrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  city?: string;
  apartment?: string;
  postalCode?: string;
  paymentMethod?: string; // "cod" | "easypaisa_jazzcash" | "bank_deposit"
  paymentReference?: string; // Transaction ID / TID
  senderName?: string; // Name on sender bank account
  receiptImage?: string; // Base64 payment receipt screenshot
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

function getOrdersFilePath(): string {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, "orders.json");
}

function readOrders(): any[] {
  try {
    const filePath = getOrdersFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Failed to read orders:", err);
  }
  return [];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")?.trim().toUpperCase();
  const phone = searchParams.get("phone")?.trim();

  const orders = readOrders();

  if (id) {
    const found = orders.find(
      (o) =>
        o.orderId?.toUpperCase() === id ||
        o.orderId?.toUpperCase() === `AE-${id}` ||
        o.trackingNumber?.toUpperCase() === id
    );

    if (found) {
      return NextResponse.json({
        found: true,
        order: {
          orderId: found.orderId,
          status: found.status || "Confirmed & In Preparation",
          courier: found.courier || "TCS Express",
          trackingNumber: found.trackingNumber || `TCS-${found.orderId.replace(/[^0-9]/g, "")}91`,
          customerName: found.customer?.name,
          city: found.city || "Pakistan",
          paymentMethod: found.paymentMethod,
          items: found.items,
          total: found.total,
          timestamp: found.timestamp,
        },
      });
    }

    return NextResponse.json(
      { found: false, error: "Order not found. Please verify your Order ID." },
      { status: 404 }
    );
  }

  if (phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const matching = orders.filter((o) =>
      o.customer?.phone?.replace(/[^0-9]/g, "").includes(cleanPhone)
    );
    return NextResponse.json({ orders: matching });
  }

  return NextResponse.json({ orders: orders.slice(0, 50) });
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

    const formattedPaymentMethod =
      data.paymentMethod === "easypaisa_jazzcash"
        ? "Easypaisa / JazzCash"
        : data.paymentMethod === "bank_deposit"
        ? "UBL Bank Deposit / Transfer"
        : "Cash on Delivery (COD)";

    const fullAddress = [
      data.customerAddress,
      data.apartment,
      data.city,
      data.postalCode,
      "Pakistan",
    ]
      .filter(Boolean)
      .join(", ");

    // Generate default TCS tracking consignment number
    const tcsTrackingNumber = `${Math.floor(100000000 + Math.random() * 900000000)}`;

    const orderRecord: OrderData & {
      status: string;
      courier: string;
      trackingNumber: string;
      paymentMethod: string;
      paymentReference?: string;
      senderName?: string;
      receiptImage?: string;
      city?: string;
      emailResult?: { success: boolean; status: string; error?: string };
    } = {
      orderId,
      timestamp,
      status: "Confirmed & In Preparation",
      courier: "TCS Express",
      trackingNumber: tcsTrackingNumber,
      paymentMethod: formattedPaymentMethod,
      paymentReference: data.paymentReference || "",
      senderName: data.senderName || "",
      receiptImage: data.receiptImage || "",
      city: data.city || "Pakistan",
      customer: {
        name: data.customerName.trim(),
        phone: data.customerPhone.trim(),
        email: data.customerEmail?.trim() || "",
        address: fullAddress,
      },
      items: data.items,
      subtotal: data.subtotal,
      shipping: data.shipping,
      total: data.total,
      channel: "email",
    };

    // 1. Send Direct Email Notification to aniyaessentials@gmail.com
    const emailResult = await sendEmailNotification(orderRecord);
    orderRecord.emailResult = emailResult;

    // 2. Save order to data/orders.json
    const ordersFilePath = getOrdersFilePath();
    let orders = readOrders();
    orders.unshift(orderRecord);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");

    console.log(
      `[Aniya Essentials] Order #${orderId} placed by ${data.customerName} (PKR ${data.total}). Payment: ${formattedPaymentMethod}. TCS CN: ${tcsTrackingNumber}`
    );

    return NextResponse.json({
      success: true,
      orderId,
      trackingNumber: tcsTrackingNumber,
      courier: "TCS Express",
      total: data.total,
      paymentMethod: formattedPaymentMethod,
      timestamp,
      message: `Your order #${orderId} has been confirmed and will be dispatched via TCS Express.`,
    });
  } catch (err: any) {
    console.error("Order processing error:", err);
    return NextResponse.json(
      { error: "Failed to process order. Please try again." },
      { status: 500 }
    );
  }
}
