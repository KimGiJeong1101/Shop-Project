package com.belleange.mall.repository;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;

import com.belleange.mall.domain.Cart;
import com.belleange.mall.domain.CartItem;
import com.belleange.mall.domain.Member;
import com.belleange.mall.domain.Product;
import com.belleange.mall.dto.CartItemListDTO;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class CartRepositoryTests {
    
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;

    @Transactional
    @Commit
    @Test
    public void testInsertByProduct(){
        log.info("test1--------------------------------------"); // 로그 출력
        // 사용자가 전송하는 정보
        String email = "user1@aaa.com";
        Long pno = 5L;
        int count = 2;
        Long price = 10000L;

        // 해당 사용자와 상품 번호에 대한 장바구니 아이템 조회
        CartItem cartItem = cartItemRepository.getItemOfPno(email, pno);
        if(cartItem != null){ // 해당 아이템이 존재하면
            cartItem.changeCount(count); // 수량 변경
            cartItemRepository.save(cartItem); // 변경된 아이템 저장

            return; // 이후 처리 중단
        }
        // 사용자의 장바구니가 존재하는지 확인
        Optional<Cart> result = cartRepository.getCartOfMember(email);
        Cart cart = null;
        if(result.isEmpty()){ // 장바구니가 없으면 새로 생성
            log.info("MemberCart is not exist!!");
            Member member = Member.builder().email(email).build(); // 새 Member 인스턴스 생성
            Cart tempCart = Cart.builder().owner(member).build(); // 새 Cart 인스턴스 생성
            cart = cartRepository.save(tempCart); // 새 장바구니 저장
        } else {
            cart = result.get(); // 기존의 장바구니 사용
        }
        log.info(cart); // 로그에 장바구니 정보 출력

        // 새로운 상품 아이템 추가
        if(cartItem == null){ // 위에서 찾지 못했을 경우
            Product product = Product.builder().pno(pno).build(); // 새 Product 인스턴스 생성
            cartItem = CartItem.builder().product(product).cart(cart).count(count).build(); // 새 CartItem 생성
        }
        cartItemRepository.save(cartItem); // 새 아이템을 저장
    }

    // 장바구니 아이템의 수량을 업데이트하는 테스트
    @Test
    @Commit // 테스트가 성공적으로 완료되면 변경사항을 DB에 반영(커밋)
    public void testUpdateBycino(){
        Long cino = 1L; // 테스트할 장바구니 아이템 ID
        int count = 4; // 변경할 수량
        // 해당 ID의 장바구니 아이템을 찾고, 없으면 예외를 발생시킴
        Optional<CartItem> result = cartItemRepository.findById(cino);
        CartItem cartItem = result.orElseThrow();
        cartItem.changeCount(count); // 수량을 변경하는 메소드 호출
        cartItemRepository.save(cartItem); // 변경된 아이템을 저장
    }

    // 특정 회원의 장바구니 아이템 목록을 조회하는 테스트
    @Test
    public void testListOfMember(){
        String email = "user1@aaa.com"; // 조회할 회원의 이메일
        // 회원 이메일을 사용하여 장바구니 아이템 목록을 조회
        List<CartItemListDTO> cartItemList = cartItemRepository.getItemsOfCartDTOByEmail(email);

        // 조회된 아이템 목록을 로그로 출력
        for(CartItemListDTO dto : cartItemList){
            log.info(dto);
        }
    }

    // 장바구니 아이템을 삭제한 후 관련 목록을 조회하는 테스트
    @Test
    public void testDeleteThenList(){
        Long cino = 1L; // 삭제할 장바구니 아이템 ID
        // 아이템 ID를 사용하여 해당 아이템이 속한 장바구니의 ID를 조회
        Long cno = cartItemRepository.getCartFromItem(cino);

        // 아이템 삭제 (실제로는 주석 처리되어 실행되지 않음)
        // cartItemRepository.deleteById(cino);

        // 해당 장바구니의 아이템 목록을 조회
        List<CartItemListDTO> cartItemList = cartItemRepository.getItemsOfCartDTOByCart(cno);

        // 조회된 아이템 목록을 로그로 출력
        for(CartItemListDTO dto : cartItemList) {
            log.info(dto);
        }
    }
}