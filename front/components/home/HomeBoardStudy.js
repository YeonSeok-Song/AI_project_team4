import { useEffect, useState } from 'react';
import Link from 'next/link';
import * as API from '../../pages/api/api';
import BoardCard from '../../components/common/BoardCard';

const HomeBoardStudy = ({ profileURL }) => {
  const [boardDatas, setBoardData] = useState();

  useEffect(() => {
    async function getBoardData() {
      try {
        const res = await API.get('memberonly/studyrooms');
        setBoardData(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getBoardData();
  }, []);

  return (
    <div class="mb-20">
      <div class="px-10 md:px-15 lg:px-20 font-bold text-2xl text-gray-800">
        스터디 모집
        <div class="border-none bg-indigo-500 w-20 h-1 mt-2 rounded text-xm"></div>
      </div>
      <div className="flex flex-raw flex-wrap lg:flex justify-center">
        {boardDatas &&
          boardDatas.slice(0, 3).map((boardData, index) => {
            return (
              <BoardCard
                key={index}
                boardData={boardData}
                profileURL={profileURL}
              />
            );
          })}
      </div>
      <div className="flex items-center justify-center w-full">
        <Link href={'/board'}>
          <button class="bg-gray-700 text-white font-bold rounded-full px-10 py-3">
            View All
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomeBoardStudy;
