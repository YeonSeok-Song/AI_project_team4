import BoardCard from '../../components/common/BoardCard';
import Helmet from '../../components/layout/Helmet';
import { useEffect, useState } from 'react';
import * as API from '../../pages/api/api';
import Link from 'next/link';

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
    <>
      <div>스터디 모집</div>
      <div className="flex flex-raw flex-wrap lg:flex justify-center">
        <Helmet title="board" />
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
      <div>
        <Link href={'/board'}>
          <button className="w-full items-center ">View All</button>
        </Link>
      </div>
    </>
  );
};

export default HomeBoardStudy;
