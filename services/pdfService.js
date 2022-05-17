const pdf = require("pdfkit");
const fs = require("fs");
function buildPDF(order, dataCallback, endCallback) {
  
  const doc = new pdf();
  doc.on("data", dataCallback);
  doc.on("end", endCallback);
  generateHeader(doc);
  generateCustomerInformation(doc, order);
  generateInvoiceTable(doc, order);
  generateFooter(doc);
 
  doc.end();
}
function generateHeader(doc) {
  doc
    .text("Artofia", 60, 57, { align: "left" })
    .fontSize(10)
    .text("WWW.artofia.com", 200, 65, { align: "right" })
    .text("Kochi,kerala,23487", 200, 80, { align: "right" })
    .moveDown();
}

function generateFooter(doc) {
  doc.fontSize(10).text("Thank you for your business.", 50, 980, {
    align: "center",
    width: 500,
  });
}
function generateCustomerInformation(doc, invoice) {
  doc
    .text(`Invoice Number: ${invoice._id}`, 50, 200)
    .text(`Invoice Date: ${new Date()}`, 50, 215)
    .text(invoice.eventName, 300, 200)
    .moveDown();
}
function generateTableRow(doc, y, c1, c2, c3, c4, c5,c6) {
  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 150, y)
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" })
    .text(c4, 400, y, { align: "right" })
    .moveDown()
    .text (c6, 500, y+90, { align: "right" })
}
function generateInvoiceTable(doc, invoice) {
  generateTableRow(
    doc,
    110,
    invoice.orderItem.eventName,
    invoice.orderItem.eventBrief,
    invoice.orderItem.eventDate,
    1,
    invoice.orderItem.eventAddress,
    `Price: ${invoice.amount}`
  );
}
module.exports = { buildPDF };
