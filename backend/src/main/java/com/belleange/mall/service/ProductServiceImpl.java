package com.belleange.mall.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.belleange.mall.domain.Product;
import com.belleange.mall.domain.ProductImages;
import com.belleange.mall.domain.ProductSellStatus;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.dto.ProductDTO;
import com.belleange.mall.repository.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService{
    private final ProductRepository productRepository; // ProductService를 위한 ProductRepository 주입

    // 페이지네이션 및 상품 목록 조회 메서드
    @Override
    public PageResponseDTO<ProductDTO> getListCnoOne(PageRequestDTO pageRequestDTO) {
        log.info("getListCnoSet.........");

        // 페이지 요청 정보를 기반으로 페이지네이션 설정
        Pageable pageable = PageRequest.of(
            pageRequestDTO.getPage() - 1,
            pageRequestDTO.getSize(),
            Sort.by("pno").descending()
        );
        // 상품 목록 조회
        Page<Object[]> result = productRepository.selectListcno1(pageable);
        log.info(result);

        // 조회 결과를 DTO로 변환하면서 중복 제거 및 이미지 파일명 리스트 관리
        Map<Long, ProductDTO> productsMap = new HashMap<>();
        result.forEach(arr -> {
            Product product = (Product) arr[0];
            ProductImages productImages = (ProductImages) arr[1];

            ProductDTO productDTO = productsMap.getOrDefault(product.getPno(), ProductDTO.builder()
                .pno(product.getPno())
                .pname(product.getPname())
                .pdesc(product.getPdesc())
                .price(product.getPrice())
                .cno(product.getCno())
                .stockNumber(product.getStockNumber())
                .uploadFileNames(new ArrayList<>())
                .uploadDfileNames(new ArrayList<>())
                .build());

            if (productImages.getFileName() != null) {
                productDTO.getUploadFileNames().add(productImages.getFileName());
            }
            if (productImages.getDfileName() != null) {
                productDTO.getUploadDfileNames().add(productImages.getDfileName());
            }

            productsMap.put(product.getPno(), productDTO);
        });

        List<ProductDTO> dtoList = new ArrayList<>(productsMap.values());
        long totalCount = result.getTotalElements();

        return PageResponseDTO.<ProductDTO>withAll()
            .dtoList(dtoList)
            .totalCount(totalCount)
            .pageRequestDTO(pageRequestDTO)
            .build();
    }
        @Override
        public PageResponseDTO<ProductDTO> getListCnoSet(PageRequestDTO pageRequestDTO) {
            log.info("getListCnoSet.........");

            // 페이지 요청 정보를 기반으로 페이지네이션 설정
            Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, 
                pageRequestDTO.getSize(), 
                Sort.by("pno").descending()
            );

            // 상품 목록 조회
            Page<Object[]> result = productRepository.selectListcno2(pageable);
            log.info(result);

            // 조회 결과를 DTO로 변환하면서 중복 제거 및 이미지 파일명 리스트 관리
            Map<Long, ProductDTO> productsMap = new HashMap<>();
            result.forEach(arr -> {
                Product product = (Product) arr[0];
                ProductImages productImages = (ProductImages) arr[1];

                ProductDTO productDTO = productsMap.getOrDefault(product.getPno(), ProductDTO.builder()
                    .pno(product.getPno())
                    .pname(product.getPname())
                    .pdesc(product.getPdesc())
                    .price(product.getPrice())
                    .cno(product.getCno())
                    .stockNumber(product.getStockNumber())
                    .uploadFileNames(new ArrayList<>())
                    .uploadDfileNames(new ArrayList<>())
                    .build());

                if (productImages.getFileName() != null) {
                    productDTO.getUploadFileNames().add(productImages.getFileName());
                }
                if (productImages.getDfileName() != null) {
                    productDTO.getUploadDfileNames().add(productImages.getDfileName());
                }

                productsMap.put(product.getPno(), productDTO);
            });

            List<ProductDTO> dtoList = new ArrayList<>(productsMap.values());
            long totalCount = result.getTotalElements();

            return PageResponseDTO.<ProductDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
        }
        @Override
        public PageResponseDTO<ProductDTO> getListAll(PageRequestDTO pageRequestDTO) {
            log.info("getListCnoAll.........");

            // 페이지 요청 정보를 기반으로 페이지네이션 설정
            Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, 
                pageRequestDTO.getSize(), 
                Sort.by("pno").descending()
            );

            // 상품 목록 조회
            Page<Object[]> result = productRepository.selectListAll(pageable);
            log.info("=============================================================");
            log.info("=============================================================");
            log.info("=============================================================");
            log.info("productServiceImple : "+result);

            // 조회 결과를 DTO로 변환하면서 중복 제거 및 이미지 파일명 리스트 관리
            Map<Long, ProductDTO> productsMap = new HashMap<>();
            result.forEach(arr -> {
                Product product = (Product) arr[0];
                ProductImages productImages = (ProductImages) arr[1];

                ProductDTO productDTO = productsMap.getOrDefault(product.getPno(), ProductDTO.builder()
                    .pno(product.getPno())
                    .pname(product.getPname())
                    .pdesc(product.getPdesc())
                    .price(product.getPrice())
                    .cno(product.getCno())
                    .stockNumber(product.getStockNumber())
                    .uploadFileNames(new ArrayList<>())
                    .uploadDfileNames(new ArrayList<>())
                    .build());

                if (productImages.getFileName() != null) {
                    productDTO.getUploadFileNames().add(productImages.getFileName());
                }
                if (productImages.getDfileName() != null) {
                    productDTO.getUploadDfileNames().add(productImages.getDfileName());
                }

                productsMap.put(product.getPno(), productDTO);
            });

            List<ProductDTO> dtoList = new ArrayList<>(productsMap.values());
            long totalCount = result.getTotalElements();

            return PageResponseDTO.<ProductDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
        }

    @Override
    public Long register(ProductDTO productDTO) {
        Product product = dtoToEntity(productDTO);
        Product result = productRepository.save(product);
        return result.getPno();
    }

    private Product dtoToEntity(ProductDTO productDTO) {
        Product product = Product.builder()
                .pno(productDTO.getPno())
                .pname(productDTO.getPname())
                .pdesc(productDTO.getPdesc())
                .price(productDTO.getPrice())
                .cno(productDTO.getCno())
                .stockNumber(productDTO.getStockNumber())
                .productSellStatus(ProductSellStatus.SELL)
                .build();


        //업로드 처리가 끄탄ㄴ 파일들의 이름 리스트
        List<String> uploadFileNames = productDTO.getUploadFileNames();
        if(uploadFileNames == null){
            return product;
        }
        uploadFileNames.stream().forEach(uploadName -> {
            product.addImageString(uploadName);
        });
        List<String> uploadDfileNames = productDTO.getUploadDfileNames();
        if(uploadDfileNames == null){
            return product;
        }
        uploadDfileNames.stream().forEach(uploadDname -> {
            product.addDetailImageString(uploadDname);
        });

        return product;
    }

    @Override
    public ProductDTO get(Long pno) {

        java.util.Optional<Product> result = productRepository.selectOne(pno);
        Product product = result.orElseThrow();

        ProductDTO productDTO = entityToDTO(product);
        return productDTO;
    }

    private ProductDTO entityToDTO(Product product){
        ProductDTO productDTO = ProductDTO.builder()
                .pno(product.getPno())
                .pname(product.getPname())
                .pdesc(product.getPdesc())
                .price(product.getPrice())
                .cno(product.getCno())
                .stockNumber(product.getStockNumber())
                .build();

        List<ProductImages> imageList = product.getImageList();
        if(imageList == null || imageList.size() == 0){
            return productDTO;
        }
        List<String> fileNameList = imageList.stream().map(productImage -> productImage.getFileName())
                .toList();
        List<String> DfileNameList = imageList.stream().map(productImage -> productImage.getDfileName())
                .toList();

        productDTO.setUploadFileNames(fileNameList);
        productDTO.setUploadDfileNames(DfileNameList);
        return productDTO;

    }

    @Override
    public void modify(ProductDTO productDTO) {
    // Step 1: 제품 정보 찾기
    Optional<Product> result = productRepository.findById(productDTO.getPno());
    Product product = result.orElseThrow(); // 제품이 없을 경우 예외 발생

    // Step 2: 기본 정보 업데이트
    product.changePname(productDTO.getPname());
    product.changePdesc(productDTO.getPdesc());
    product.changePrice(productDTO.getPrice());
    product.changeCno(productDTO.getCno());
    product.changeStockNumber(productDTO.getStockNumber());

    // Step 3: 기존 이미지 목록 초기화
    product.clearList();

    // Step 4: 제품 이미지와 상세 이미지 처리
    if (productDTO.getUploadFileNames() != null) {
        productDTO.getUploadFileNames().stream()
            .filter(name -> name != null && !name.isEmpty()) // null이 아니고, 빈 문자열이 아닌 경우만 처리
            .forEach(product::addImageString);
    }

    if (productDTO.getUploadDfileNames() != null) {
        productDTO.getUploadDfileNames().stream()
            .filter(name -> name != null && !name.isEmpty()) // null이 아니고, 빈 문자열이 아닌 경우만 처리
            .forEach(product::addDetailImageString);
    }

    // Step 5: 변경사항 저장
    productRepository.save(product);
}


    @Override
    public void remove(Long pno) {
        productRepository.updateToDelete(pno, true);
    }
}

