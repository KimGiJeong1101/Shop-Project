package com.belleange.mall.service;

import com.belleange.mall.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SearchService {
    Page<Product>  searchList(String searchKeyword, Pageable pageable);
}
