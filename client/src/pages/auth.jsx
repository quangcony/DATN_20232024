import React, { useRef, useState } from "react";
import { google } from "../assets";
import crowdfundingApi from "../api/crowdfundingApi";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const errorMessageRef = useRef();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await crowdfundingApi.auth(form);
      if (res.data) {
        localStorage.setItem("profile", JSON.stringify(res.data));
        navigate(-1);
      }
    } catch (error) {
      errorMessageRef.current.innerText = error.response.data.message;
    }
  };

  return (
    <>
      <section class="flex justify-center">
        <div class="bg-gray-100 p-5 flex rounded-md shadow-lg max-w-3xl">
          <div class="md:w-1/2 px-5">
            <h2 class="text-2xl font-bold text-[#002D74]">Đặng nhập</h2>
            <p class="text-sm mt-4 text-[#002D74]">
              Nếu bạn đã có tài khoản, xin vui lòng đăng nhập
            </p>
            <div
              ref={errorMessageRef}
              className="text-red-600 text-[14px] my-2"
            ></div>
            <form class="mt-6" onSubmit={handleSubmit}>
              <div>
                <label class="block text-gray-700">Tên người dùng/ Email</label>
                <input
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  type="email"
                  value={form.email}
                  //   placeholder="Enter Email Address"
                  class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border transition-all focus:border-blue-500 focus:bg-white focus:outline-none"
                  autofocus
                  // autocomplete={"off"}
                  required
                />
              </div>

              <div class="mt-4">
                <label class="block text-gray-700">Mật khẩu</label>
                <input
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  type="password"
                  //   placeholder="Enter Password"
                  minlength="6"
                  class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border transition-all focus:border-blue-500
                  focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div class="text-right mt-2">
                <a
                  href="#"
                  class="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                >
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                class="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg
                px-4 py-3 mt-6"
              >
                Đăng nhập
              </button>
            </form>

            <div class="mt-7 grid grid-cols-3 items-center text-gray-500">
              <hr class="border-gray-500" />
              <p class="text-center text-sm">Hoặc</p>
              <hr class="border-gray-500" />
            </div>

            <button class="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 ">
              <img src={google} width={24} alt="Google" />
              <span class="ml-4">Đăng nhập với Google</span>
            </button>

            <div class="text-sm flex justify-between items-center mt-3">
              <p>Nếu bạn chưa có tài khoản...</p>
              <button class="py-2 px-5 ml-3 bg-white border rounded-xl hover:scale-110 duration-300 border-blue-400  ">
                Đăng ký
              </button>
            </div>
          </div>

          <div class="w-1/2 md:block hidden ">
            <img
              src="https://images.unsplash.com/photo-1529598993581-b025f3f79f9c"
              class="rounded-md"
              alt="page img"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
