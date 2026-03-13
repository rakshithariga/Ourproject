import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BillEmailRequest {
  email: string;
  billNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  gst: number;
  total: number;
  paymentMethod: string;
  date: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: BillEmailRequest = await req.json();
    const { email, billNumber, items, subtotal, gst, total, paymentMethod, date } = data;

    // Generate items HTML
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">Rs. ${item.price}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">Rs. ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #34D399, #10B981); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">SMART BAZAAR</h1>
            <p style="color: #ffffff; margin: 8px 0 0 0; opacity: 0.9;">Your Smart Shopping Assistant</p>
          </div>
          
          <!-- Bill Details -->
          <div style="padding: 30px;">
            <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #065f46; margin: 0 0 15px 0; font-size: 20px;">🧾 Your Bill Receipt</h2>
              <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                <div>
                  <p style="color: #6b7280; margin: 0; font-size: 12px;">Bill Number</p>
                  <p style="color: #1f2937; margin: 4px 0 0 0; font-weight: 600;">${billNumber}</p>
                </div>
                <div>
                  <p style="color: #6b7280; margin: 0; font-size: 12px;">Date</p>
                  <p style="color: #1f2937; margin: 4px 0 0 0; font-weight: 600;">${date}</p>
                </div>
                <div>
                  <p style="color: #6b7280; margin: 0; font-size: 12px;">Payment Method</p>
                  <p style="color: #1f2937; margin: 4px 0 0 0; font-weight: 600;">${paymentMethod}</p>
                </div>
              </div>
            </div>
            
            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="background-color: #f9fafb;">
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Item</th>
                  <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151;">Qty</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Price</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <!-- Totals -->
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #6b7280;">Subtotal</span>
                <span style="color: #1f2937;">Rs. ${subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #6b7280;">GST (5%)</span>
                <span style="color: #1f2937;">Rs. ${gst.toFixed(2)}</span>
              </div>
              <div style="height: 1px; background-color: #e5e7eb; margin: 15px 0;"></div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #1f2937; font-weight: 700; font-size: 18px;">Total</span>
                <span style="color: #059669; font-weight: 700; font-size: 18px;">Rs. ${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #059669; margin: 0 0 8px 0; font-weight: 600;">Thank you for shopping with Smart Bazaar! 🙏</p>
            <p style="color: #6b7280; margin: 0; font-size: 13px;">Visit again soon | www.smartbazaar.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Smart Bazaar <onboarding@resend.dev>",
      to: [email],
      subject: `Your Smart Bazaar Bill - ${billNumber}`,
      html: emailHtml,
    });

    console.log("Bill email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-bill-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
