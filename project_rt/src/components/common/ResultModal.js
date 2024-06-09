const ResultModal = ( {title,content, callbackFn} ) => {
    return ( 
      <div 
      className={`fixed top-0 left-0 z-[1055] flex h-full w-full  justify-center bg-black bg-opacity-20`}  
      onClick={() => {
        if(callbackFn) {
          callbackFn()
        }
      }}>
        <div 
        className="absolute bg-white shadow dark:bg-amber-50 opacity-100 w-1/4 rounded  mt-10 mb-10 px-6 min-w-[600px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-8 text-[#059669] mx-auto h-11 rounded-full bg-[#D1FAE5] w-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 13l4 4L19 7" />
              </svg>
          <div className="justify-center bg-warning-400 mt-6 mb-6 text-2xl text-center items-center">
            {title}
          </div>
          <div className="text-4xl pt-4 pb-4 text-center">
            {content}
          </div>
          <div className="justify-end flex ">
            <button 

            className="p-3 bg-[#4F46E5] rounded-lg w-full text-white m-4" 
            onClick={() => {
              if(callbackFn) {
                callbackFn()
              }
            }}>Close Modal</button>
          </div>
        </div>
      </div>  
     );
  }
  export default ResultModal;
