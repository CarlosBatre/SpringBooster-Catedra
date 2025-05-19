package sv.edu.udb.service.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import sv.edu.udb.controller.request.ProductoRequest;
import sv.edu.udb.controller.response.ProductoResponse;
import sv.edu.udb.repository.domain.Producto;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T22:03:19-0600",
    comments = "version: 1.6.2, compiler: javac, environment: Java 17.0.14 (Azul Systems, Inc.)"
)
@Component
public class ProductoMapperImpl implements ProductoMapper {

    @Override
    public ProductoResponse toProductoResponse(Producto data) {
        if ( data == null ) {
            return null;
        }

        ProductoResponse.ProductoResponseBuilder productoResponse = ProductoResponse.builder();

        productoResponse.id( data.getId() );
        productoResponse.nombre( data.getNombre() );
        productoResponse.imagen( data.getImagen() );
        productoResponse.descripcion( data.getDescripcion() );
        productoResponse.ingredientes( data.getIngredientes() );
        productoResponse.beneficios( data.getBeneficios() );
        if ( data.getPresentacion() != null ) {
            productoResponse.presentacion( data.getPresentacion().name() );
        }
        productoResponse.precio( data.getPrecio() );

        return productoResponse.build();
    }

    @Override
    public List<ProductoResponse> toProductoResponseList(List<Producto> productoList) {
        if ( productoList == null ) {
            return null;
        }

        List<ProductoResponse> list = new ArrayList<ProductoResponse>( productoList.size() );
        for ( Producto producto : productoList ) {
            list.add( toProductoResponse( producto ) );
        }

        return list;
    }

    @Override
    public Producto toProducto(ProductoRequest productoRequest) {
        if ( productoRequest == null ) {
            return null;
        }

        Producto.ProductoBuilder producto = Producto.builder();

        producto.nombre( productoRequest.getNombre() );
        producto.imagen( productoRequest.getImagen() );
        producto.descripcion( productoRequest.getDescripcion() );
        producto.ingredientes( productoRequest.getIngredientes() );
        producto.beneficios( productoRequest.getBeneficios() );
        if ( productoRequest.getPresentacion() != null ) {
            producto.presentacion( Enum.valueOf( Producto.Presentacion.class, productoRequest.getPresentacion() ) );
        }
        producto.precio( productoRequest.getPrecio() );

        return producto.build();
    }
}
