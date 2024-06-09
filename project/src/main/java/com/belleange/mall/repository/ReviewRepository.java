package com.belleange.mall.repository;

import com.belleange.mall.domain.Member;
import com.belleange.mall.domain.Product;
import com.belleange.mall.domain.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

//    @EntityGraph(attributePaths = {"member"}, type = EntityGraph.EntityGraphType.FETCH)
//    List<Review> findByProduct(Product product);

    @Query("select r from Review r Join fetch r.product p Join fetch r.member m where p.pno=:pno")
    Page<Review>findByProduct(@Param("pno") Long pno,Pageable pageable);

    @Modifying
    @Query("delete from Review pr where pr.member=:member")
    void deleteByMember(Member member);


}
