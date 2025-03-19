package com.belleange.mall.controller;


import com.belleange.mall.dto.MemberDTO;
import com.belleange.mall.dto.MemberModifyDTO;
import com.belleange.mall.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/member")

public class MemberController {

    private final MemberService memberService;

    @PostMapping(value = "/join", consumes = "application/json")
    public Map<String, String> join(@RequestBody MemberDTO memberDTO) {
        log.info("Attempting to join member: {}", memberDTO);
        String email = memberService.join(memberDTO);
        log.info("Member joined with ID: {}", email);
        return Map.of("result", email);
    }


    @PutMapping("/modify")
    public Map<String, String> modify(@RequestBody MemberModifyDTO memberModifyDTO) {

        memberService.modifyMember(memberModifyDTO);

        return Map.of("result", "modified");
    }


    @GetMapping("/{email}")
    public MemberDTO get(@PathVariable(name = "email") String email) {

        return memberService.get(email);

    }


}
