package com.belleange.mall.controller;
import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.belleange.mall.dto.CartItemDTO;
import com.belleange.mall.dto.CartItemListDTO;
import com.belleange.mall.dto.CartOrderDTO;
import com.belleange.mall.service.CartService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController // RESTful 웹 서비스를 위한 컨트롤러로 선언
@RequiredArgsConstructor // Lombok 라이브러리를 사용해 필요한 생성자 자동 생성
@Log4j2 // 로깅을 위한 Lombok 어노테이션
@RequestMapping("/api/cart") // 이 클래스의 모든 메소드는 '/api/cart' 경로를 기본으로 함
public class CartController {
    private final CartService cartService; // CartService를 의존성 주입

    @PreAuthorize("#itemDTO.email == authentication.name") // 메소드 실행 전 인증된 사용자의 이메일과 DTO의 이메일이 일치해야 실행
    @PostMapping("/change") // POST 요청을 '/change' 경로로 매핑
    public List<CartItemListDTO> changeCart(@RequestBody CartItemDTO itemDTO){ // 장바구니 변경 요청 처리
      log.info("-------------------------------------통과========================="); // 로그 기록
      log.info("-------------------------------------통과========================="); // 로그 기록
      log.info(itemDTO); // 요청된 DTO 로그 기록
  
      if(itemDTO.getCount() <= 0) { // 요청된 수량이 0 이하면 제거
        return cartService.remove(itemDTO.getCino()); // 제거 메소드 호출
      }
      return cartService.addOrModify(itemDTO); // 그 외 경우는 추가 혹은 수정 메소드 호출
    }

    @PreAuthorize("hasAnyRole('ROLE_USER')") // 'ROLE_USER' 역할을 가진 사용자만 접근 가능
    @GetMapping("/items") // GET 요청을 '/items' 경로로 매핑
    public List<CartItemListDTO> getCartItems(Principal principal){ // 사용자의 장바구니 아이템 조회
        String email = principal.getName(); // 인증된 사용자의 이름(이메일)을 가져옴
        log.info("--------------------------------------------------"); // 로그 기록
        log.info("email : " + email); // 사용자 이메일 로그 기록

        return cartService.getCartItems(email); // 해당 이메일로 저장된 장바구니 아이템 리스트 반환
    }

    @PreAuthorize("hasAnyRole('ROLE_USER')") // 'ROLE_USER' 역할을 가진 사용자만 접근 가능
    @GetMapping("/{cino}") // GET 요청을 '/{cino}' 경로로 매핑, 여기서 'cino'는 URL 경로 변수
    public List<CartItemListDTO> removeFromCart(@PathVariable("cino") Long cino){ // 특정 장바구니 아이템 제거 요청 처리
        log.info("cart item no : " + cino); // 로그 기록, 제거하려는 아이템 번호
        return cartService.remove(cino); // 장바구니 아이템 번호로 제거 메소드 호출
    }

    @PostMapping(value = "/orders")
    public @ResponseBody ResponseEntity<Long> orderCartProduct(@RequestBody CartOrderDTO cartOrderDTO, Principal principal){

      List<CartOrderDTO> cartOrderDTOList = cartOrderDTO.getCartOrderDTOList();
      
      if(cartOrderDTOList == null || cartOrderDTOList.isEmpty()){
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "주문할 상품을 선택해주세요");
      }

      for (CartOrderDTO cartOrder : cartOrderDTOList){
        log.info("CartController cartOrder Data : "+cartOrder);
        if(!cartService.validateCartItem(cartOrder.getCino(), principal.getName())){
          throw new ResponseStatusException(HttpStatus.FORBIDDEN, "주문 권한이 없습니다.");
        }
      }
      log.info("=====================CARTCONTROLLER===============================");
      log.info("=====================CARTCONTROLLER===============================");
      log.info(cartOrderDTO.getDmemo());
      log.info(cartOrderDTO.getDname());
      Long orderId = cartService.orderCartItem(cartOrderDTO, principal.getName());
      return ResponseEntity.ok(orderId);
    }


}
