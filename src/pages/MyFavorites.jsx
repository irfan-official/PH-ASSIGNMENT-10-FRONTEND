import React, { useState, useEffect, useContext } from "react";
import { TbApps } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { IoSearch } from "react-icons/io5";
import { Data_Context } from "../context/DataContext.jsx";
import { Auth_Context } from "../context/AuthContext.jsx";
import { MdReviews } from "react-icons/md";

import ReviewCard from "../components/ReviewCard.jsx";

function MyFavorites() {
  const { allReviews, loader } = useContext(Data_Context);
  const { user } = useContext(Auth_Context);

  const [searchReviews, setSearchReviews] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [myFavoriteReviews, setMyFavoriteReviews] = useState([]);

  useEffect(() => {
    let res = allReviews.filter(({ loved }, index) =>
      loved.includes(localStorage.getItem("_id"))
    );

    console.log("filtered ====> ", res);
    setMyFavoriteReviews(res);
  }, [loader, allReviews?.length]);

  useEffect(() => {
    // if input empty → clear filtered data
    if (!searchReviews.trim()) {
      setFilteredReviews([]);
      return;
    }

    setSearchLoading(true);

    try {
      // Escape regex special chars for safety
      const escaped = searchReviews.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i"); // case-insensitive

      // filter by matching in serviceName, providerName, or category
      const matched = myFavoriteReviews.filter(
        (item) =>
          regex.test(item.category) ||
          regex.test(item.restaurantName) ||
          regex.test(item.location) ||
          regex.test(item.foodName) ||
          regex.test(item.reviewText)
      );

      setFilteredReviews(matched);
    } catch (err) {
      console.error("Invalid regex:", err.message);
    } finally {
      setSearchLoading(false);
    }
  }, [searchReviews, myFavoriteReviews]);

  if (loader) {
    return (
      <div className="w-full h-[90vh] flex items-center justify-center text-6xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-h-[90vh] text-black px-6 sm:px-10 md:px-20 flex flex-col gap-7 sm:gap-10">
      <section className="_title_&_info_ flex flex-col gap-20 sm:gap-30">
        <section className="_title_ flex flex-col items-center justify-center gap-7 sm:gap-4">
          <section className="flex items-center justify-center gap-3 sm:gap-3 mt-12">
            <h1 className="text-center text-3xl sm:text-4xl font-bold text-[#392F5A] inline-block">
              Favorite Reviews
            </h1>
            <section className="_logo_ text-[#632EE3] flex">
              <MdReviews size={44} />
            </section>
          </section>
        </section>
        <section
          className="_modifier_ w-full flex items-center justify-between
          "
        >
          <h2 className="_apps-label_ text-[#632EE3] font-semibold flex items-center gap-2 text-[0.9rem] sm:text-[1rem]">
            <span className="px-4 py-2 bg-white rounded-md shadow font-extrabold">
              {searchReviews
                ? filteredReviews.length
                : myFavoriteReviews.length}
            </span>
            <span className=" underline"> Reviews Found</span>
          </h2>

          <span className="_search_ border w-40 sm:w-60 border-[#632EE3] py-2 px-3 flex justify-between items-center gap-2 rounded-md">
            <span
              onClick={() => {
                if (searchReviews) {
                  alert("Searching ...");
                }
              }}
              className="text-gray-500 cursor-pointer"
            >
              <IoSearch />
            </span>
            <input
              onChange={(e) => {
                setSearchReviews(e.target.value);
              }}
              type="text"
              value={searchReviews}
              className=" rounded-md outline-0 text-[0.9rem] sm:text-[1rem] w-[70%]"
              placeholder="Search Reviews..."
            />
            <span
              onClick={() => {
                setSearchReviews("");
              }}
              className="cursor-pointer"
            >
              {searchReviews && <RxCross2 />}
            </span>
          </span>
        </section>
      </section>
      <section
        className="_Apps-Card_ 
          w-full min-h-[40vh] 
          grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 
          gap-10  xl:gap-5 xl:gap-y-20 2xl:gap-10 md:gap-15 sm:gap-4 
          pb-20 px-10 md:px-0 pt-10 sm:pt-5 
          
          place-items-center
"
      >
        {searchReviews ? (
          searchLoading ? (
            <div className="col-span-full flex items-center justify-center">
              <span className="loading loading-spinner loading-xl text-[#632EE3]"></span>
            </div>
          ) : filteredReviews.length > 0 ? (
            filteredReviews.map(
              (
                {
                  _id,
                  foodName,
                  image,
                  user,
                  category,
                  ratings,
                  restaurantName,
                  location,
                  reviewText,
                  createdAt,
                  loved,
                },
                index
              ) => (
                <ReviewCard
                  key={String(_id)}
                  reviewId={String(_id)}
                  index={index}
                  userName={user.name}
                  userImage={user.image}
                  foodName={foodName}
                  image={image}
                  category={category}
                  ratings={ratings}
                  restaurantName={restaurantName}
                  location={location}
                  reviewText={reviewText}
                  createdAt={createdAt}
                  loved={loved}
                  arr={myFavoriteReviews}
                  updateArr={setMyFavoriteReviews}
                />
              )
            )
          ) : (
            <p className="col-span-full text-center text-slate-500 font-semibold">
              No apps found 😢
            </p>
          )
        ) : (
          myFavoriteReviews.map(
            (
              {
                _id,
                foodName,
                image,
                user,
                category,
                ratings,
                restaurantName,
                location,
                reviewText,
                createdAt,
                loved,
              },
              index
            ) => (
              <ReviewCard
                key={String(_id)}
                reviewId={String(_id)}
                index={index}
                userName={user.name}
                userImage={user.image}
                foodName={foodName}
                image={image}
                category={category}
                ratings={ratings}
                restaurantName={restaurantName}
                location={location}
                reviewText={reviewText}
                createdAt={createdAt}
                loved={loved}
                arr={myFavoriteReviews}
                updateArr={setMyFavoriteReviews}
              />
            )
          )
        )}
      </section>
    </div>
  );
}

export default MyFavorites;
