package com.belleange.mall.service;


import com.belleange.mall.domain.Ask;
import com.belleange.mall.domain.Member;
import com.belleange.mall.dto.AskDTO;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.repository.AskRepository;
import com.belleange.mall.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class AskServiceImpl implements AskService {

    private final AskRepository askRepository;
    private final MemberRepository memberRepository;

    @Override
    public Long register(AskDTO askDTO) {

        log.info("...... register1");
        Ask ask=dtoToAsk(askDTO);
        log.info("...... register2");
        Ask result=askRepository.save(ask);
        log.info(result);
        log.info("...... register3");
        return result.getAno();
    }

    @Override
    public AskDTO get(Long ano) {
        Optional<Ask> result=askRepository.findById(ano);
        Ask ask=result.orElseThrow();
        AskDTO askDTO=AskTodto(ask);
        return askDTO;
    }

    @Override
    public void modify(AskDTO askDTO) {
        Optional<Ask> result=askRepository.findById(askDTO.getAno());
        Ask ask=result.orElseThrow();
        ask.changeTitle(askDTO.getTitle());
        ask.changeText(askDTO.getText());
        askRepository.save(ask);
    }

    @Override
    public void remove(Long ano) {
        askRepository.deleteById(ano);
    }

    @Override
    public PageResponseDTO<AskDTO> askList(PageRequestDTO pageRequestDTO) {

        Pageable pageable= PageRequest.of(
                pageRequestDTO.getPage()-1,
                pageRequestDTO.getSize(),
                Sort.by("ano").descending()
        );
        Page<Ask> result=askRepository.findAll(pageable);
        List<AskDTO> dtoList= result.stream()
                .map(ask -> AskTodto(ask))
                .collect(Collectors.toList());
        long total=result.getTotalElements();

        PageResponseDTO<AskDTO> responseDTO= PageResponseDTO.<AskDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(total)
                .build();
        return responseDTO;
    }

//    @Override
//    public String PasswordCheck(AskDTO askDTO) {
//
//        String result = askRepository.passwordCheck(askDTO);
//        System.out.println("PasswordCheck() 메소드의 반환값: " + result);
//
//        return result;
//    }



    /* 디투엔 *******************************************************************************************/

    private Ask dtoToAsk(AskDTO askDTO) {
        Ask ask = Ask.builder()
                .ano(askDTO.getAno())
                .title(askDTO.getTitle())
                .text(askDTO.getText())
                .password(askDTO.getPassword())
                .writer(Member.builder().email(askDTO.getWriter()).build())
                .build();
        return ask;
    }

    /* 엔투디 *******************************************************************************************/

    private AskDTO AskTodto(Ask ask) {
        AskDTO askDTO = AskDTO.builder()
                .ano(ask.getAno())
                .title(ask.getTitle())
                .text(ask.getText())
                .password(ask.getPassword())
                .writer(ask.getWriter().getEmail())
                .regDate(ask.getRegDate())
                .modDate(ask.getModDate())
                .build();
        return askDTO;
    }

}