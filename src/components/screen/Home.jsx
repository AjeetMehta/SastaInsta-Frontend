import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { Link, useHistory } from "react-router-dom";

function Home() {
  const history = useHistory();
  const [data, setdata] = useState([]);
  const [like, setlike] = useState([]);
  const [comment, setcomment] = useState([]);
  const [loginbanda, setloginbanda] = useState({});

  useEffect(async () => {
    await fetch("https://sastainsta.herokuapp.com/posts/allpost", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setdata(data);
      });
  }, [like, comment]);

  useEffect(async () => {
    const token = localStorage.getItem("access_token");
    await fetch("https://sastainsta.herokuapp.com/users/verifykro", {
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
  }, []);

  async function handleclick(id) {
    if (!loginbanda._id) {
      M.toast({ html: "Login First" });
      history.push("/login");
    } else {
      const token = localStorage.getItem("access_token");
      await fetch("https://sastainsta.herokuapp.com/posts/likes/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
        .then((res) => res.json())
        .then((dat) => {
          setlike(dat.likes.length);
        });
    }
  }

  async function deleteclick(id) {
    const token = localStorage.getItem("access_token");
    await fetch("https://sastainsta.herokuapp.com/posts/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    })
      .then((res) => res.json())
      .then((del) => {
        if (del.error) M.toast({ html: del.error });
        else M.toast({ html: "Successfully deleted" });
      });
  }

  function makecomment(text, postId) {
    if (!loginbanda._id) {
      M.toast({ html: "Login First" });
      history.push("/login");
    } else {
      const token = localStorage.getItem("access_token");
      fetch("https://sastainsta.herokuapp.com/posts/comments/" + postId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ text }),
      })
        .then((res) => res.json())
        .then((beta) => {
          setcomment(beta);
        });
    }
  }

  return (
    <div className="myhome">
      {data.map((item) => (
        <div className="card home-card">
          <h3>
            {
              <img
                style={{ width: "35px", height: "35px", borderRadius: "15px" }}
                src={item.author.photo}
              ></img>
            }
            <Link to={"/dusrekaprofile/" + item.author._id}>
              {item.author.name}
            </Link>
            {loginbanda._id == item.author._id ? (
              <>
                <i
                  className="material-icons"
                  style={{ color: "grey", cursor: "pointer", float: "right" }}
                  onClick={() => history.push("/create/" + item._id)}
                >
                  edit
                </i>
                <i
                  className="material-icons"
                  style={{ color: "red", cursor: "pointer", float: "right" }}
                  onClick={() => deleteclick(item._id)}
                >
                  delete
                </i>
              </>
            ) : null}
          </h3>
          <h6>{item.title}</h6>
          <div className="card-image">
            <img src={item.image} />
          </div>
          <div className="card-content">
            <p>
              <i
                onClick={() => handleclick(item._id)}
                className="material-icons"
                style={{
                  color: item.likes.includes(loginbanda._id) ? "red" : "black",
                  cursor: "pointer",
                }}
              >
                favorite
              </i>
              {item.likes.length}
            </p>
            {item.comments.map((comm) => (
              <p>
                {
                  <img
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "10px",
                    }}
                    src={item.author.photo}
                  ></img>
                }
                <b>{comm.author.name}</b>-{comm.text}
              </p>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                makecomment(e.target[0].value, item._id);
              }}
            >
              <input name="comment" type="text" placeholder="comment"></input>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
