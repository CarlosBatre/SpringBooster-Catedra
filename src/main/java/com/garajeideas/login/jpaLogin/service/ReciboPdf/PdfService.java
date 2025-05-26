package com.garajeideas.login.jpaLogin.service.ReciboPdf;

import com.garajeideas.login.jpaLogin.entity.DetallePedido;
import com.garajeideas.login.jpaLogin.entity.Pedido;
import com.garajeideas.login.jpaLogin.repository.DetallePedidoRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.borders.SolidBorder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfService {

    private static DetallePedidoRepository detallePedidoRepository;

    public PdfService(DetallePedidoRepository detallePedidoRepository) {
        this.detallePedidoRepository = detallePedidoRepository;
    }

    public static byte[] generarReciboPdf(Pedido pedido) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Título
        Paragraph title = new Paragraph("RECIBO DE PEDIDO")
                .setFontSize(20)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(title);

        // Tabla de información del pedido (2 columnas)
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                .useAllAvailableWidth()
                .setBorder(new SolidBorder(ColorConstants.BLACK, 1))
                .setMarginBottom(20);

        addRow(infoTable, "Cliente:", pedido.getNombreCliente());
        addRow(infoTable, "Dirección:", pedido.getDireccion());
        addRow(infoTable, "Email:", pedido.getEmail());
        addRow(infoTable, "Teléfono:", pedido.getTelefono());
        addRow(infoTable, "Método de Pago:", pedido.getMetodoPago());
        addRow(infoTable, "Estado:", pedido.getEstado());
        addRow(infoTable, "Fecha del Pedido:", pedido.getFechaPedido().toString());

        document.add(infoTable);

        // Título para detalles
        document.add(new Paragraph("DETALLES DEL PEDIDO")
                .setBold()
                .setFontSize(16)
                .setMarginBottom(10));

        // Tabla de detalles de productos
        Table detalleTable = new Table(UnitValue.createPercentArray(new float[]{4, 1, 2, 2}))
                .useAllAvailableWidth()
                .setBorder(new SolidBorder(ColorConstants.BLACK, 1));

        detalleTable.addHeaderCell(new Cell().add(new Paragraph("Producto").setBold()));
        detalleTable.addHeaderCell(new Cell().add(new Paragraph("Cant.").setBold()));
        detalleTable.addHeaderCell(new Cell().add(new Paragraph("Precio Unit.").setBold()));
        detalleTable.addHeaderCell(new Cell().add(new Paragraph("Subtotal").setBold()));

        List<DetallePedido> detalles = detallePedidoRepository.findByPedido(pedido);
        for (DetallePedido detalle : detalles) {
            detalleTable.addCell(new Cell().add(new Paragraph(detalle.getProducto().getNombre())));
            detalleTable.addCell(new Cell().add(new Paragraph(String.valueOf(detalle.getCantidad()))));
            detalleTable.addCell(new Cell().add(new Paragraph(String.format("$%.2f", detalle.getPrecioUnitario()))));
            double subtotal = detalle.getCantidad() * detalle.getPrecioUnitario();
            detalleTable.addCell(new Cell().add(new Paragraph(String.format("$%.2f", subtotal))));
        }

        document.add(detalleTable);
        document.close();
        return baos.toByteArray();
    }

    // Metodo auxiliar para agregar filas a la tabla de info
    private static void addRow(Table table, String campo, String valor) {
        table.addCell(new Cell().add(new Paragraph(campo).setBold())
                .setBorder(new SolidBorder(ColorConstants.BLACK, 0.5f)));
        table.addCell(new Cell().add(new Paragraph(valor))
                .setBorder(new SolidBorder(ColorConstants.BLACK, 0.5f)));
    }
}


