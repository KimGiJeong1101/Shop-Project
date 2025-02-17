package com.belleange.mall.controller;

import com.belleange.mall.dto.AskDTO;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.service.AskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/ask")
public class AskController {

    private final AskService askService;



    @PostMapping(value = "/register", consumes = "application/json")
    public Map<String, Long> register(@RequestBody AskDTO askDTO) {

        log.info("-------re control---------------");
        Long ano = askService.register(askDTO);
        return Map.of("ANO", ano);
    }

    @GetMapping("/list")
    public PageResponseDTO<AskDTO> list(PageRequestDTO pageRequestDTO) {
        return askService.askList(pageRequestDTO);
    }

    @GetMapping("/{ano}")
    public AskDTO get(@PathVariable(name = "ano") Long ano) {
        return askService.get(ano);
    }


    @PreAuthorize("hasAnyRole('USER','MANAGER','ADMIN')")
    @PutMapping("/{ano}")
    public Map<String, String> modify(@PathVariable(name = "ano") Long ano,
                                      @RequestBody AskDTO askDTO) {
        askDTO.setAno(ano);
        askService.modify(askDTO);
        return Map.of("result", "success");
    }


    @PreAuthorize("hasAnyRole('USER','MANAGER','ADMIN')")
    @DeleteMapping("/{ano}")
    public Map<String, String> remove(@PathVariable(name = "ano") Long ano) {
        askService.remove(ano);
        return Map.of("result", "success");
    }
//
//    @PostMapping("/pwCheck")
//    public String pwCheck(@RequestBody AskDTO askDTO) {
//        String same = askService.PasswordCheck(askDTO);
//        return same;
//    }
}