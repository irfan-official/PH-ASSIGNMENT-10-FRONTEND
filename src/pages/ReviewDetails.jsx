import React, { useState, useContext, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { FaHandHoldingMedical } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { toast, Bounce } from "react-toastify";
import Page404 from "./Page404.jsx";
import ClientComment from "../components/ClintComment.jsx";
import { BsFillChatRightTextFill } from "react-icons/bs";
import { Data_Context } from "../context/DataContext.jsx";
import { Auth_Context } from "../context/AuthContext.jsx";
import Rating from "../components/Rating.jsx";
import NoServiceFound from "./NoServiceFound.jsx";
import { LiaCommentSolid } from "react-icons/lia";
import { BsEmojiLaughing } from "react-icons/bs";
import useAxiosSecure from "../hooks/useAxiosSecure.jsx";
import { fetchWithRetry } from "../context/DataContext.jsx";

function ReviewDetails() {
  const { id } = useParams();

  const { user } = useContext(Auth_Context);

  const [selectedApp, setSelectedApp] = useState({});
  const [exceedID, setExceedID] = useState(false);
  const [checkReview, setCheckReview] = useState(null);
  const [clickComment, setClickComment] = useState(false);
  const [fetchCommentsLoader, setFetchCommentsLoader] = useState(false);
  const [createCommentsLoader, setCreateCommentsLoader] = useState(false);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([
    // {
    //   image:
    //     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW9kZWx8ZW58MHx8MHx8fDA%3D",
    //   name: "test",
    //   time: "1/1/2002",
    //   comment:
    //     "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut optio hic eum est expedita dolore provident dignissimos tempora sint voluptatum.",
    // },
  ]);

  let { allReviews, AllReviewsDataFetching, loader } = useContext(Data_Context);

  const axiosSecureInstance = useAxiosSecure();

  async function fetchComments() {
    try {
      if (!checkReview?._id) {
        return;
      }
      setFetchCommentsLoader(true);
      const getAllComments = await fetchWithRetry(() =>
        axiosSecureInstance.get("/api/v1/shows/all-comments", {
          params: {
            review_id: checkReview?._id,
          },
        })
      );
      console.log("all-comments = ", getAllComments);
      setAllComments(getAllComments.data.data);
      setFetchCommentsLoader(false);
    } catch (error) {
      alert(error.message);
    }
  }

  async function createComments(comment) {
    if (!checkReview?._id) {
      return;
    }
    setCreateCommentsLoader(true);
    const createdComment = await fetchWithRetry(() =>
      axiosSecureInstance.post("/api/v1/create/comments", {
        review_id: checkReview._id,
        user_id: localStorage.getItem("_id"),
        comment,
      })
    );

    if (createdComment.data.success) {
      // setAllComments((prev) => [createdComment.data.data, ...prev]);

      setAllComments((prev) => [
        {
          image: user.image,
          name: user.name,
          createdAt: new Date(Date.now()).toISOString(),
          comment: comment,
        },
        ...prev,
      ]);
    }
    setCreateCommentsLoader(false);
  }

  useEffect(() => {
    if (loader) {
      return;
    }
    if (allReviews.length < 1) {
      AllReviewsDataFetching();
      return;
    }

    const foundReview = allReviews.find((obj) => {
      let check = String(obj._id) === String(id);

      return check;
    });

    if (!foundReview) {
      setExceedID(true); // triggers 404 if not found
    } else {
      setCheckReview(foundReview);
    }
  }, [id, loader]);

  useEffect(() => {
    if (exceedID) {
      return;
    }
    fetchComments();
  }, [checkReview?._id]);

  async function handleCommentSubmit(e) {
    e.preventDefault();

    let checkComment = comment.trim();

    if (checkComment === "") {
      return;
    }

    createComments(checkComment);

    setComment("");
  }

  if (loader) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg scale-200"></span>
      </div>
    );
  }

  if (exceedID) {
    return <NoServiceFound />;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-2  text-black px-6 sm:px-20  py-20">
      <section className="_top_ w-full flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-b-gray-600/40 py-6 lg:gap-8">
        <span className="_left_ rounded-xl overflow-hidden shadow-lg inline-block object-cover bg-cover">
          <img
            className="w-full h-[60vh] lg:w-[50rem]  object-cover object-center"
            src={checkReview?.image}
            alt=""
          />
        </span>
        <section className="_details_ _right_ w-full lg:w-[70%] flex flex-col items-start justify-center  gap-2"></section>
      </section>

      <section className=" _Review_ flex flex-col items-start justify-center gap-4 mt-20">
        <section className="_top_ flex items-end justify-center gap-3 ">
          <h2 className="font-bold text-4xl  ">Review</h2>
          <span className="text-3xl ">
            <BsFillChatRightTextFill />
          </span>
        </section>

        <span className="flex flex-col items-center justify-center gap-4 text-gray-700/70 text-justify">
          <p key={1}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            corporis, ipsa omnis obcaecati id, eaque praesentium eveniet quo
            molestiae ut consequatur ipsum tempore deserunt iure maxime
            inventore facere numquam quisquam temporibus.
          </p>
        </span>
      </section>

      <section className=" _Comments_ w-full flex flex-col items-start justify-start gap-7 mt-20 ">
        <section className="_comment-heading_ flex gap-2 justify-start items-center  mb-2 ">
          <h2 className="font-bold text-4xl pb-2">Comments</h2>
          <span className="__number-of-comments_ font-semibold px-2 py-1 bg-slate-950 text-white shadow rounded-sm text-[0.92rem]">
            {allComments.length || 0}
          </span>

          <span className=" text-[42px] ">
            <LiaCommentSolid />
          </span>
        </section>

        <section className="_insert_comments_ w-full h-[7.5rem] flex justify-start items-center gap-4 mb-0 ">
          <section className="__left_ h-full w-[85px]  lg:w-[77px] overflow-hidden ">
            <section className="border-3 border-slate-300 w-full h-[70px] lg:h-[75px] rounded-full overflow-hidden object-cover bg-cover shadow-lg bg-amber-600">
              <img
                src={`${user?.image}`}
                alt=""
                className="w-full h-full object-cover object-top bg-slate-600 "
              />
            </section>
          </section>
          <form onSubmit={handleCommentSubmit} className="__right_ w-full  ">
            <input
              disabled={createCommentsLoader}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              onClick={() => {
                setClickComment(true);
              }}
              value={clickComment ? comment : ""}
              readOnly={!clickComment}
              placeholder="Add a comment..."
              type="text"
              className="w-full  border-b-2 placeholder:font-semibold outline-none pb-1 cursor-text"
            />

            <section className="_comment-button_ w-full flex items-center justify-between mt-2 ">
              <section className="_left_ text-3xl cursor-pointer shadow-lg rounded-full">
                {clickComment && <BsEmojiLaughing />}
              </section>
              <section className="_right_ flex gap-2 items-center justify-between">
                {clickComment ? (
                  <>
                    <button
                      disabled={createCommentsLoader}
                      type="button"
                      onClick={() => {
                        setClickComment(false);
                      }}
                      className="px-5 py-3 rounded-full bg-slate-200 font-semibold shadow-md cursor-pointer border border-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={createCommentsLoader}
                      type="submit"
                      className="w-[110px] py-3 rounded-full bg-slate-950 text-white font-semibold shadow-md cursor-pointer border border-slate-100 flex items-center justify-center"
                    >
                      {createCommentsLoader ? (
                        <span class="loading loading-spinner loading-md"></span>
                      ) : (
                        " Comment"
                      )}
                    </button>
                  </>
                ) : (
                  <span className="_temporary-for-support_ px-5 py-[25px]"></span>
                )}
              </section>
            </section>
          </form>
        </section>
        
        <hr className="w-full border-b-2 border-dotted border-slate-950" />
        <section className="w-full flex flex-col items-start justify-start gap-4">
          {fetchCommentsLoader ? (
            <section className="w-full flex items-center justify-center">
              <span className="loading loading-spinner loading-xl scale-120"></span>
            </section>
          ) : (
            allComments.map(({ image, name, createdAt, comment }, index) => (
              <ClientComment
                key={index}
                image={image}
                name={name}
                createdAt={createdAt}
                comment={comment}
              />
            ))
          )}
        </section>
      </section>
    </div>
  );
}

export default ReviewDetails;
