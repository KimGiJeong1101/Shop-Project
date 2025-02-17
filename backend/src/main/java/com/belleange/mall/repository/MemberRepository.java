package com.belleange.mall.repository;

import com.belleange.mall.domain.Member;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;


public interface MemberRepository extends JpaRepository<Member, String> {

    @EntityGraph(attributePaths = {"memberRoleList"}) // "memberRoleList" 연관된 컬럼을 즉시 로딩하기 위함
    @Query("select m from Member m where m.email = :email")
    Member getWithRoles(@Param("email") String email);

    // select * from member where email = ?

    Member findByEmail(String email);

    
    boolean existsByEmail(String email);


}