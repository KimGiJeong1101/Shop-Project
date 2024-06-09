import React from "react";
import { Link } from "react-router-dom";
import { API_SERVER_HOST } from "../../api/todoApi";

const host = API_SERVER_HOST;

class SearchDataList extends React.Component {
  render() {
    const { keyWordList } = this.props;
    return (
      <div className="w-full border-t border-solid border-lightgray bg-white">
        {keyWordList && keyWordList.length === 0 ? (
          <div className="flex items-center justify-center text-sm text-gray-600 p-4">
            검색결과가 없습니다.
          </div>
        ) : (
          <div className="p-16.5 pb-46">
            {keyWordList && keyWordList.map(data => (
              <Link to={`/products/read/${data.pno}`} key={data.pno}>
                <div key={data.pno} className="flex p-6.5 pl-20 items-center border-b border-solid border-gray-300">
                  <div>
                    <img 
                      className="w-30 h-30 rounded-8"
                      src={data.imageList && data.imageList.length > 0 ? `${host}/api/products/view/${data.imageList[0].fileName}` : '/path/to/default/image.jpg'} 
                      alt={data.pname || '제품 이미지'} 
                      width="80" 
                      height="80"
                    />
                  </div>
                  <div className="ml-4">
                    <div>{data.pname}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default SearchDataList;
