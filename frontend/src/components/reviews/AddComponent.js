import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCustomMove from "../../hooks/useCustomMove";
import { postAdd } from "../../api/reviewApi";
import FetchingModal from "../common/FetchingModal";
import ResultModal from "../common/ResultModal";
import { useRecoilValue } from "recoil";
import signinState from "../../atoms/signinState";

const AddComponent = ({ pno, goBack, serverData }) => {

    const initState = {
        rno: 0,
        reviewContent: "",
        grade: 0,
        pno: 0,
        email: "",
        nickname: "",
        regdate: "",
        modDate: ""
    }

    const userInfo = useRecoilValue(signinState)

    const [review, setReview] = useState({ ...initState, pno:pno })
    const uploadRef = useRef()
    const [fetching, setFetching] = useState(false); 
    const [result, setResult] = useState(null);
    const { moveToList } = useCustomMove();
    const navigate = useNavigate();

    console.log(userInfo)

    const [selectedRating, setSelectedRating] = useState(null);
    const handleStarHover = (rating) => {
        setSelectedRating(rating);
    }
    const handleStarClick = (rating) => {
        setSelectedRating(rating);
        setReview(prev=>({...prev,grade:rating}))
        console.log('Selected Rating:', rating);
    };


    const handleChangeReview = (e) => {
        review[e.target.name] = e.target.value

        setReview({ ...review })
    }

    const handleChangeFile = (event) => {
        const reviewfiles = Array.from(event.target.reviewfiles); // 파일 리스트를 배열로 변환
        setReview(prev => ({ ...prev, [event.target.name]: reviewfiles }));
    };

    const closeModal = (e) => {
        setResult(null);
        moveToList({ page: 1 });
    };

    const handleClickAdd = () => {
        postAdd(pno,review).then(result=>{
            console.log(result)
            setResult(result.rno)
            setReview({...initState})
        }).catch(e=>{
            console.error(e)
        })
    }

    return (
        <div className="w-full flex justify-center items-center">
            <div className="w-4/6 mx-auto border-0 mt- m-2 p-2">
                {fetching ? <FetchingModal /> : null}

                {result ?
                    <ResultModal
                        title={'Review 등록'}
                        content={`${result}번 등록 완료`}
                        callbackFn={closeModal}
                    />
                    : null
                }

                <div className="sm:col-span-3">


                    <div className="flex flex-wrap justify-between items-center mt-4">
                        구매하신 상품은 어떠셨나요?
                    </div>
                    <div className="flex flex-wrap justify-between items-center mt-4">

                    </div>
                </div>

                <div className='text-center py-20'>
                    <p>평점을 남겨주세요</p>
                    <div className='flex justify-center items-center'>
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <svg xmlns="http://www.w3.org/2000/svg" fill={(selectedRating && rating <= selectedRating) ? 'orange' : 'lightgray'} viewBox="0 0 24 24" strokeWidth="2" stroke="" className="w-8 h-8 mt-2 flex"
                                onMouseEnter={() => handleStarHover(rating)} onClick={() => handleStarClick(rating)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                        ))}
                    </div>
                </div>


                <div className="flex flex-wrap justify-between items-center mt-4">
                    <input
                        readOnly
                        type="text"
                        name="pno"
                        value={pno} 번 상품
                        onChange={handleChangeReview}
                        className="block w-full rounded-md mb-1 p-4 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-md"
                    />
                </div>

                <div className="flex flex-wrap justify-between items-center mt-4">
                    <input
                        placeholder="이메일 입력하세요" /* 나중엔 닉네임 */
                        type="text"
                        name="email"
                        value={review.email}
                        onChange={handleChangeReview}
                        className="block w-full rounded-md mb-1 p-4 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-md"
                    />
                </div>


                <div className="sm:col-span-3">
                    <div className="flex flex-wrap justify-between items-center">
                        <textarea
                            placeholder="구매하신 상품은 어떠셨나요?"
                            type="text"
                            name="reviewContent"
                            rows="6"
                            value={review.reviewContent}
                            onChange={handleChangeReview}
                            className="block w-full rounded-md mb-1 p-4 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-md resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
                        <button className=" m-2 rounded-md bg-indigo-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                            onClick={handleClickAdd}>
                            리뷰 등록
                        </button>
                        <button className=" m-2 rounded-md bg-indigo-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                            onClick={goBack}>
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddComponent;