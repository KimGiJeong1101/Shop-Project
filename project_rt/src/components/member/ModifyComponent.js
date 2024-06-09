import { useEffect, useState } from "react";
import useCustomLogin from './../../hooks/useCustomLogin';
import { modifyMember } from "../../api/memberApi";
import ResultModal from './../common/ResultModal';
import { useRecoilState, useRecoilValue } from "recoil";
import signinState from "../../atoms/signinState";
import FetchingModal from "../common/FetchingModal";
import { Link } from "react-router-dom";




const ModifyComponent = () => {

    const [member, setMember] = useRecoilState(signinState);

    const { moveToLogin } = useCustomLogin();

    const [result, setResult] = useState();

    const [fetching, setFetching] = useState(false);

    const signin = useRecoilValue(signinState);


    const handleAddressSearch = () => {

        console.log("잘 눌리는지 확인")


        new window.daum.Postcode({
            oncomplete: function (data) {
                // 주소 입력 처리
                setMember(prevState => ({
                    ...prevState,
                    useraddress: data.address // 카카오 API에서 반환된 주소를 useraddress1으로 설정
                }));
                // 상세 주소 입력란에 자동 포커싱
                document.querySelector("input[name='detailaddress']").focus();
            }

        }).open();

    };



    useEffect(() => {
        setMember(prevMember => ({
            ...prevMember,
            pw: '',
            phone: prevMember.phone || '', // null 값 대체
            birth: prevMember.birth || '' // null 값 대체
        }));
    }, [setMember]);


    useEffect(() => {
        const formatBirthDate = birth => {
            return [birth.slice(0, 4), birth.slice(4, 6), birth.slice(6, 8)].join('-');
        };

        setMember(prevMember => ({
            ...prevMember,
            birth: formatBirthDate(prevMember.birth)
        }));
    }, [setMember]);

    const handleChange = (e) => {

        let { name, value } = e.target;

        setMember(prevState => {
            let updatedValues = { ...prevState, [name]: value };

            return updatedValues;
        });


    }

    const handleClickModify = (e) => {


        e.preventDefault(); // 페이지 리로드 방지


        if (member.pw === '' || member.pw.length < 0) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        if (member.pw.length > 20) {
            alert('비밀번호가 너무 깁니다.');
            return;
        }

        if (member.nickname === '소셜회원') {
            alert('닉네임을 변경해주세요.');
            return;
        }


        if (!member.phone) {
            alert('전화번호를 입력해주세요.');
            return;
        }

        if (!member.phone.startsWith('01')) {
            alert('올바른 전화번호를 입력해주세요.');
            return;
        }
        if (member.phone.length < 10) {
            alert('전화번호는 10자리 이상이어야 합니다.');
            return;
        }
        if (!/^\d+$/.test(member.phone)) {  // 정규표현식을 사용하여 숫자만 있는지 검사
            alert('전화번호는 숫자만 입력해야 하며, "-"는 포함하지 않습니다.');
            return;
        }





        if (member.birth === "") {
            alert('생년월일을 입력해주세요.');
            return;
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(member.birth)) {
            alert('생년월일 형식이 잘못되었습니다. yyyy-mm-dd 형식으로 입력해주세요.');
            return;
        } else {
            const [year, month, day] = member.birth.split('-').map(Number);
            if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
                alert('올바른 날짜 형식이 아닙니다. 생년월일을 다시 확인해주세요.');
                return;
            }
        }


        const inputDate = new Date(member.birth);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // 시, 분, 초, 밀리초를 0으로 설정하여 날짜만 비교

        if (inputDate > currentDate) {
            alert('입력하신 날짜가 현재 날짜를 초과합니다. 생년월일을 다시 확인해주세요.');
            return;
        }


        if (!member.useraddress || member.useraddress.length === 0) {
            alert('주소를 입력해주세요.');
            return;
        }
        if (!member.detailaddress || member.detailaddress.length === 0) {
            alert('상세주소를 입력해주세요.');
            return;
        }

        // 날짜 형식 변환
        const formattedBirth = member.birth.replace(/-/g, ''); // yyyy-mm-dd를 yyyymmdd로 변환

        // 멤버 객체 복사 후 birth 수정
        const modifiedMember = {
            ...member,

            birth: formattedBirth
        };

        setFetching(true);
        modifyMember(modifiedMember).then(result => {
            setFetching(false);
            setResult('Modified');
        }).catch((error) => {
            console.error('Modify failed:', error);
            setFetching(false);
        });
    }

    const colseModal = () => {
        setResult(null);
        moveToLogin();
    }



    return (

        <>
            <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                {fetching ? <FetchingModal /> : <></>}

                {result ?
                    <ResultModal title={'회원정보'} content={'정보수정완료'} callbackFn={colseModal}></ResultModal>
                    : <></>}
                <div>
                    <Link to="/" className="-m-1.5 p-1.5">
                        <img
                            className="mx-auto h-10 w-auto"
                            src="/img/logo.png"
                            alt="Your Company"
                        />
                    </Link>
                    {signin.social ?
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-2">소셜로그인</h2>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl mt-2">정보수정</h2>

                        </div>
                        :
                        <div className="mx-auto max-w-2xl text-center">

                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl mt-2">회원정보수정</h2>

                        </div>

                    }

                </div>

                <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                                Email
                            </label>
                            <div className="mt-2.5">
                                <input className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    name="email"
                                    type="text"
                                    value={member.email}
                                    readOnly>
                                </input>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="password" className="block text-sm font-semibold leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="mt-2.5">
                                <input
                                    name="pw"
                                    type="password"
                                    value={member.pw}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="nickname" className="block text-sm font-semibold leading-6 text-gray-900">
                                NickName
                            </label>
                            <div className="mt-2.5">
                                <input
                                    name="nickname"
                                    type="text"
                                    value={member.nickname}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                Phone number
                            </label>
                            <div className="mt-2.5">
                                <input
                                    name="phone"
                                    type={'text'}
                                    value={member.phone}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="address" className="block text-sm font-semibold leading-6 text-gray-900">
                                BIRTH
                            </label>
                            <div className="mt-2.5">
                                <input
                                    name="birth"
                                    type="date"
                                    value={member.birth}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="address" className="block text-sm font-semibold leading-6 text-gray-900">
                                Address
                            </label>
                            <div className="mt-2.5">
                                <input
                                    name="useraddress"
                                    type="text"
                                    onClick={handleAddressSearch}
                                    onChange={handleChange}
                                    value={member.useraddress} // joinParam 상태를 사용
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="detailaddress" className="block text-sm font-semibold leading-6 text-gray-900">
                                Detail Address
                            </label>
                            <div className="mt-2.5">
                                <input
                                    name="detailaddress"
                                    type="text"
                                    onChange={handleChange}
                                    value={member.detailaddress} // joinParam 상태를 사용
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                    </div>
                    <div className="mt-10">
                        <button
                            onClick={handleClickModify}
                            className="block w-full rounded-md bg-orange-300 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            수정 완료
                        </button>
                    </div>
                </form>
            </div>
        </>
    )

}


export default ModifyComponent;