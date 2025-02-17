package com.belleange.mall.service;


import com.belleange.mall.domain.Event;
import com.belleange.mall.domain.EventImages;
import com.belleange.mall.dto.EventDTO;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
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

public class EventServiceImpl implements EventService {

    //자동주입 대상은 final로
    private final ModelMapper modelMapper;
    private final EventRepository eventRepository;

    //목록 페이징 처리 O
    @Override
    public PageResponseDTO<EventDTO> getList(PageRequestDTO pageRequestDTO) {
        log.info("getList...........................................");
        Pageable pageable = PageRequest.of( // 페이징 처리를 위해 사용되는 객체를 생성하는 부분
                pageRequestDTO.getPage() - 1, // 페이지 시작 번호가 0부터 시작하므로
                pageRequestDTO.getSize(),
                Sort.by("eno").descending());

        Page<Object[]> result = eventRepository.selectList(pageable); // 해당 페이지에 대한 데이터 가져옴

        List<EventDTO> dtoList = result.get().map(arr -> { // result.get()을 통해 가져온 데이터를 map() 메서드를 이용하여 EventDTO로 변환 (이벤트와 관련한 데이터 추출해서 변환)

            Event event = (Event) arr[0];
            EventImages eventImages = (EventImages) arr[1];

            EventDTO eventDTO = EventDTO.builder()
                    .eno(event.getEno())
                    .title(event.getTitle())
                    .content(event.getContent())
                    .build();

            String imageStr = eventImages.getFileName();
            eventDTO.setUploadFileNames(List.of(imageStr));

            return eventDTO;
        }).collect(Collectors.toList()); // 스트림의 요소들을 리스트로 수집하는 연산 (collect() 메서드는 스트림의 요소를 수집하여 원하는 자료 구조로 변환)

        long totalCount = result.getTotalElements(); // 총 요소 수 반환

        return PageResponseDTO.<EventDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }

    //등록
    @Override
    public Long register(EventDTO eventDTO) {
        Event event = dtoToEntity(eventDTO);
        Event result = eventRepository.save(event);
        return result.getEno();

    }

    @Override
    public EventDTO get(Long eno) {
        java.util.Optional<Event> result = eventRepository.selectOne(eno);

        Event event = result.orElseThrow();

        EventDTO eventDTO = entityToDTO(event);

        return eventDTO;
    }

    @Override
    public void modify(EventDTO eventDTO) {

        Optional<Event> result = eventRepository.findById(eventDTO.getEno());

        Event event = result.orElseThrow();

        // change title, content
        event.changeTitle(eventDTO.getTitle());
        event.changeContent(eventDTO.getContent());

        // upload File -- clear first
        event.clearList();

        List<String> uploadFileNames = eventDTO.getUploadFileNames();

        if (uploadFileNames != null && uploadFileNames.size() > 0) {
            uploadFileNames.stream().forEach(uploadName -> {
                event.addImageString(uploadName);
            });
        }
                    eventRepository.save(event);
        }

        @Override
        public void remove (Long eno){
            eventRepository.updateToDelete(eno, true);
        }

        private Event dtoToEntity (EventDTO eventDTO){
            Event event = Event.builder()
                    .title(eventDTO.getTitle())
                    .content(eventDTO.getContent())
                    .delFlag(eventDTO.isDelFlag())
                    .build();

            List<String> uploadFileNames = eventDTO.getUploadFileNames();

            if (uploadFileNames != null) {
                uploadFileNames.forEach(uploadName -> event.addImageString(uploadName));
            }

            return event;
        }

        private EventDTO entityToDTO (Event event){
            EventDTO eventDTO = EventDTO.builder()
                    .eno(event.getEno())
                    .title(event.getTitle())
                    .content(event.getContent())
                    .regdate(event.getRegDate())
                    .delFlag(event.isDelFlag())
                    .build();

            List<EventImages> imageList = event.getImageList();

            if (imageList != null && !imageList.isEmpty()) {
                List<String> fileNameList = imageList.stream()
                        .map(EventImages::getFileName)
                        .toList();
                eventDTO.setUploadFileNames(fileNameList);
            }

            return eventDTO;
        }


    }