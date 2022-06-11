import { User } from '../db'; // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { gcsBucket } from '../utils/multer';

class userAuthService {
    static async addUser({ name, email, password }) {
        // 이메일 중복 확인
        const user = await User.findByEmail({ email });
        if (user) {
            const errorMessage = '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.';
            return { errorMessage };
        }

        // 비밀번호 해쉬화
        const hashedPassword = await bcrypt.hash(password, 10);

        // id 는 유니크 값 부여
        const id = uuidv4();
        const newUser = { id, name, email, password: hashedPassword };

        // db에 저장
        const createdNewUser = await User.create({ newUser });
        createdNewUser.errorMessage = null; // 문제 없이 db 저장 완료되었으므로 에러가 없음.

        return createdNewUser;
    }

    static async getUser({ email, password }) {
        // 이메일 db에 존재 여부 확인
        const user = await User.findByEmail({ email });
        if (!user) {
            const errorMessage = '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.';
            return { errorMessage };
        }

        // 비밀번호 일치 여부 확인
        const correctPasswordHash = user.password;
        const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);
        if (!isPasswordCorrect) {
            const errorMessage = '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.';
            return { errorMessage };
        }

        // 로그인 성공 -> JWT 웹 토큰 생성
        const secretKey = process.env.JWT_SECRET_KEY || 'jwt-secret-key';
        console.log(secretKey);
        const token = jwt.sign({ user_id: user.id }, secretKey);

        // 반환할 loginuser 객체를 위한 변수 설정
        const id = user.id;
        const name = user.name;
        const description = user.description;

        const loginUser = {
            token,
            id,
            email,
            name,
            description,
            errorMessage: null,
        };

        return loginUser;
    }

    static async getUsers() {
        const users = await User.findAll();
        return users;
    }

    static async setUser({ user_id, toUpdate }) {
        // 우선 해당 id 의 유저가 db에 존재하는지 여부 확인
        let user = await User.findById({ user_id });

        // db에서 찾지 못한 경우, 에러 메시지 반환
        if (!user) {
            const errorMessage = '가입 내역이 없습니다. 다시 한 번 확인해 주세요.';
            return { errorMessage };
        }

        // 업데이트 날짜 갱신
        const date = dayjs();
        const fieldToUpdate = 'updatedAt';
        const newValue = date.format('YYYY-MM-DD HH:mm:ss');
        user = await User.update({ user_id, fieldToUpdate, newValue });

        // 업데이트 대상에 name이 있다면, 즉 name 값이 null 이 아니라면 업데이트 진행
        if (toUpdate.name) {
            const fieldToUpdate = 'name';
            const newValue = toUpdate.name;
            user = await User.update({ user_id, fieldToUpdate, newValue });
        }

        if (toUpdate.email) {
            const fieldToUpdate = 'email';
            const newValue = toUpdate.email;
            user = await User.update({ user_id, fieldToUpdate, newValue });
        }

        if (toUpdate.password) {
            const fieldToUpdate = 'password';
            const newValue = toUpdate.password;
            user = await User.update({ user_id, fieldToUpdate, newValue });
        }

        if (toUpdate.description) {
            const fieldToUpdate = 'description';
            const newValue = toUpdate.description;
            user = await User.update({ user_id, fieldToUpdate, newValue });
        }

        return user;
    }

    static async getUserInfo({ user_id }) {
        const user = await User.findById({ user_id });

        // db에서 찾지 못한 경우, 에러 메시지 반환
        if (!user) {
            const errorMessage = '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.';
            return { errorMessage };
        }

        return user;
    }

    static async updateImg({ user_id, url }) {
        const toUpdate = { profileUrl: url };
        const updatedUser = await User.updateImg({ user_id, toUpdate });

        if (!updatedUser) {
            const errorMessage = '이미지 업로드에 실패 했습니다.';
            return { errorMessage };
        }

        // gcp 기존 이미지 삭제
        if (updatedUser.profileUrl != '') {
            const url = updatedUser.profileUrl.split(`https://${process.env.GCS_BUCKET}.storage.googleapis.com/`)[1];
            gcsBucket.file(url).delete();
        }

        return updatedUser;
    }
}

export { userAuthService };
