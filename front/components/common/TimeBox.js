import { randomColor } from '../common/UseData';

export default function TimeBox({ timeData, index, timeGoal }) {
  const title = ['오늘 공부 시간', '이번주 공부 시간', '전체 공부 시간'];
  const color = randomColor[Math.round((Math.random() * 15) % 14)];
  return (
    <div
      className={`${color} rounded-[50px] w-[320px] h-[130px] space-x-3 mt-[30px]`}
    >
      <div className="font-bold pt-[10px] text-center">{title[index]}</div>
      <div className="text-center text-5xl pt-[10px]">{timeData}</div>
      {index === 0 ? (
        timeGoal === '아직 목표 공부시간을 설정하지 않았습니다.' ? (
          <span className="block text-center text-slate-500 text-lg mt-[5px]">
            목표 공부 시간:00:00:00
          </span>
        ) : (
          <span className="block text-center text-slate-500 text-lg mt-[5px]">
            목표 공부 시간:{timeGoal}
          </span>
        )
      ) : (
        <></>
      )}
    </div>
  );
}
