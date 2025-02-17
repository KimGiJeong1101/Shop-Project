const CustomButton = () => {
    return (
      <div className="border w-full h-40 flex items-center justify-center">
        <button className="px-5 py-2.5 relative rounded group font-medium text-white inline-block bg-gradient-to-br from-purple-600 to-blue-500">
          <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm"></span>
          <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50"></span>
          <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
          <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
          <span className="relative">Button</span>
        </button>
      </div>
    );
  };
  
  export default CustomButton;