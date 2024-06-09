package com.belleange.mall.repository;


import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.belleange.mall.domain.Product;
import com.belleange.mall.domain.ProductImages;

public interface ProductRepository extends JpaRepository<Product, Long>{

    @EntityGraph(attributePaths = {"imageList"})
    @Query("select p from Product p where p.pno = :pno")
    Optional<Product> selectOne(@Param("pno") Long pno);

    @Query("select pi from Product p left join p.imageList pi where pi.ord = 0 and p.pno = :pno")
     ProductImages selectOrderImg(Long pno);

    // Modifying 어노테이션을 사용하여 업데이트 쿼리를 실행하는 메서드 정의
    @Modifying
    // JPQL을 사용하여 제품의 삭제 플래그를 업데이트하는 메서드
    @Query("update Product p set p.delFlag = :flag where p.pno = :pno")
    void updateToDelete(@Param("pno") Long pno , @Param("flag") boolean flag);
    
    @Query("select p, pi from Product p left join p.imageList pi where (pi.ord = 0 OR pi.ord = 1) and p.delFlag = false and p.cno = 1")
    Page<Object[]> selectListcno1(Pageable pageable);

    @Query("select p, pi from Product p left join p.imageList pi where (pi.ord = 0 OR pi.ord = 1) and p.delFlag = false and p.cno = 2")
    Page<Object[]> selectListcno2(Pageable pageable);

    @Query("select p, pi from Product p left join p.imageList pi where (pi.ord = 0 OR pi.ord = 1) and p.delFlag = false and (p.cno = 1 Or p.cno=2)")
    Page<Object[]> selectListAll(Pageable pageable);

    @Query("select p from Product p left join p.imageList pi  where p.delFlag = false")
    Page<Product> selectListWitAll(Pageable pageable);
}