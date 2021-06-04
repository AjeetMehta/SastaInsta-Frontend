import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";

function EditPost() {
  const history = useHistory();
  const [image, setImage] = useState("");
  const { userid } = useParams();
  // const [url, seturl] = useState("");
  const [userPost, setPost] = useState({
    title: "",
  });
  // const [url, setUrl] = useState("");

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setPost({ ...userPost, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "SastaInsta");
    formData.append("cloud_name", "mehta1234");
    fetch("https://api.cloudinary.com/v1_1/mehta1234/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(async (data) => {
        const url = data.url;
        const { title } = userPost;
        const token = localStorage.getItem("access_token");
        await fetch("https://sastainsta.herokuapp.com/posts/create/" + userid, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({ title, url }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            history.push("/");
            M.toast({ html: "Successfully Updated" });
          });
      });
  }
  return (
    <form method="POST" onSubmit={handleSubmit}>
      <div
        className="card input-field"
        style={{
          margin: "50px auto",
          maxWidth: "500px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h3>EditPost</h3>
        <input
          name="title"
          type="text"
          placeholder="title"
          onChange={handleChange}
          value={userPost.title}
        ></input>
        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>Upload_Image</span>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            ></input>
          </div>
          <div className="file-path-wrapper">
            <input
              className="file-path validate"
              type="text"
              placeholder="Upload one "
            ></input>
          </div>
        </div>
        <button
          type="submit"
          className="waves-effect waves-light btn #64b5f6 blue darken-1"
        >
          Edit Post
        </button>
      </div>
    </form>
  );
}

export default EditPost;
