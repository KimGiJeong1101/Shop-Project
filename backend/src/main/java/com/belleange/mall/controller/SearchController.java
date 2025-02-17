package com.belleange.mall.controller;

import com.belleange.mall.domain.Product;
import com.belleange.mall.service.SearchService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Log4j2
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/api/search/products")
    public Page<Product> searchProducts(@RequestParam String searchKeyword, Pageable pageable){
        log.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" + searchKeyword);
        return searchService.searchList(searchKeyword, pageable);
    }
}
