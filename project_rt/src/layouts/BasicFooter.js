import React from 'react';
import { Link } from 'react-router-dom';

const BasicFooter = () => {
    return (
        <footer className="bg-orange-50 text-gray-700">
            <div className="container mx-auto py-7">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-9">
                    <div className="col-span-1 md:col-span-1">
                        <div>
                            <img src="/img/logo.png" alt="Logo" />
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-1">
                        <div className="text-xl mb-4">
                            <h4 className="font-bold mb-5">CUSTOMER SERVICE</h4>
                            <div className="flex items-center mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                                <p className='text-base ml-2'>070-4699-0360</p>
                            </div>

                            <p className='text-base'>
                                AM10:00 - PM 15:00
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-1">
                        <div className="text-xl mb-4">
                            <h4 className="font-bold ">INFO</h4>
                            <p className="text-xs">
                                상호. (주)벨앙주
                            </p>
                            <p className="text-xs">
                                대표자. 김현우
                            </p>
                            <p className="text-xs">
                                사업자 등록번호. 3405-838-016355[사업자정보확인]
                            </p>
                            <p className="text-xs">
                                통신판매업. 제 2026-서울-4359호
                            </p>
                            <p className="text-xs">
                                주소. 12284 경기도 가상시 가상지금로 202 (가상동) 현대한국타워DIMC BF05-0037호
                            </p>
                            <p className="text-xs">
                                개인정보보호책임자. 벨앙주 (BelleAnge@gelleange.co.kr)
                            </p>
                            <p className="text-xs">
                                고객님은 안전거래를 위해 결제 시 저희 쇼핑몰에서
                                가입한 구매안전서비스를 이용하실 수 있습니다
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-1 md:ml-10">
                        <div>
                            <h4 className="font-bold mb-4 text-xl">CONTACT US</h4>
                            <ul className=" list-inside text-sm ml-2">
                                <li><Link to={'/'}>주문조회</Link></li>
                                <li><Link to={'/'}>문의</Link></li>
                                <li><Link to={'/'}>회사소개</Link></li>
                                <li><Link to={'/'}>이용약관</Link></li>
                                <li><Link to={'/'}>개인정보처리방침</Link></li>
                                <li><Link to={'/'}>이용안내</Link></li>
                                <li><Link to={'/'}>대량구매문의</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-1">
                        <div>
                            <h4 className="font-bold mb-4 text-xl">SNS</h4>
                            <div>
                                <ul className=" list-inside text-sm">
                                    <li><Link to={'/'}>인스타그램</Link></li>
                                    <li><Link to={'/'}>유튜브</Link></li>
                                    <li><Link to={'/'}>카카오채널</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 py-4">
                <div className="container mx-auto text-center text-sm">
                    {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                    Copyright &copy;{new Date().getFullYear()} All rights reserved
                </div>
            </div>
        </footer>
    );
}

export default BasicFooter;
