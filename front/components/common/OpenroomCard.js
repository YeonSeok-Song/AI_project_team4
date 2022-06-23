import { useEffect } from 'react';

export default function OpenroomCard({ openRoom }) {
  return (
    <div className=" px-2 py-16 mx-auto sm:max-w-xl  md:px-12 lg:px-8 py-20">
      <div className="grid gap-5 sm:max-w-sm sm:mx-auto">
        <div className="bg-gray-300 h-[300px] w-[250px] rounded-xl overflow-hidden transition-shadow duration-300 bg-white rounded">
          <a href="/board/detail" aria-label="Article">
            <p className="mt-3 ml-2 font-bold text-orange-300">
              {openRoom.members.length + '/' + openRoom.membersNum}
            </p>
            <div className="mt-[130px] ml-2">
              <img
                className="h-[60px] w-[60px] rounded-full"
                src="img.jpeg"
                alt="Rounded avatar"
              />
            </div>
            <div className="mt-3 ml-2">
              <a
                href="/board/detail"
                aria-label="Article"
                className="inline-block mb-3 text-black transition-colors duration-200 hover:text-deep-purple-accent-700"
              >
                <p className="text-2xl font-bold leading-5">
                  {openRoom.roomName}
                </p>
              </a>
              <p className="mb-4 font-semibold text-gray-700">
                {openRoom.focusTimeStart.slice(0, 5) +
                  '~' +
                  openRoom.focusTimeEnd.slice(0, 5)}
              </p>
              <div className="flex space-x-4"></div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
