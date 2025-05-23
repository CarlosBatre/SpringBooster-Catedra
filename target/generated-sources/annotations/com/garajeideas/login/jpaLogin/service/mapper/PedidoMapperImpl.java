package com.garajeideas.login.jpaLogin.service.mapper;

import com.garajeideas.login.jpaLogin.controller.request.PedidoRequest;
import com.garajeideas.login.jpaLogin.controller.response.PedidoResponse;
import com.garajeideas.login.jpaLogin.entity.DetallePedido;
import com.garajeideas.login.jpaLogin.entity.Pedido;
import com.garajeideas.login.jpaLogin.entity.Producto;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-23T00:23:32-0600",
    comments = "version: 1.6.2, compiler: javac, environment: Java 17.0.14 (Azul Systems, Inc.)"
)
@Component
public class PedidoMapperImpl implements PedidoMapper {

    @Override
    public Pedido toPedido(PedidoRequest pedidoRequest) {
        if ( pedidoRequest == null ) {
            return null;
        }

        Pedido.PedidoBuilder pedido = Pedido.builder();

        pedido.nombreCliente( pedidoRequest.getNombreCliente() );
        pedido.direccion( pedidoRequest.getDireccion() );
        pedido.email( pedidoRequest.getEmail() );
        pedido.telefono( pedidoRequest.getTelefono() );
        pedido.metodoPago( pedidoRequest.getMetodoPago() );

        return pedido.build();
    }

    @Override
    public DetallePedido toDetallePedido(PedidoRequest.ProductoPedido productoPedido) {
        if ( productoPedido == null ) {
            return null;
        }

        DetallePedido.DetallePedidoBuilder detallePedido = DetallePedido.builder();

        detallePedido.producto( productoPedidoToProducto( productoPedido ) );
        detallePedido.cantidad( productoPedido.getCantidad() );

        return detallePedido.build();
    }

    @Override
    public PedidoResponse toPedidoResponse(Pedido pedido) {
        if ( pedido == null ) {
            return null;
        }

        PedidoResponse.PedidoResponseBuilder pedidoResponse = PedidoResponse.builder();

        pedidoResponse.detalles( toDetallePedidoResponseList( pedido.getDetalles() ) );
        pedidoResponse.id( pedido.getId() );
        pedidoResponse.nombreCliente( pedido.getNombreCliente() );
        pedidoResponse.direccion( pedido.getDireccion() );
        pedidoResponse.email( pedido.getEmail() );
        pedidoResponse.telefono( pedido.getTelefono() );
        pedidoResponse.metodoPago( pedido.getMetodoPago() );
        pedidoResponse.estado( pedido.getEstado() );
        pedidoResponse.fechaPedido( pedido.getFechaPedido() );
        pedidoResponse.total( pedido.getTotal() );

        return pedidoResponse.build();
    }

    @Override
    public List<PedidoResponse.DetallePedidoResponse> toDetallePedidoResponseList(List<DetallePedido> detalles) {
        if ( detalles == null ) {
            return null;
        }

        List<PedidoResponse.DetallePedidoResponse> list = new ArrayList<PedidoResponse.DetallePedidoResponse>( detalles.size() );
        for ( DetallePedido detallePedido : detalles ) {
            list.add( toDetallePedidoResponse( detallePedido ) );
        }

        return list;
    }

    @Override
    public PedidoResponse.DetallePedidoResponse toDetallePedidoResponse(DetallePedido detallePedido) {
        if ( detallePedido == null ) {
            return null;
        }

        PedidoResponse.DetallePedidoResponse.DetallePedidoResponseBuilder detallePedidoResponse = PedidoResponse.DetallePedidoResponse.builder();

        detallePedidoResponse.productoId( detallePedidoProductoId( detallePedido ) );
        detallePedidoResponse.nombreProducto( detallePedidoProductoNombre( detallePedido ) );
        detallePedidoResponse.id( detallePedido.getId() );
        detallePedidoResponse.imagen( detallePedido.getImagen() );
        detallePedidoResponse.cantidad( detallePedido.getCantidad() );
        detallePedidoResponse.precioUnitario( detallePedido.getPrecioUnitario() );

        return detallePedidoResponse.build();
    }

    protected Producto productoPedidoToProducto(PedidoRequest.ProductoPedido productoPedido) {
        if ( productoPedido == null ) {
            return null;
        }

        Producto.ProductoBuilder producto = Producto.builder();

        producto.id( productoPedido.getProductoId() );

        return producto.build();
    }

    private Long detallePedidoProductoId(DetallePedido detallePedido) {
        Producto producto = detallePedido.getProducto();
        if ( producto == null ) {
            return null;
        }
        return producto.getId();
    }

    private String detallePedidoProductoNombre(DetallePedido detallePedido) {
        Producto producto = detallePedido.getProducto();
        if ( producto == null ) {
            return null;
        }
        return producto.getNombre();
    }
}
