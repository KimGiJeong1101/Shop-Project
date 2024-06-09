import React from "react";
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SearchDataList from "./SearchDataList";
import { Link } from "react-router-dom";

class SearchModal extends React.Component {
  constructor() {
    super();
    this.state = {
      keyWord: "",
      keyWordList: [],
    };
  }

  keyWordInput = e => {
    const keyword = e.target.value;
    this.setState({
      keyWord: keyword,
    });
    this.filterKeyword(keyword);
  };

  filterKeyword = keyword => {
    if (keyword === "") {
      keyword = "나이키";
    }
    // 여기에서 입력값을 URI 인코딩합니다.
    const encodedKeyword = encodeURIComponent(keyword);
    fetch(`http://192.168.219.204:8081/api/search/products?searchKeyword=${encodedKeyword}`)
      .then(res => res.json())
      .then(res =>
        this.setState({
          keyWordList: res.content,
        })
      )
      .catch(error => {
        console.error('API 호출 중 오류 발생:', error);
        // 여기에 사용자에게 에러를 알리는 로직을 추가할 수 있습니다.
      });
  };

  render() {
    return (
      <div className="fixed top-0 right-0 left-0 bottom-0 overflow-y-auto bg-gray-800 bg-opacity-50">
        <div className="flex justify-center px-40 py-4 bg-white">
          <MagnifyingGlassIcon className="h-6 w-6 mt-2" aria-hidden="true" />
          <input
            type="text"
            placeholder="상품명을 작성해주세요"
            className="w-96 h-10 ml-4 rounded-lg bg-gray-200 placeholder-gray-500 text-sm px-4 focus:outline-none"
            onChange={this.keyWordInput}
            value={this.state.keyWord}
          />
          <Link to="/"><XMarkIcon className="h-6 w-6 mt-2 ml-3" aria-hidden="true"></XMarkIcon></Link>

          {this.props.modalOn ? (
            <button className="ml-4 text-sm text-gray-700" onClick={this.props.handleSearchModal}>취소</button>
          ) : null}
        </div>
        {this.state.keyWord ? (
          <SearchDataList keyWordList={this.state.keyWordList} />
        ) : (
          <div className="bg-white">
            <div className="flex justify-center w-full h-40">
              {BRANDLIST.map(brand => (
                <Link to={brand.href} >
                  <div key={brand.id} className="w-24 h-24 ml-4 cursor-pointer hover:border-white border-2 border-gray-300 rounded-lg">
                    <img alt={brand.name} src={brand.img} className="w-full h-full rounded-lg" />
                    <p className="mt-1 text-xs">{brand.name}</p>
                  </div>
                </Link>

              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SearchModal;

const BRANDLIST = [
  {
    id: 1,
    name: "All",
    img: "/img/search/all.jpg",
    href: '/products'
  },
  {
    id: 2,
    name: "Best",
    img: "/img/search/best.png",
    href: '/products'
  },
  {
    id: 3,
    name: "Set",
    img: "/img/search/set.jpg",
    href: '/products'
  }
];
