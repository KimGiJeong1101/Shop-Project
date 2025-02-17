import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { orderState } from '../../atoms/orderState';

export function OrderSuccessComponent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orders = useRecoilValue(orderState);

  
  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      customerEmail: searchParams.get("customerEmail"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
      status : searchParams.get("status")
      // "status": "DONE"
    };

    async function confirm() {
      const response = await fetch("/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        // 결제 실패 비즈니스 로직을 구현하세요.
        navigate(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      // 결제 성공 비즈니스 로직을 구현하세요.
    }
    confirm();
  }, []);

  return (
    
    <div className="w-full flex justify-center items-center p-2 border-2">
    <div className="result wrapper">
      <div className="box_section">
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold">결제 완료</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">주문이 완료되었습니다</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">{`주문번호: 003`}</p>
          <p className="text-gray-600">{`결제 금액: ${Number(
          searchParams.get("amount")
        ).toLocaleString()}원`}</p>
        <p className="text-gray-600">{`결제 번호(paymentKey): ${searchParams.get("paymentKey")}`}</p>
        <p className="text-gray-600">{`결제 상태(status): 결제 완료`}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-y-4">
            <a
              href="/products/list"
              className="flex items-center justify-center rounded-md border border-transparent bg-orange-100 px-6 py-3 text-base font-medium text-gray-600 shadow-sm hover:bg-orange-200 h-12"
            >
              쇼핑 계속하기
            </a>
            <a href="/" className="text-sm font-semibold text-gray-900">
              메인 페이지로 <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
      </div>
    </div>
    </div>
  );
}
