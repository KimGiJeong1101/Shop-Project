import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { API_SERVER_HOST } from "../../api/todoApi";
import { cartTotalState } from "../../atoms/cartState";
import { orderState } from "../../atoms/orderState";
import useCustomCart from "../../hooks/useCustomCart";
import useCustomLogin from "../../hooks/useCustomLogin";

const host = API_SERVER_HOST;

const CartComponent = () => {

  const { isLogin, loginState } = useCustomLogin();
  const { cartItems, changeCart } = useCustomCart();
  const totalValue = useRecoilValue(cartTotalState);
  const [order, setOrder] = useRecoilState(orderState); // Recoil 상태를 사용
  const deliveryFee = totalValue === 0 || totalValue >= 30000 ? 0 : 3000; // 배송비 설정
  const navigate = useNavigate();


  const handleClickCount = (item, amount, chprice) => {
    changeCart({ email: loginState.email, cino: item.cino, pno: item.pno, count: item.count + amount, price: item.price + chprice });
  };

  const handleContinueShopping = () => {
    window.history.back(); // 이전 페이지로 이동
  };

  const handleClickOrder = () => {
    setOrder(cartItems.map(item => ({
      productPno: item.pno,
      pname: item.pname,
      price: item.price,
      count: item.count,
      images: [item.imageFile],
      cino: item.cino,
    })));
    navigate('/order')
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full ">
        {isLogin ? (
          <div className="bg-white  flex flex-col">
            <div>
              <div className="flex justify-center mb-4">
                <h1 className="text-4xl font-bold mx-2">CART</h1>
              </div>
              <div className="max-w-4xl mx-auto mb-5">
                {totalValue > 0 && (
                  <div className="flex justify-end mb-5">
                    <h2 className="text-base font-medium text-gray-900">{loginState.nickname}님🛒</h2>
                  </div>
                )}

                <div className="flex justify-center items-center">
                  {totalValue === 0 && (
                    <p>
                      <img src='https://khabi777.cafe24.com/SG/img/cart_img_empty.gif' alt="장바구니가 비어있습니다" style={{ display: "block", margin: "auto" }} />
                    </p>
                  )}
                </div>

                {cartItems.map((item) => (
                  <div key={item.cino} className="bg-white shadow overflow-hidden rounded-lg flex items-center mb-2" style={{ width: "100%" }}>
                    <div className="w-1/4 h-auto object-cover cursor-pointer" style={{ height: "250px" }} onClick={() => window.location.href = `/products/read/${item.pno}`}>
                      <img src={`${host}/api/products/view/${item.imageFile}`} alt={item.pname} className="w-full h-full" />
                    </div>
                    <div className="w-3/4 px-4 py-2">
                      <h3 className="text-lg font-medium text-gray-900 cursor-pointer" onClick={() => window.location.href = `/products/read/${item.pno}`}>상품명 : {item.pname}</h3>
                      <p className="mt-5 text-sm text-gray-500">금액 : {item.price.toLocaleString()}원</p>
                      <p className="mt-5 text-sm text-gray-900">수량 : {item.count}</p>
                      <div className="mt-3 flex">
                        <button
                          className="m-1 p-1 text-2xl w-8 rounded-lg text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => handleClickCount(item, 1, 1000)}
                        >
                          +
                        </button>
                        <button
                          className="m-1 p-1 text-2xl w-8 rounded-lg text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => handleClickCount(item, -1, -1000)}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => handleClickCount(item, -item.count)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 mt-10 py-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>상품구매금액</p>
                  <p>{totalValue.toLocaleString()} 원</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Product purchase amount</p>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>배송비 </p>
                  <p>{(deliveryFee).toLocaleString()}원</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Delivery cost (30,000원 이상 구매시 무료배송) </p>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>결제예정금액</p>
                  <p>{(totalValue + deliveryFee).toLocaleString()} 원</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Delivery cost</p>
                <div className="mt-6">
                  <a
                    href="#"
                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    onClick={handleClickOrder}>
                    주문하기
                  </a>
                  <a
                    href="/products/list"
                    className="mt-2 flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-6 py-3 text-base font-medium text-indigo-600 shadow-sm hover:bg-indigo-200"
                  >
                    쇼핑 계속하기
                  </a>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    {/* or{" "} */}
                    <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500" onClick={handleContinueShopping}>
                      이전 페이지로
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white flex flex-col" >
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-grow">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900"> 로그인이 필요합니다 </h2>
              </div>
            </div>
          </div>

        )}
      </div>
    </div>
  );
};

export default CartComponent;