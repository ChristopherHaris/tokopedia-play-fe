import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getStorage,
  ref as storeRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;
const Label = styled.label`
  font-size: 14px;
`;
const Upload = ({ setOpen }) => {
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  const ytUrlCopyLink = (urlRequest) => {
    let videoYtId = null;
    const find = "watch?v=";
    if (urlRequest.includes(find)) {
      const start = urlRequest.indexOf(find);
      const end = urlRequest.indexOf("&");
      // console.log(urlRequest, start, end);
      videoYtId = urlRequest.substring(
        start + find.length,
        end === -1 ? urlRequest.length : end
      );

      // console.log(videoYtId);
    }
    return videoYtId;
  };

  const ytUrlEmbedOrSharedLink = (urlRequest) => {
    const urls = urlRequest.split("/");
    return urls[urls.length - 1];
  };

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleUrlChange = (e) => {
    const urlRequest = e.target.value;
    const videoYtId =
      ytUrlCopyLink(urlRequest) ?? ytUrlEmbedOrSharedLink(urlRequest);
    setInputs((prev) => ({
      ...prev,
      videourl: `https://www.youtube.com/embed/${videoYtId}`,
    }));
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = storeRef(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "thumbnailurl"
          ? setImgPerc(Math.round(progress))
          : setVideoPerc(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video, "videourl");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "thumbnailurl");
  }, [img]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/video`,
      {
        ...inputs,
      }
    );
    setOpen(false);
    res.status === 200 && navigate(`/video/${res.data._id}`);
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a New Video</Title>
        <Label>Upload a Video:</Label>
        {videoPerc > 0 ? (
          "Uploading:" + videoPerc + "%"
        ) : (
          <>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            />
            <Label>Or</Label>
            <Label>Embed a Link:</Label>
            <Input
              type="text"
              placeholder="Video Url"
              name="Video Url"
              onChange={handleUrlChange}
            />
          </>
        )}
        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />
        <Label>Image:</Label>
        {imgPerc > 0 ? (
          "Uploading:" + imgPerc + "%"
        ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}
        <Button
          disabled={videoPerc < 100 || imgPerc < 100}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
