package com.belleange.mall.controller;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.dto.ProductDTO;
import com.belleange.mall.service.ProductService;
import com.belleange.mall.util.CustomProductFileUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final CustomProductFileUtil fileUtil;


    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PostMapping("/")
    public Map<String, Long> register(ProductDTO productDTO){
        log.info("register : " + productDTO);
        List<MultipartFile> files = productDTO.getFiles();
        List<MultipartFile> dfiles = productDTO.getDfiles();

        List<String> uploadFileNames = fileUtil.saveFiles(files);
        List<String> uploadDfileNames = fileUtil.saveFiles(dfiles);

        productDTO.setUploadDfileNames(uploadDfileNames);
        productDTO.setUploadFileNames(uploadFileNames);
        log.info("============================업로드파일명=================================");
        log.info(uploadFileNames);
        log.info(uploadDfileNames);
        log.info("============================업로드파일명=================================");

        //Service 코딩시작
        Long pno = productService.register(productDTO);
        try{
            Thread.sleep(2000);
        }catch(Exception e){
            e.printStackTrace();
        }
        return Map.of("result", pno);
    }

    @GetMapping("/list/one")
    public PageResponseDTO<ProductDTO> listone (PageRequestDTO pageRequestDTO){
        log.info("listCnoOne............."  + pageRequestDTO);
        // try{
        //   Thread.sleep(1500);
        // }catch(Exception e){
        //   e.printStackTrace();
        // }
        return productService.getListCnoOne(pageRequestDTO);
    }
    @GetMapping("/list/set")
    public PageResponseDTO<ProductDTO> listset (PageRequestDTO pageRequestDTO){
        log.info("listCnoSet............."  + pageRequestDTO);
        // try{
        //   Thread.sleep(1500);
        // }catch(Exception e){
        //   e.printStackTrace();
        // }
        
        return productService.getListCnoSet(pageRequestDTO);
        
    }
    @GetMapping("/list/all")
    public PageResponseDTO<ProductDTO> listAll (PageRequestDTO pageRequestDTO){
        log.info("listCnoAll............."  + pageRequestDTO);
        // try{
        //   Thread.sleep(1500);
        // }catch(Exception e){
        //   e.printStackTrace();
        // }
        
        return productService.getListAll(pageRequestDTO);
    }
    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGet (@PathVariable String fileName){
        return fileUtil.getFile(fileName);
    }


    @GetMapping("/{pno}")
    public ProductDTO read(@PathVariable(name="pno") Long pno){
        return productService.get(pno);
    }


    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PutMapping("/{pno}")
    public Map<String, String> modify(@PathVariable(name="pno")Long pno, ProductDTO productDTO) {
        productDTO.setPno(pno);
        ProductDTO oldProductDTO = productService.get(pno);
        //기존의 파일들 (데이터베이스에 존재하는 파일들 - 수정 과정에서 삭제되었을 수 있음)
        List<String> oldFileNames = oldProductDTO.getUploadFileNames();
        List<String> oldDfileNames = oldProductDTO.getUploadDfileNames();
        //새로 업로드 해야 하는 파일들
        List<MultipartFile> files = productDTO.getFiles();
        List<MultipartFile> Dfiles = productDTO.getDfiles();
        //새로 업로드되어서 만들어진 파일 이름들
        List<String> currentUploadFileNames = fileUtil.saveFiles(files);
        List<String> currentUploadDfileNames = fileUtil.saveFiles(Dfiles);
        //화면에서 변화 없이 계속 유지된 파일들
        List<String> uploadedFileNames = productDTO.getUploadFileNames();
        List<String> uploadedDfileNames = productDTO.getUploadDfileNames();
        //유지되는 파일들  + 새로 업로드된 파일 이름들이 저장해야 하는 파일 목록이 됨
        if(currentUploadFileNames != null && currentUploadFileNames.size() > 0) {
            uploadedFileNames.addAll(currentUploadFileNames);
        }
        if(currentUploadDfileNames != null && currentUploadDfileNames.size()> 0){
            uploadedDfileNames.addAll(currentUploadDfileNames);
        }
        //서비스 호출 수정작업
        productService.modify(productDTO);
        // 실제 이미지 수정작업 제품이미지
        if(oldFileNames != null && oldFileNames.size() > 0){
            //지워야 하는 파일 목록 찾기
            //예전 파일들 중에서 지워져야 하는 파일이름들
            List<String> removeFiles =  oldFileNames
                    .stream()
                    .filter(fileName -> uploadedFileNames.indexOf(fileName) == -1).collect(Collectors.toList());
            //실제 파일 삭제
            fileUtil.deleteFiles(removeFiles);
        }//실제 이미지 수정작업2 제품디테일이미지
        if(oldDfileNames != null && oldDfileNames.size()>0){
            List<String> removeDfiles = oldDfileNames.stream()
                    .filter(dfileName -> uploadedDfileNames.indexOf(dfileName) == -1).collect(Collectors.toList());
            fileUtil.deleteFiles(removeDfiles);
        }
        return Map.of("RESULT", "SUCCESS");
    }


    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @DeleteMapping("/{pno}")
    public Map<String, String> remove(@PathVariable("pno") Long pno){
        //삭제해야할 파일들 알아내기
        List<String> oldFileNames = productService.get(pno).getUploadFileNames();

        productService.remove(pno);
        fileUtil.deleteFiles(oldFileNames);
        return Map.of("result", "SUCCESS");
    }


}
