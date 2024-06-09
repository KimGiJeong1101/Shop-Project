package com.belleange.mall.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.belleange.mall.domain.CartItem;
import com.belleange.mall.dto.CartItemListDTO;


public interface CartItemRepository extends JpaRepository<CartItem, Long>{

  @Query("select " + 
  " new com.belleange.mall.dto.CartItemListDTO(ci.cino,  ci.count,  p.pno, p.pname, p.price , pi.fileName )  " +
  " from " +
  "   CartItem ci inner join Cart mc on ci.cart = mc " +
  "   left join Product p on ci.product = p " +
  "   left join p.imageList pi" +
  " where " +
  "   mc.owner.email = :email and pi.ord = 0 " +
  " order by ci desc ")
  public List<CartItemListDTO> getItemsOfCartDTOByEmail(@Param("email") String email);
//로그인했을때 사용자가 담은 모든 장바구니 아이템 조회 시에 사용
  @Query("select" +
  " ci "+
  " from " + 
  "   CartItem ci inner join Cart c on ci.cart = c " + 
  " where " +
  "   c.owner.email = :email and ci.product.pno = :pno")
  public CartItem getItemOfPno(@Param("email") String email, @Param("pno") Long pno );
//새로운 상품을 장바구니에 담고자 할 때 기존 장바구니 아이템인지 확인하기 위해 필요
  @Query("select " + 
  "  c.cno " +
  "from " +
  "  Cart c inner join CartItem ci on ci.cart = c " +
  " where " +
  "  ci.cino = :cino")
  public Long getCartFromItem( @Param("cino") Long cino);
  //해당 아이템을 삭제한 후 해당 아이템이 속해 있는 장바구니의 모든 아이템을 알아내기 위해서 필요

    @Query("select new com.belleange.mall.dto.CartItemListDTO(ci.cino,  ci.count,  p.pno, p.pname, p.price , pi.fileName )  " +
  " from " + 
  "   CartItem ci inner join Cart mc on ci.cart = mc " +
  "   left join Product p on ci.product = p " +
  "   left join p.imageList pi" +
  " where " + 
  "  mc.cno = :cno and pi.ord = 0 " + 
  " order by ci desc ")
  public List<CartItemListDTO> getItemsOfCartDTOByCart(@Param("cno") Long cno);
 //특정한 장바구니 아이템을 삭제한 후에 해당 장바구니 아이템이 속해 있는 장바구니의 모든 장바구니 아이템을
 // 조회할 때 필요
}
