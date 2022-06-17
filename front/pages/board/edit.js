const boardEdit = () => {
  return (
    <div>
      <form id="boardEdit">
        <div class="bg-white dark:bg-gray-800">
          <div class="container mx-auto bg-white dark:bg-gray-800 rounded">
            <div class="xl:w-full border-b border-gray-300 dark:border-gray-700 py-5 bg-white dark:bg-gray-800">
              <div class="flex w-11/12 mx-auto xl:w-full xl:mx-0 items-center">
                <p class="text-lg text-gray-800 dark:text-gray-100 font-bold">
                  스터디원 모집
                </p>
                <div class="ml-2 cursor-pointer text-gray-600 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                  >
                    <path
                      class="heroicon-ui"
                      d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-9a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1zm0-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div class="mx-auto">
              <div class="xl:w-9/12 w-11/12 mx-auto xl:mx-0">
                <div class="rounded relative mt-8 h-48">
                  <img
                    src="https://cdn.tuk.dev/assets/webapp/forms/form_layouts/form1.jpg"
                    alt=""
                    class="w-full h-full object-cover rounded absolute shadow"
                  />
                  <div class="absolute bg-black opacity-50 top-0 right-0 bottom-0 left-0 rounded"></div>
                  <div class="flex items-center px-3 py-2 rounded absolute right-0 mr-4 mt-4 cursor-pointer">
                    <p class="text-xs text-gray-100">Change Cover Photo</p>
                    <div class="ml-2 text-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-edit"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                        <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                        <line x1="16" y1="5" x2="19" y2="8" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="mt-16 flex flex-col xl:w-2/6 lg:w-1/2 md:w-1/2 w-full">
                  <label
                    for="title"
                    class="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100"
                  >
                    제목
                  </label>
                  <input
                    tabindex="0"
                    type="text"
                    id="title"
                    name="title"
                    required
                    class="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-600 dark:text-gray-400"
                    placeholder="스터디 모집 합니다."
                  />
                </div>
                <div class="mt-8 flex flex-col xl:w-3/5 lg:w-1/2 md:w-1/2 w-full">
                  <label
                    for="about"
                    class="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100"
                  >
                    내용
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    required
                    class="bg-transparent border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 resize-none placeholder-gray-500 text-gray-600 dark:text-gray-400"
                    placeholder="스터디 모집에 관한 자세한 이야기를 적어주세요!"
                    rows="5"
                  ></textarea>
                  <p class="w-full text-right text-xs pt-1 text-gray-600 dark:text-gray-400">
                    Character Limit: 200
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="container mx-auto w-11/12 xl:w-full">
            <div class="w-full py-4 sm:px-0 bg-white dark:bg-gray-800 flex justify-end">
              <button
                role="button"
                aria-label="cancel form"
                class="bg-gray-200 focus:outline-none transition duration-150 ease-in-out hover:bg-gray-300 dark:bg-gray-700 rounded text-indigo-600 dark:text-indigo-600 px-6 py-2 text-xs mr-4 focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
              >
                Cancel
              </button>
              <button
                role="button"
                aria-label="Save form"
                class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-indigo-700 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-2 text-sm"
                type="submit"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default boardEdit;
