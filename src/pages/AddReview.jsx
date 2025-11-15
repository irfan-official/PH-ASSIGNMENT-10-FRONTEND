import React, { useState, useEffect } from "react";
import { BiSolidCommentAdd } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { Auth_Context } from "../context/AuthContext";
import { useContext } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import swal from "sweetalert";
import { fetchWithRetry } from "../context/DataContext.jsx";
import { Data_Context } from "../context/DataContext.jsx";

function AddReview() {
  let [form, setForm] = useState({
    foodName: "",
    image: "",
    category: "",
    restaurantName: "",
    location: "",
    reviewText: "",
    ratings: 5,
  });

  const [addReviewsLoader, setAddReviewsLoader] = useState(false);

  const { user } = useContext(Auth_Context);
  const { setAddReview } = useContext(Data_Context);
  const AxiosSecureInstance = useAxiosSecure();

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    if (
      !form.foodName.trim() ||
      !form.image.trim() ||
      !form.category.trim() ||
      !form.location.trim() ||
      !form.reviewText.trim()
    ) {
      return swal("All fields are required");
    }

    if (form.reviewText.length < 47) {
      return swal("reviewText must be at least 47 characters");
    }

    if (!form.restaurantName) {
      form.restaurantName = form.category;
    }

    try {
      setAddReviewsLoader(true);

      const response = await fetchWithRetry(() =>
        AxiosSecureInstance.post("/api/v1/create/review", {
          name: user.name,
          email: user.email,
          ...form,
        })
      );

      if (response.data.success) {
        swal({ icon: "success", title: "Review added successfully!" });
        setAddReview((prev) => !prev);

        // reset form after submit
        setForm({
          foodName: "",
          image: "",
          category: "",
          restaurantName: "",
          location: "",
          reviewText: "",
          ratings: 5,
        });
      }
    } catch (error) {
      console.error(error);
      swal({ icon: "error", title: "Failed to add review!" });
    }

    setAddReviewsLoader(false);
  }

  function handleFormInput(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className="w-full min-h-[90vh] text-black px-2 lg:px-6 sm:px-10 md:px-20 flex flex-col gap-7 sm:gap-10 items-center justify-start">
      <section className="flex items-center justify-center gap-3 sm:gap-3 mt-12">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-[#392F5A] inline-block">
          Add Reviews
        </h1>
        <section className="_logo_ text-[#632EE3] flex">
          <BiSolidCommentAdd size={44} />
        </section>
      </section>
      <section className="w-full flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-3 lg:p-8 rounded-md w-[95%] lg:w-[70%] border flex flex-col items-center justify-start gap-4 lg:gap-6 shadow"
        >
          <section className="_top_ w-full flex justify-between">
            <div className="_left_ w-[45%] flex flex-col items-start justify-center gap-2 lg:gap-4 ">
              <div className="_image_ rounded-lg overflow-hidden w-full h-[21vh] lg:h-[20vw] bg-gray-600/20 border border-white bg-center shadow">
                {form?.image && (
                  <img
                    src={form.image}
                    className="w-full h-full object-center object-cover"
                  />
                )}
              </div>
              <div className="_ratings_ bg-violet-200 flex flex-col lg:flex-row  gap-1 lg:gap-3 w-full p-2 rounded shadow">
                <span className="font-semibold text-violet-950 text-[0.8rem] lg:text-[1rem]">
                  Ratings:{"  "}
                </span>
                <hr className="lg:hidden" />
                <div className="_stars_ flex items-center gap-3">
                  <span
                    onClick={() => {
                      setForm((prev) => ({ ...prev, ratings: 1 }));
                    }}
                    className="cursor-pointer"
                  >
                    <FaStar />
                  </span>
                  <span
                    onClick={() => {
                      setForm((prev) => ({ ...prev, ratings: 2 }));
                    }}
                    className="c"
                  >
                    <FaStar />
                  </span>
                  <span
                    onClick={() => {
                      setForm((prev) => ({ ...prev, ratings: 3 }));
                    }}
                    className="cursor-pointer"
                  >
                    <FaStar />
                  </span>
                  <span
                    onClick={() => {
                      setForm((prev) => ({ ...prev, ratings: 4 }));
                    }}
                    className="cursor-pointer"
                  >
                    <FaStar />
                  </span>
                  <span
                    onClick={() => {
                      setForm((prev) => ({ ...prev, ratings: 5 }));
                    }}
                    className="cursor-pointer"
                  >
                    <FaStar />
                  </span>
                </div>
              </div>
            </div>
            <div className="_right_ w-[53%] py-1 shadow border rounded flex flex-col justify-between gap-2 px-3">
              <section className="_top_ w-full h-[53%] lg:h-[33%] flex flex-col justify-between gap-2 mt-1 ">
                <section className="__food_Name__ relative mt-0 text-[0.8rem] lg:text-[0.9rem]">
                  <input
                    onChange={handleFormInput}
                    type="text"
                    name="foodName"
                    id="foodName"
                    value={form.foodName}
                    required
                    placeholder="foodName"
                    className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                    autoComplete="off"
                  />
                  <label
                    htmlFor="foodName"
                    className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                  >
                    Food name
                  </label>
                </section>

                <section className="_category-location_ w-full flex flex-col lg:flex-row items-start lg:justify-start text-[0.8rem] lg:text-[0.9rem] gap-3">
                  <div className="__select-category__ relative w-full lg:w-[30%] bg-slate-100 rounded px-1 shadow text-ellipsis">
                    <select
                      id="category"
                      name="category"
                      required
                      value={form.category}
                      onChange={handleFormInput}
                      className="peer mt-1 w-full px-0 py-1 text-gray-900 focus:border-gray-500 focus:outline-none bg-transparent text-ellipsis"
                    >
                      <option value="" disabled className="text-gray-400">
                        Category
                      </option>
                      <option value="Home">Home</option>
                      <option value="Street">Street</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Restaurant">Restaurant</option>
                    </select>
                  </div>

                  <section className="_location_ border flex items-center gap-1 w-[100%] lg:w-[70%] h-full  rounded ">
                    <span className="text-xl px-1 py-1">
                      <MdLocationPin />
                    </span>
                    <input
                      onChange={handleFormInput}
                      type="text"
                      name="location"
                      id="location"
                      value={form.location}
                      required
                      placeholder="Location"
                      className="w-full h-full px-1 outline-0"
                      autoComplete="off"
                    />
                  </section>
                </section>
              </section>

              <section className="_bottom_ w-full h-[50%] lg:h-[57%] flex flex-col justify-end  gap-2 ">
                {(form.category === "Hotel" ||
                  form.category === "Restaurant") && (
                  <section className="__restaurantName__ rounded relative text-[0.8rem] lg:text-[0.9rem]">
                    <input
                      onChange={handleFormInput}
                      type="text"
                      name="restaurantName"
                      id="restaurantName"
                      value={form.restaurantName}
                      required
                      placeholder="restaurantName"
                      className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                      autoComplete="off"
                    />
                    <label
                      htmlFor="restaurantName"
                      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-[1rem] text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-[0.5rem] peer-focus:text-gray-800 "
                    >
                      Restaurant Name
                    </label>
                  </section>
                )}
                <span className="__img-URL__ w-full h-[80%] lg:h-[95%] relative  justify-center flex items-center gap-3 md:gap-5 text-[0.8rem] lg:text-[0.9rem]">
                  <textarea
                    onChange={handleFormInput}
                    type="text"
                    value={form.image}
                    name="image"
                    id="image"
                    placeholder="image"
                    required
                    className="peer mt-1 w-full border rounded border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none h-full"
                  ></textarea>
                  <label
                    htmlFor="image"
                    className="pointer-events-none absolute -top-1 left-2 origin-left -translate-y-1/2 transform text-[0.7rem] text-gray-800 opacity-80 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800 "
                  >
                    image url
                  </label>
                </span>
              </section>
            </div>
          </section>
          <section className="_body-text_ w-full">
            <textarea
              name="reviewText"
              onChange={handleFormInput}
              value={form.reviewText}
              className="w-full border shadow rounded p-2 text-[0.9rem] lg:text-[1rem] h-20 lg:h-24"
              id="reviewText"
              placeholder="review"
            ></textarea>
          </section>
          <section className="__post-button__ w-full ">
            <button
              type="submit"
              disabled={addReviewsLoader}
              className="w-full flex items-center justify-center border py-2 rounded-md bg-violet-600 text-white font-semibold"
            >
              {addReviewsLoader ? (
                <span class="loading loading-spinner loading-lg"></span>
              ) : (
                "Post"
              )}
            </button>
          </section>
        </form>
      </section>
    </div>
  );
}

export default AddReview;
