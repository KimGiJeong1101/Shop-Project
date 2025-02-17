package com.belleange.mall.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.swing.text.html.parser.Entity;

import org.springframework.stereotype.Service;

import com.belleange.mall.domain.Cart;
import com.belleange.mall.domain.CartItem;
import com.belleange.mall.domain.Member;
import com.belleange.mall.domain.Product;
import com.belleange.mall.dto.CartItemDTO;
import com.belleange.mall.dto.CartItemListDTO;
import com.belleange.mall.dto.CartOrderDTO;
import com.belleange.mall.dto.OrderDTO;
import com.belleange.mall.repository.CartItemRepository;
import com.belleange.mall.repository.CartRepository;
import com.belleange.mall.repository.MemberRepository;
import com.belleange.mall.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RequiredArgsConstructor // 생성자 주입을 위한 Lombok 어노테이션
@Service // 스프링 서비스 레이어를 나타내는 어노테이션
@Log4j2 // 로그를 위한 Lombok 어노테이션
@Transactional
public class CartServiceImpl implements CartService{
    private final CartRepository cartRepository; // 장바구니 레포지토리 인터페이스
    private final CartItemRepository cartItemRepository; // 장바구니 아이템 레포지토리 인터페이스
    private final MemberRepository memberRepository;
    private final OrderService orderService;
    private final ProductRepository productRepository;
    @Override
    public List<CartItemListDTO> addOrModify(CartItemDTO cartItemDTO) {
    
        String email = cartItemDTO.getEmail(); // 사용자 이메일
        Long pno = cartItemDTO.getPno(); // 상품 번호
        int count = cartItemDTO.getCount(); // 수량
        Long cino = cartItemDTO.getCino(); // 장바구니 아이템 번호
        
        if(cino != null){
            // 장바구니 아이템 번호가 있으면, 해당 아이템의 수량만 변경
            Optional<CartItem> cartItemResult = cartItemRepository.findById(cino);
            CartItem cartItem = cartItemResult.orElseThrow(); // 해당 아이템이 없으면 예외 발생
            cartItem.changeCount(count); // 수량 변경 메서드 호출
            cartItemRepository.save(cartItem); // 변경된 아이템 저장
            return getCartItems(email); // 변경 후 장바구니 아이템 리스트 반환
        }
        // 새로운 아이템을 장바구니에 추가하는 경우
        
        // 사용자의 카트 찾기
        Cart cart = getCart(email); // 사용자의 Cart 정보를 찾는 메서드 호출
        CartItem cartItem = null;

        // 이미 동일한 상품이 장바구니에 있는지 확인
        cartItem = cartItemRepository.getItemOfPno(email, pno);
        if(cartItem == null){
            Product product = Product.builder().pno(pno).build(); // 새 상품 객체 생성
            cartItem = CartItem.builder().product(product).cart(cart).count(count).build(); // 새 장바구니 아이템 객체 생성
        }else{
            cartItem.changeCount(count); // 이미 있는 상품이면 수량만 변경
        }
        // 변경된 상품 아이템 저장
        cartItemRepository.save(cartItem);

        return getCartItems(email); // 변경 후 장바구니 아이템 리스트 반환
    }

    // 사용자의 장바구니 정보 가져오기
    private Cart getCart(String email){
        Cart cart = null;
        Optional<Cart> result = cartRepository.getCartOfMember(email); // 사용자의 Cart 정보 가져오기
        if(result.isEmpty()){
            log.info("Cart of the member is not exist!!!"); // 로그 기록: 카트 없음
            Member member = Member.builder().email(email).build(); // 새 회원 객체 생성
            Cart tempCart = Cart.builder().owner(member).build(); // 새 카트 객체 생성
            cart = cartRepository.save(tempCart); // 새 카트 저장
        }else{
            cart = result.get(); // 이미 존재하는 카트 정보 사용
        }
        return cart;
    }

    @Override
    public List<CartItemListDTO> getCartItems(String email) {
        return cartItemRepository.getItemsOfCartDTOByEmail(email); // 이메일로 장바구니 아이템 리스트 조회
    }

    @Override
    public List<CartItemListDTO> remove(Long cino) {
        Long cno = cartItemRepository.getCartFromItem(cino); // 삭제할 아이템의 카트 번호 조회
        log.info("cat no : " + cno); // 로그 기록
        cartItemRepository.deleteById(cino); // 아이템 삭제

        return cartItemRepository.getItemsOfCartDTOByCart(cno); // 삭제 후 카트의 아이템 리스트 반환
    }


    @Override
    public boolean validateCartItem(Long cartItemCino, String email) {
        
        Member curMember = memberRepository.findByEmail(email);
        log.info("CartService ValidateCartItem : 여기까지통과" + cartItemCino);
        CartItem cartItem = cartItemRepository.findById(cartItemCino)
                            .orElseThrow(EntityNotFoundException::new);
        Member savedMember = cartItem.getCart().getOwner();

        if(!curMember.getEmail().equals(savedMember.getEmail())){
            return false;
        }
        log.info("Validate 다통과후 트루로 반환함");
        return true;
    }
    @Override
    public Long orderCartItem(CartOrderDTO cartOrderDTO, String email) {
        
        List<OrderDTO> orderDTOList = new ArrayList<>();
        log.info("================================="+cartOrderDTO.getCartOrderDTOList());
        log.info(cartOrderDTO.getDmemo());
        log.info(cartOrderDTO.getDname());

        
        for(CartOrderDTO cartOrderDTOs : cartOrderDTO.getCartOrderDTOList()){
            log.info("OrderCartItem => Cino  : "+cartOrderDTOs.getCino());
            CartItem cartItem = cartItemRepository.findById(cartOrderDTOs.getCino())
                                .orElseThrow(EntityNotFoundException::new);



            OrderDTO orderDTO = new OrderDTO();
            orderDTO.setProductPno(cartItem.getProduct().getPno());
            orderDTO.setCount(cartItem.getCount());
            
            orderDTOList.add(orderDTO);
            log.info("orderCartItem => 여기통과하는지 체크");
        }
        log.info("============CARTSERVICE=====================================");
        log.info(cartOrderDTO.getDmemo());
        log.info(cartOrderDTO.getDname());
        Long orderId = orderService.orders(orderDTOList, email,cartOrderDTO);
        for(CartOrderDTO cartOrderDTOs : cartOrderDTO.getCartOrderDTOList()){
            CartItem cartItem = cartItemRepository.findById(cartOrderDTOs.getCino())
                                .orElseThrow(EntityNotFoundException::new);
            cartItemRepository.delete(cartItem);
        }
        return orderId;
    }


}
