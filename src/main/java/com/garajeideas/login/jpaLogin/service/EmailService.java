package com.garajeideas.login.jpaLogin.service;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarReciboPorCorreo(String to, byte[] pdfBytes, String nombreCliente) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Recibo de Pedido para " + nombreCliente);
            helper.setText("Adjunto encontrarás tu recibo en PDF. ¡Gracias por tu compra, " + nombreCliente + "!");

            InputStreamSource attachment = new ByteArrayResource(pdfBytes);
            String sanitizedNombre = nombreCliente.replaceAll("[^a-zA-Z0-9]", "_"); // quitar caracteres especiales
            helper.addAttachment("recibo_" + sanitizedNombre + ".pdf", attachment);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage(), e);
        }
    }

}
