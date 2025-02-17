package com.belleange.mall.service;

import com.belleange.mall.domain.Product;
import com.belleange.mall.repository.SearchRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@Log4j2
public class SearchServiceImpl implements SearchService{
    @Autowired
    private SearchRepository searchRepository;

    @Override
    public Page<Product> searchList(String searchKeyword, Pageable pageable){
        // 검색어가 null이나 빈 문자열인 경우 처리
        if (!StringUtils.hasText(searchKeyword)) {
            throw new IllegalArgumentException("검색어를 입력하세요.");
        }

        // 정렬 기준 추가 (예시: 상품 이름으로 정렬)
        Sort sort = Sort.by("pname").ascending();

        return searchRepository.findByPnameContaining(searchKeyword, pageable);
    }
}
