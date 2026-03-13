import { jsPDF } from 'jspdf';
import { CartItem } from '@/context/CartContext';

interface BillData {
  items: CartItem[];
  subtotal: number;
  gst: number;
  total: number;
  email: string;
  billNumber?: string;
  paymentMethod?: string;
}

export const generateBillPDF = (data: BillData): void => {
  const { items, subtotal, gst, total, email, billNumber: providedBillNumber, paymentMethod = 'Card' } = data;
  const doc = new jsPDF();
  
  const billNumber = providedBillNumber || `SB${Date.now().toString().slice(-8)}`;
  const date = new Date().toLocaleDateString('en-IN');
  const time = new Date().toLocaleTimeString('en-IN');
  
  // Colors
  const primaryColor: [number, number, number] = [52, 211, 153]; // Mint green
  const darkColor: [number, number, number] = [30, 41, 59];
  
  // Header background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 45, 'F');
  
  // Store name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('SMART BAZAAR', 105, 22, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Smart Shopping Assistant', 105, 32, { align: 'center' });
  
  // Bill details section
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  
  // Left side - Bill info
  doc.setFont('helvetica', 'bold');
  doc.text('Bill No:', 20, 55);
  doc.text('Date:', 20, 62);
  doc.text('Time:', 20, 69);
  doc.text('Payment:', 20, 76);
  
  doc.setFont('helvetica', 'normal');
  doc.text(billNumber, 50, 55);
  doc.text(date, 50, 62);
  doc.text(time, 50, 69);
  doc.text(paymentMethod, 50, 76);
  
  // Right side - Customer info
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Email:', 120, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(email, 155, 55);
  
  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 82, 190, 82);
  
  // Table header
  doc.setFillColor(245, 245, 245);
  doc.rect(20, 86, 170, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Item', 25, 93);
  doc.text('Qty', 110, 93);
  doc.text('Price', 135, 93);
  doc.text('Total', 165, 93);
  
  // Table content
  doc.setFont('helvetica', 'normal');
  let yPos = 104;
  
  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    
    // Wrap long item names
    const name = item.name.length > 35 ? item.name.substring(0, 35) + '...' : item.name;
    
    doc.text(name, 25, yPos);
    doc.text(item.quantity.toString(), 115, yPos);
    doc.text(`Rs. ${item.price}`, 135, yPos);
    doc.text(`Rs. ${itemTotal}`, 165, yPos);
    
    yPos += 8;
  });
  
  // Divider before totals
  yPos += 5;
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Totals section
  doc.setFontSize(11);
  
  // Subtotal
  doc.text('Subtotal:', 130, yPos);
  doc.text(`Rs. ${subtotal.toFixed(2)}`, 165, yPos);
  yPos += 8;
  
  // GST
  doc.text('GST (5%):', 130, yPos);
  doc.text(`Rs. ${gst.toFixed(2)}`, 165, yPos);
  yPos += 8;
  
  // Divider
  doc.line(130, yPos, 190, yPos);
  yPos += 8;
  
  // Grand total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TOTAL:', 130, yPos);
  doc.text(`Rs. ${total.toFixed(2)}`, 165, yPos);
  
  // Footer section
  yPos = 250;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.line(20, yPos, 190, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for shopping with Smart Bazaar!', 105, yPos, { align: 'center' });
  
  yPos += 7;
  doc.setFontSize(8);
  doc.text('Visit again soon | www.smartbazaar.com | support@smartbazaar.com', 105, yPos, { align: 'center' });
  
  // Save the PDF
  doc.save(`SmartBazaar-Bill-${billNumber}.pdf`);
};

export const generateWhatsAppMessage = (data: BillData): string => {
  const { items, total, email } = data;
  const billNumber = `SB${Date.now().toString().slice(-8)}`;
  const date = new Date().toLocaleDateString('en-IN');
  
  let message = `🛒 *SMART BAZAAR* - Bill Receipt\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📋 Bill No: ${billNumber}\n`;
  message += `📅 Date: ${date}\n`;
  message += `📧 Email: ${email}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `*Items Purchased:*\n`;
  
  items.forEach((item) => {
    message += `• ${item.name} x${item.quantity} - Rs. ${item.price * item.quantity}\n`;
  });
  
  message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *Total: Rs. ${total.toFixed(2)}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `Thank you for shopping with us! 🙏\n`;
  message += `Visit again soon at Smart Bazaar`;
  
  return encodeURIComponent(message);
};
