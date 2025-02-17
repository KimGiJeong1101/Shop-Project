import { useState } from "react";

const PasswordCheckModal = ({ moveToRead, listData, selectAno, show, onClose }) => {
/*     console.log(moveToRead);
    console.log(listData);
    console.log(listData.dtoList.password); */

    /* 알림 메시지를 위한 state */
    const [error, setError] = useState("");
    /* 유저에게 입력받은 비밀번호486 */
    const [userPassword, setUserPassword] = useState("");
    /* 4자리 확인을 위한 state */
    const [enter, setEnter] = useState("");

    /* 비밀번호 4자리 확인 */
    const handleSubmit = (e) => {
        const value = e.target.value;
        setUserPassword(value);
        if (value.length !== 4) {
            setError("비밀번호는 4자리 입니다.");
        } else {
            setError(""); /* 에러메시지 초기화 */
        }
    }

    /* 선택된 게시글의 server password와 입력받은 값의 비교.
    일치한다면 상세보기. 아니라면 알림창 */
    const handleConfirmPw = () => {
        const selectPassword = listData.dtoList.find(post => post.ano === selectAno);
        if (selectPassword && selectPassword.password === userPassword) {
            console.log("네 놈 금도끼, 은도끼도 가져가거라");
            moveToRead(selectAno);
        } else {
            console.log("네 놈은 아주 괘씸하구나!");
            alert("비밀번호를 다시 입력해보세요");
        }
    };


    return (
        <div className={`fixed top-0 left-0 z-[1055] flex h-full w-full  place-items-center justify-center bg-black bg-opacity-20`}
            /* onClick={onClose} */>
            <div className="absolute bg-white shadow dark:bg-gray-700 opacity-100 w-1/4 rounded  mt-10 mb-10 px-6 min-w-[600px]">

                <div className="justify-center bg-warning-400 mt-6 mb-6 text-2xl border-b-4 border-white text-white">
                </div>

                <div className="pl-6">
                    <input className="text-4xl  border-orange-300 border-b-4 pt-1 pb-1"
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        value={userPassword}
                        onChange={handleSubmit}
                    ></input>
                </div>


                <div className="justify-end flex p-1 ">
                    <div className="pr-5">
                    <button className="rounded bg-orange-500 mt-4 mb-4 px-6 pt-4 pb-4 text-lg text-white"
                        onClick={handleConfirmPw}>
                        확인
                    </button>
                    </div>
                    <div>
                    <button
                        className="rounded bg-orange-500 mt-4 mb-4 px-6 pt-4 pb-4 text-lg text-white"
                    onClick={onClose}
                    >닫기</button>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default PasswordCheckModal;