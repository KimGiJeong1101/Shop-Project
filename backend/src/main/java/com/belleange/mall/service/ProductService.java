package com.belleange.mall.service;

import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.dto.ProductDTO;

import jakarta.transaction.Transactional;

@Transactional
public interface ProductService {
    PageResponseDTO<ProductDTO> getListCnoOne(PageRequestDTO pageRequestDTO);
    PageResponseDTO<ProductDTO> getListCnoSet(PageRequestDTO pageRequestDTO);
    PageResponseDTO<ProductDTO> getListAll(PageRequestDTO pageRequestDTO);
    Long register(ProductDTO productDTO);
    ProductDTO get(Long pno);
    void modify(ProductDTO productDTO);
    void remove(Long pno);
}
