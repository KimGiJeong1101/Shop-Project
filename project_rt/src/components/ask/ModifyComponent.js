import { useCallback, useEffect, useState } from "react";
import { getOne, putOne, deleteOne } from "../../api/askApi";

import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";

const initState = {
    ano: '',
    title: '',
    text: '',
    writer: '',
    password: ''
}

const ModifyComponent = ({ ano, moveList, moveRead }) => {
    const [ask, setAsk] = useState(initState);
    const [result, setResult] = useState(null);
    const { moveToList, moveToRead } = useCustomMove();
    const [titleMsg, setTitleMsg] = useState(null);
    const [textMsg, setTextMsg] = useState(null);

    const handleClickModify = useCallback(() => {
        if (!ask.title) {
            setTitleMsg("제목을 입력해 주세요.");
            return;
        } else {
            setTitleMsg(null);
        }
        if (!ask.text) {
            setTextMsg("내용을 입력해 주세요.");
            return;
        } else {
            setTextMsg(null);
        }


        console.log('Submitting', ask);


        putOne(ano, ask).then(data => {
            console.log("modify result: " + data);
            setResult('Modified');
        }).catch(error => {
            console.error('수정 실패:', error);
            setResult('Modify Failed');
        });
    }, [ano, ask]);

    const handleClickDelete = useCallback(() => {
        deleteOne(ano).then(data => {
            console.log("delete result: " + data);
            setResult('Deleted');
        }).catch(error => {
            console.error('삭제 실패:', error);
            setResult('Delete Failed');
        });
    }, [ano]);

    const closeModal = useCallback(() => {
        if (result === 'Deleted') {
            moveToList();
        } else {
            moveToRead(ano);
        }
    }, [result, ano, moveToList, moveToRead]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getOne(ano);
                setAsk(data);
            } catch (error) {
                console.error('데이터 조회 실패:', error);
                // 에러 처리 로직, 예를 들어 에러 메시지 상태 설정
            }
        };
    
        fetchData();
    }, [ano]);
    

    const handleChangeAsk = useCallback((e) => {
        const { name, value } = e.target;
        setAsk(prevAsk => ({ ...prevAsk, [name]: value }));
    }, []);

    return (
        <div className="mr-2 ml-2">

            {result ? <ResultModal title={'처리결과'} content={result} callbackFn={closeModal}></ResultModal> : <></>}

            <div className="sm:col-span-5 mb-4 ml-5">
                <label htmlFor="writer" className="block text-sm font-bold leading-6 text-gray-900">
                    WRITER
                </label>
                <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-400 sm:max-w-full">
                        <input
                            className="block flex-1 border border-gray-400 rounded bg-gray-100 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            value={ask.writer}
                            readOnly
                        />
                    </div>
                </div>
            </div>
            <div className="sm:col-span-5 mb-4 ml-5">
                <label htmlFor="title" className="block text-sm font-bold leading-6 text-gray-900">
                    * TITLE
                </label>
                <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-400 sm:max-w-full">
                        <input
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            name="title"
                            type={'text'}
                            value={ask.title}
                            onChange={handleChangeAsk}
                        />
                    </div>
                    {titleMsg && <div className="error">{titleMsg}</div>}
                </div>
            </div>
            <div className="col-span-full mb-4 ml-5">
                <label htmlFor="text" className="block text-sm font-bold leading-6 text-gray-900">
                    * TEXT
                </label>
                <div className="mt-2">
                    <textarea
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                        name="text"
                        rows="4"
                        placeholder="내용을 입력해주세요"
                        onChange={handleChangeAsk}
                        value={ask.text}
                    />
                </div>
                {textMsg && <div className="error">{textMsg}</div>}
            </div>
            <div className="sm:col-span-5 mb-4 ml-5">
                <label htmlFor="password" className="block text-sm font-bold leading-6 text-gray-900">
                    PASSWORD
                </label>
                <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-400 sm:max-w-full">
                        <input
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            name="password"
                            type={'password'}
                            value={ask.password}
                            placeholder="비밀번호를 입력해주세요"
                            onChange={handleChangeAsk}
                        />
                    </div>
                </div>
            </div>
            <div className="sm:col-span-5 mb-4 ml-5">
                <div className="text-sm"> * 는 필수 입력항목입니다.<br /> 비밀 번호 입력시 비밀글이 됩니다.</div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end p-4">
                <button type="button"
                    className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100"

                    onClick={handleClickDelete}
                >
                    삭제
                </button>
                <button type="button"
                    className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100 mx-2"
                    onClick={handleClickModify}
                >
                    수정
                </button>

                <button
                    type="button"
                    className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
                    onClick={moveToList}
                >
                    목록
                </button>

            </div>
        </div>
    );
}

export default ModifyComponent;