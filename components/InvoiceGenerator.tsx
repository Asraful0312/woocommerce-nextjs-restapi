import jsPDF from "jspdf";
import "jspdf-autotable";

interface InvoiceGeneratorProps {
  order: any;
}

export const InvoiceGenerator = ({ order }: InvoiceGeneratorProps) => {
  const generateInvoice = () => {
    const doc = new jsPDF();

    // Add company logo (replace with your actual logo)
    // doc.addImage('/path/to/your/logo.png', 'PNG', 10, 10, 50, 20);

    // Add company info
    doc.setFontSize(10);
    doc.text("Your Company Name", 10, 40);
    doc.text("123 Company Street", 10, 45);
    doc.text("City, State 12345", 10, 50);
    doc.text("Phone: (123) 456-7890", 10, 55);

    // Add invoice title
    doc.setFontSize(18);
    doc.text("Invoice", 150, 20);

    // Add order details
    doc.setFontSize(10);
    doc.text(`Order Number: ${order.order_id}`, 150, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 35);

    // Add billing info
    doc.setFontSize(12);
    doc.text("Bill To:", 10, 70);
    doc.setFontSize(10);
    doc.text(order.name, 10, 75);
    doc.text(order.billing.address_1, 10, 80);
    doc.text(order.billing.email, 10, 85);
    doc.text(order.billing.phone, 10, 90);

    // Add table
    const tableColumn = ["Item", "Price"];
    const tableRows = [["Order Total", order.price, order.currency_symbol]];
    (doc as any).autoTable({
      startY: 100,
      head: [tableColumn],
      body: tableRows,
    });

    // Add total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(
      `Total: ${(order.price, order.currency_symbol)}`,
      140,
      finalY + 10
    );

    // Save the PDF
    doc.save(`Invoice-${order.order_id}.pdf`);
  };

  return generateInvoice;
};
