package com.belleange.mall.repository;

import com.belleange.mall.domain.Ask;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AskRepository extends JpaRepository<Ask, Long> {

//    // 비밀번호를 확인하는 Query
//    @Query("select a from Ask a where a.ano=:ano and a.password=:password")
//    String passwordCheck(@Param("ano") Long ano, @Param("password") String password);

}
