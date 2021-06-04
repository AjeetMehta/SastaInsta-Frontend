import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

function DusreProfile() {
  const [blog, setblog] = useState([]);
  const [count, setcount] = useState({});
  const [loginbanda, setloginbanda] = useState({});

  const { userid } = useParams();

  useEffect(async () => {
    const token = localStorage.getItem("access_token");
    await fetch("https://sastainsta.herokuapp.com/dusrekaprofile/" + userid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        logwala();
        setblog(data);
      });
  }, [Follower, Unfollow]);

  async function logwala() {
    const token = localStorage.getItem("access_token");
    await fetch("http://:5000/users/verifykro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setloginbanda(data);
      });
  }

  function Follower(postId) {
    const token = localStorage.getItem("access_token");
    fetch("https://sastainsta.herokuapp.com/users/follow/" + postId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setcount(data);
      });
  }

  function Unfollow(postId) {
    const token = localStorage.getItem("access_token");
    fetch("https://sastainsta.herokuapp.com/users/unfollow/" + postId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setcount(data);
      });
  }

  return (
    <div style={{ maxWidth: "650px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "20px",
          borderBottom: "2px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={blog[0]?.author.photo}
            alt="Ur_Post"
          />
        </div>
        <div>
          <h4>{blog[0]?.author.name}</h4>
          <h6>{blog[0]?.author.email}</h6>
          <div style={{ display: "flex" }}>
            <h6>
              Post<br></br>
              {blog?.length}
            </h6>
            <h6>
              Follower
              <br></br>
              {count?.follower?.length}
            </h6>
            <h6>
              Following <br></br>
              {count?.following?.length}
            </h6>
          </div>
          {loginbanda._id !== blog[0]?.author._id ? (
            <>
              {!loginbanda.following?.includes(blog[0]?.author._id) ? (
                <>
                  <button
                    onClick={() => Follower(blog[0].author._id)}
                    style={{ cursor: "pointer" }}
                  >
                    Follow
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => Unfollow(blog[0].author._id)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    UnFollow
                  </button>
                </>
              )}
            </>
          ) : null}
        </div>
      </div>
      <div className="gallery">
        {blog.map((item) => (
          <img className="item" src={item.image} alt="pic" />
        ))}
      </div>
    </div>
  );
}

export default DusreProfile;
