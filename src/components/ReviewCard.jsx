import React, { useEffect, useState, useContext } from "react";
import "../index.css";
import { FaStar } from "react-icons/fa";
import { NavLink } from "react-router";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineRestaurant } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";
import { FaStreetView } from "react-icons/fa6";
import { FaHotel } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { FaHeart } from "react-icons/fa6";
import moment from "moment";
import useAxios from "../hooks/useAxios";
import useAxiosSecure from "../hooks/useAxiosSecure.jsx";
import { Data_Context } from "../context/DataContext.jsx";
import { fetchWithRetry } from "../context/DataContext.jsx";

function ReviewCard({
  reviewId,
  index,
  userName,
  userImage,
  foodName,
  image,
  category,
  ratings,
  restaurantName,
  location,
  reviewText,
  createdAt,
  loved,
  arr,
  updateArr,
}) {
  const { setAllReviews, setLimitedReviewsData } = useContext(Data_Context);

  const [isLoved, setIsLoved] = useState(false);
  const [lovedCount, setLovedCount] = useState(0);
  const [lovedClicked, setLovedClicked] = useState(false);

  function checkLove() {
    return loved.includes(localStorage.getItem("_id"));
  }

  useEffect(() => {
    setIsLoved(checkLove());
    setLovedCount(loved?.length || 0);
  }, [lovedClicked]);

  function resizeText() {
    let text = reviewText || "";
    let str = "";
    let remainsStr = "";
    for (let i = 0, lim = text.length; i < lim; i++) {
      if (i < 40) {
        str += text[i];
      } else {
        remainsStr += text[i];
      }
    }
    return {
      uppText: str,
      remainText: remainsStr,
    };
  }
  const axiosSecureInstance = useAxiosSecure();

  async function sendLoveReq() {
    try {
      await fetchWithRetry(() =>
        axiosSecureInstance.post("/api/v1/add/loved-reviews", {
          _id: localStorage.getItem("_id"),
          reviewId: reviewId,
        })
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  function ReactLoveIcon() {
    const ID = localStorage.getItem("_id") || "";
    if (!ID) {
      alert("Please login first to react!");
      return;
    }

    if (checkLove()) return;

    setLovedClicked((prev) => !prev);
    setIsLoved(true);

    sendLoveReq();

    updateArr((prev) => {
      const newArr = prev.map((review, indx) =>
        Number(indx) === Number(index)
          ? { ...review, loved: [...review.loved, ID] }
          : review
      );
      return newArr;
    });
  }

  const text = resizeText();

  return (
    <div className="relative px-5  pt-4 pb-1 w-[22rem] md:w-[24rem] lg:w-[23rem] 2xl:w-[25rem] h-[39rem]  lg:h-[39.3rem] border flex flex-col rounded-lg gap-4 shadow text-[0.9rem] justify-between">
      <section className="__title__ w-full flex gap-2  ">
        <div className="__left__  object-cover bg-cover w-14 h-14 rounded-full overflow-hidden border-2 border-slate-300 ">
          <img
            src={userImage}
            alt=""
            className="w-full h-full bg-amber-300 object-cover object-top"
          />
        </div>

        <div className="__right__ w-[80%] flex flex-row items-center justify-between">
          <div className="__section-left__ flex flex-col items-start gap-1 justify-center w-[80%] ">
            <div className="_top_ w-full text-[1.1rem]">{userName}</div>
            <div className="w-full flex items-center justify-between pr-2">
              <div className="_rating-stars_ flex gap-1 text-violet-400">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <div className="text-[0.65rem]">
                {moment(createdAt).format("DD/MM/YY")}
              </div>
            </div>
          </div>
          <div className="w-12 h-full  flex items-center justify-center  flex-col gap-2">
            <button
              onClick={ReactLoveIcon}
              className={`cursor-pointer p-3  rounded-full border  shadow text-purple-950 ${
                isLoved
                  ? "bg-violet-400/30 border-violet-400"
                  : "bg-violet-400/30 border-violet-400/40 hover:bg-violet-400/50   hover:text-white"
              }`}
            >
              <span className="text-[25px] ">
                {isLoved ? (
                  <span className="c">
                    <FaHeart />
                  </span>
                ) : (
                  <FaRegHeart />
                )}
              </span>
            </button>
            <span className="font-bold text-violet-950 bg-violet-300/20 px-3  rounded-2xl">
              {lovedCount}
            </span>
          </div>
        </div>
      </section>
      <section className="__img__ w-full  flex flex-col gap-2 justify-start ">
        <section className="__container__ relative h-full justify-start  rounded-sm rounded-tl-4xl rounded-br-4xl overflow-hidden bg-center">
          <img
            className="h-[17rem] xl:h-[18rem] w-full object-cover object-center"
            src={image}
            alt=""
          />

          <span className="px-4 pl-5 py-2 absolute bottom-2 left-2 bg-white/40 backdrop-blur-2xl flex items-center gap-2 rounded-sm rounded-tr-4xl rounded-bl-4xl  overflow-hidden ">
            <span className="text-stone-600 bg-yellow-400 p-1 rounded shadow ">
              <MdOutlineRestaurant size={21} />
            </span>
            <span className="font-semibold text-white">{category}</span>
          </span>
        </section>
      </section>
      <section className="__middle__ flex flex-col gap-3 ">
        <section className="__category__ w-full text-center font-semibold text-lg">
          {foodName}
        </section>
        <section className="__provider_info__ flex items-center justify-between mt-1">
          <section className="__provider_name__ font-semibold text-md 2xl:text-lg  flex items-center gap-3">
            <span className="text-[1rem] text-white shadow-md p-2 rounded-md bg-purple-900">
              {category === "Home" && <IoHome />}
              {category === "Street" && <FaStreetView />}
              {category === "Hotel" && <FaHotel />}
              {category === "Restaurant" && <FaHotel />}
            </span>
            <span className="text-violet-900 font-semibold text-md">
              {restaurantName}
            </span>
          </section>
          <section className="__location__  flex gap-1 items-center">
            <span className="text-lg text-violet-900 ">
              <MdLocationPin />
            </span>
            <span className="c">{location}</span>
          </section>
        </section>
        <section className="__description__ mt-2 w-full  overflow-hidden pb-2">
          <h2 className="_top_">{text.uppText}</h2>
          <section className="_bottom_ flex items-center justify-between w-full ">
            <section className="_left_ w-[61%]">
              <h2 className="_text_ h-[47px] line-clamp-2">
                {text.remainText}
              </h2>
            </section>

            <section className="_right_ __view_details-button__ flex justify-center pt-2  ">
              <NavLink className="px-5 py-3 shadow-md text-nowrap  text-black rounded-lg bg-violet-200 hover:bg-violet-300">
                View Details
              </NavLink>
            </section>
          </section>
          <section className=" mt-2  flex items-center relative h-6 ">
            <div
              className={` rounded-full overflow-clip border-2 border-white object-cover bg-cover absolute top-0 left-0 z-[1]`}
            >
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9kZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500"
                alt=""
                className="w-5 h-5 bg-amber-300 object-cover object-top"
              />
            </div>
            <div
              className={` rounded-full overflow-clip border-2 border-white object-cover bg-cover absolute top-0 left-3 z-[1]`}
            >
              <img
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9kZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500"
                alt=""
                className="w-5 h-5 bg-amber-300 object-cover object-top"
              />
            </div>
            <div
              className={` rounded-full overflow-clip border-2 border-white object-cover bg-cover absolute top-0 left-6 z-[2]`}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9kZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500"
                alt=""
                className="w-5 h-5 bg-amber-300 object-cover object-top"
              />
            </div>
            <div
              className={` rounded-full overflow-clip border-2 border-white object-cover bg-cover absolute top-0 left-9 z-[3]`}
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW9kZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500"
                alt=""
                className="w-5 h-5 bg-amber-300 object-cover object-top"
              />
            </div>
            <div
              className={` rounded-full overflow-clip border-2 border-white object-cover bg-cover absolute top-0 left-12 z-[4]`}
            >
              <img
                src="https://plus.unsplash.com/premium_photo-1682095757120-c9abb908ed60?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9kZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500"
                alt=""
                className="w-5 h-5 bg-amber-300 object-cover object-top"
              />
            </div>

            <div
              className={`_remain-text_ absolute top-0 left-19 z-[8] text-[0.7rem] font-extralight text-violet-950  h-6 flex items-center`}
            >
              + 20 more
            </div>
          </section>
        </section>
      </section>
    </div>
  );
}

export default ReviewCard;
