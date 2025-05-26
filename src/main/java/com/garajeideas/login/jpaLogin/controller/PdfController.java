package com.garajeideas.login.jpaLogin.controller;

import com.garajeideas.login.jpaLogin.entity.Pedido;
import com.garajeideas.login.jpaLogin.repository.PedidoRepository;
import com.garajeideas.login.jpaLogin.service.EmailService;
import com.garajeideas.login.jpaLogin.service.ReciboPdf.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/public/pdf")
public class PdfController {

    private final PedidoRepository pedidoRepository;
    private final PdfService pdfService;
    private final EmailService emailService;

    public PdfController(PedidoRepository pedidoRepository, PdfService pdfService, EmailService emailService) {
        this.pedidoRepository = pedidoRepository;
        this.pdfService = pdfService;
        this.emailService = emailService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> generarYEnviarPdf(@PathVariable Long id) {
        Optional<Pedido> pedidoOptional = pedidoRepository.findById(id);
        if (pedidoOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Pedido pedido = pedidoOptional.get();
        byte[] pdfBytes = pdfService.generarReciboPdf(pedido);

        // Enviar por correo
        emailService.enviarReciboPorCorreo(pedido.getEmail(), pdfBytes, pedido.getNombreCliente());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=recibo_" + pedido.getNombreCliente() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
