package sv.edu.udb.service.mapper;

import org.mapstruct.Mapper;
import sv.edu.udb.controller.request.ProductoRequest;
import sv.edu.udb.controller.response.ProductoResponse;
import sv.edu.udb.repository.domain.Producto;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductoMapper {
    ProductoResponse toProductoResponse(final Producto data);
    List<ProductoResponse> toProductoResponseList(final List<Producto> productoList);
    Producto toProducto(final ProductoRequest productoRequest);
}
