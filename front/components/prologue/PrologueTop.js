import Link from 'next/link';
const PrologueTop = () => {
  return (
    <div>
      <div className="w-full bg-center bg-cover h-screen bg-[url('https://inews.ewha.ac.kr/news/photo/202109/33069_10785_4858.jpg')]">
        <div className="flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white uppercase lg:text-3xl">
              Study with <span className="text-blue-400 underline">AI</span>
            </h1>

            <button className="w-full px-4 py-2 mt-4 text-sm font-medium text-white uppercase transition-colors duration-200 transform bg-blue-600 rounded-md lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
              <Link href="/studyroom/private">
                <a>Start AI Study!</a>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrologueTop;
