import { useRecoilState, useSetRecoilState } from 'recoil';
import { editUserModalAtom } from '../../core/atoms/modalState';
import { userAtom } from '../../core/atoms/userState';
import * as API from '../../pages/api/api';

const EditUser = () => {
  const setShowModal = useSetRecoilState(editUserModalAtom);
  const [user, setUser] = useRecoilState(userAtom);

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await API.put(`user/${user.id}`, {
      name: user.name,
      description: user.description,
    });
    const updatedUser = await res.data;
    setUser(updatedUser);
    setShowModal(false);
  };

  const handleNameChange = (e) => {
    setUser((prev) => {
      return { ...prev, name: e.target.value };
    });
  };

  const handleDescriptionChange = (e) => {
    setUser((prev) => {
      return { ...prev, description: e.target.value };
    });
  };

  return (
    <div>
      <div className="my-2">
        <label className="block mb-2 text-base font-medium text-gray-900 dark:text-gray-300">
          이름
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="이름을 입력해주세요"
          value={user.name}
          onChange={handleNameChange}
        />
        <p
          id="helper-text-explanation"
          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          스터디원들에게 보여지는 정보입니다.
        </p>
      </div>
      <div>
        <label
          for="message"
          class="block mb-2 text-base font-medium text-gray-900 dark:text-gray-400"
        >
          한 줄 소개
        </label>
        <textarea
          id="message"
          rows="4"
          class="block p-2.5 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Leave a comment..."
          value={user.descriptiion}
          onChange={handleDescriptionChange}
        ></textarea>
      </div>
      <div>
        <button className="text-white py-2 px-4 mt-3 uppercase rounded bg-indigo-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition duration-200">
          회원탈퇴
        </button>
        <p
          id="helper-text-explanation"
          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          탈퇴 시 계정과 관련된 모든 정보가 삭제되며 복구되지 않습니다.
        </p>
      </div>
      <div className="flex flex-row justify-center space-x-2">
        <button
          type="submit"
          className="text-white py-2 px-4 my-1 uppercase rounded bg-indigo-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition duration-200"
          onClick={submitHandler}
        >
          수정
        </button>
        <button
          className="text-indigo-500 hover:text-white py-2 px-4 my-1 uppercase rounded border border-indigo-500 bg-white hover:bg-indigo-500 shadow hover:shadow-lg font-medium transition duration-200"
          onClick={() => setShowModal(false)}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default EditUser;
