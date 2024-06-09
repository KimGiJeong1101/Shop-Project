package com.belleange.mall.repository;

import com.belleange.mall.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchRepository extends JpaRepository<Product, Long> {
    Page<Product> findByPnameContaining(String searchKeyword, Pageable pageable);
}
