package com.belleange.mall.repository;

import com.belleange.mall.domain.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {

    @EntityGraph(attributePaths = "imageList") // "imageList" 속성을 포함한 연관 엔티티를 함께 로딩하도록 정의
    @Query("select e from Event e where e.eno = :eno") // "Event" 엔티티에서 eno 속성이 파라미터로 주어진 값과 일치하는 엔티티를 조회
    Optional<Event> selectOne(@Param("eno") Long eno); // Optional 조회 결과가 존재하지 않을 수 있는 상황에서 NullPointerException을 방지하고자 사용

    // 이벤트 삭제
    @Modifying // 데이터베이스를 수정하는 쿼리를 실행할 때 사용 (update)
    @Query("update Event e set e.delFlag=:flag where e.eno=:eno") // delFlag 속성을 업데이트하며, eno가 주어진 값과 일치하는 엔티티를 선택
    void updateToDelete(@Param("eno") Long eno, @Param("flag") boolean flag);

    // 이미지가 포함된 목록 처리
    @Query("select e, ei from Event e left join e.imageList ei where ei.ord = 0 and e.delFlag = false")
    Page<Object[]> selectList(Pageable pageable);

}