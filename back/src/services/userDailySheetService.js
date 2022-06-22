import { User, UserDailySheet } from '../db';
import dayjs from 'dayjs';
import { ChangeDate } from '../utils/changeDate';
import { scheduleJob } from 'node-schedule';
import { analyzeDate } from '../utils/analyzeDate';

const job = scheduleJob('0 0 5 * * * ', () => UserDailySheetService.createSheets());

class UserDailySheetService {
    // 5시 마다 새로운 데일리 시트 만들기
    static async createSheets(date = undefined) {
        // 날짜 가져오기
        const now = dayjs();
        let today = now.format('YYYY-MM-DD');
        let yesterday = now.add(-1, 'day').format().slice(0, 10);
        if (date) {
            const dateThatInsert = dayjs(date);
            today = dateThatInsert.format('YYYY-MM-DD');
            yesterday = dateThatInsert.add(-1, 'day').format().slice(0, 10);
        }
        // 유저 데일리 시트에 있는 최근 목표 공부 시간을 가져와서 배열로 만들어야 함
        const userSheets = await UserDailySheet.getSheetsFromDate({ yesterday });
        if (userSheets === []) {
            const errorMessage = '새로 데일리 시트를 만들 때 필요한 전날 데일리 시트 데이터가 없습니다.';
            return { errorMessage };
        }

        const newSheets = userSheets.map((sheet) => {
            const { id, timeGoal } = sheet;
            // console.log(timeGoal);
            if (timeGoal === '00:00:00') {
                return {
                    id,
                    date: today,
                    timeGoal,
                    achievementRate: 100,
                    studyTimeADay: ' ',
                    bestStudyTime: ' ',
                    beginStudyTime: ' ',
                    finishStudyTime: ' ',
                };
            } else {
                return {
                    id,
                    date: today,
                    timeGoal,
                    achievementRate: 0,
                    studyTimeADay: ' ',
                    bestStudyTime: ' ',
                    beginStudyTime: ' ',
                    finishStudyTime: ' ',
                };
            }
        });
        UserDailySheet.addSheets(newSheets);
        return '금일 사용자 데일리 시트가 성공적으로 생성 되었습니다.';
    }

    // 공부로그req가 들어오면 동시에 해당 사용자 데일리 시트도 업데이트하기
    static async updateSheet({ newLog }) {
        const { id, startTime, endTime, studyTimeNum, studyTimeStr } = newLog;

        const date = ChangeDate.getCurrentDate(startTime);
        const getSheet = await UserDailySheet.getSheet({ id, date });
        const { timeGoal, beginStudyTime } = getSheet;

        // 금일 데일리 시트에 아무 정보도 없는 상태일 때
        if (beginStudyTime === ' ') {
            const beginStudyTime = startTime;
            const finishStudyTime = endTime;
            const studyTimeADay = studyTimeStr;
            const bestStudyTime = studyTimeStr;
            const achievementRate = 0;

            const updatedSheet = await UserDailySheet.updateSheet({ id, date, beginStudyTime, finishStudyTime, studyTimeADay, bestStudyTime, achievementRate });
            return updatedSheet;
        }

        // 금일 데일리 시트에 정보가 있는 경우
        const prevStudyTimeNum = ChangeDate.toMilliseconds(getSheet.studyTimeADay);
        const bestStudyTimeNum = ChangeDate.toMilliseconds(getSheet.bestStudyTime);

        const finishStudyTime = endTime;
        const studyTimeADayNum = prevStudyTimeNum + studyTimeNum;
        const studyTimeADay = ChangeDate.toStringTime(studyTimeADayNum);
        const bestStudyTime = ChangeDate.toStringTime(Math.max(studyTimeNum, bestStudyTimeNum));

        let achievementRate = undefined;
        if (timeGoal === '아직 목표 공부시간을 설정하지 않았습니다.') {
            achievementRate = 0;
        } else if (timeGoal === '00:00:00') {
            achievementRate = 100;
        } else {
            const timeGoalNum = ChangeDate.toMilliseconds(timeGoal);
            achievementRate = Number((studyTimeADayNum / timeGoalNum) * 100).toFixed(2);
        }

        if (achievementRate > 100) {
            achievementRate = 100;
        }

        const updatedSheet = await UserDailySheet.updateSheet({ id, date, beginStudyTime, finishStudyTime, studyTimeADay, bestStudyTime, achievementRate });
        return updatedSheet;
    }

    static async getSheets({ id }) {
        const getSheets = await UserDailySheet.getSheets({ id });
        return getSheets;
    }

    static async getSheetsForCal({ id }) {
        const getSheets = await UserDailySheet.getSheets({ id });

        const total = analyzeDate.avgAndSum(getSheets);
        const totalAchievementRate = total.rate;
        const totalStudyTime = total.time;

        const weekSheets = analyzeDate.weekPeriod(getSheets);
        const week = analyzeDate.avgAndSum(weekSheets);
        const weekAchievementRate = week.rate;
        const weekStudyTime = week.time;

        const now = ChangeDate.getCurrentDate();
        const todaySheet = getSheets.filter((sheet) => sheet.date === now);
        let studyTimeADay = todaySheet[0].studyTimeADay;
        if (!studyTimeADay) {
            const errorMessage = '금일 시트를 찾을 수 없습니다.';
            return errorMessage;
        } else if (studyTimeADay === ' ') {
            studyTimeADay = '00:00:00';
        }

        // console.log(total, week);

        return { totalAchievementRate, totalStudyTime, weekAchievementRate, weekStudyTime, studyTimeADay };
    }

    static async updateTimeGoal({ id, timeGoal }) {
        const date = ChangeDate.getCurrentDate();
        const getSheet = await UserDailySheet.getSheet({ id, date });
        if (!getSheet) {
            const errorMessage = '해당 유저의 데일리 시트를 가져오지 못했습니다.';
            return errorMessage;
        }
        const { studyTimeADay } = getSheet;

        // 목표 달성률 계산
        const timeGoalNum = ChangeDate.toMilliseconds(timeGoal);
        const studyTimeADayNum = ChangeDate.toMilliseconds(studyTimeADay);
        let achievementRate = ((studyTimeADayNum / timeGoalNum) * 100).toFixed(2);

        if (achievementRate > 100) {
            achievementRate = 100;
        }
        if (timeGoal === '00:00:00') {
            achievementRate = 100;
        }

        const updatedGoal = await UserDailySheet.updateTimeGoal({ id, date, timeGoal, achievementRate });

        if (!updatedGoal) {
            const errorMessage = '목표 공부 시간을 업데이트 하지 못했습니다.';
            return errorMessage;
        }

        return updatedGoal;
    }
}

export { UserDailySheetService };
