package com.belleange.mall.repository;
import com.belleange.mall.domain.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    @EntityGraph(attributePaths = "noticeImageList")
    @Query("select n from Notice n where n.nno = :nno")
    Optional<Notice> selectOne(@Param("nno") Long nno);

    @Modifying
    @Query("update Notice n set n.ndelFlag = :nflag where n.nno = :nno")
    void updateToDelete(@Param("nno") Long nno , @Param("nflag") boolean nflag);

    @Query ("select n, ni from Notice n left join n.noticeImageList ni where ni.ord = 0 and n.ndelFlag = false ")
    Page<Object[]> selectList(Pageable pageable);

    @EntityGraph(attributePaths = "noticeImageList")
    @Query("select n from Notice n where n.ndelFlag = :ndelFlag")
    Page<Notice> findByNdelFlag(@Param("ndelFlag") boolean ndelFlag, Pageable pageable);
}