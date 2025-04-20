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

    // frontend의 headers와 backend의 consumes은 단짝느낌 !
    @PostMapping(value = "/join", consumes = "application/json")

    public Map<String, String> join(@RequestBody MemberDTO memberDTO) {
        // → @RequestBody : JSON 데이터를 Java 객체(MemberDTO)로 변환해서 받겠다는 뜻
        // → 프론트에서 보낸 JSON이 MemberDTO 필드랑 일치하면 자동으로 매핑됨
        log.info("Attempting to join member: {}", memberDTO);
        String email = memberService.join(memberDTO);
        log.info("Member joined with ID: {}", email);
        // Map.of 문법은 간략하게 말하자면 데이터를 JSON형태로 바꾸어주는 문법
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
