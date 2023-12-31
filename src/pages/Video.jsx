import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import Comments from "../components/Comments";
import Product from "../components/Product";
import { fetchSuccess } from "../redux/videoSlice";
import { Text } from "@chakra-ui/react";

const Container = styled.div`
  display: flex;
  gap: 25px;
`;

const Content = styled.div`
  flex: 5;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const VideoFrame = styled.iframe`
  height: 500px;
  width: 100%;
`;

const Video = ({ darkMode }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/video/${path}`
        );
        const channelRes = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/user/${videoRes.data.user_id}`
        );
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (err) {}
    };
    fetchData();
  }, [path, dispatch]);

  //TODO: DELETE VIDEO FUNCTIONALITY

  return (
    <Container>
      {currentVideo !== null &&
      currentVideo !== undefined
      ? (
        <Content>
          <VideoWrapper>
            <VideoFrame src={currentVideo.videourl} controls />
          </VideoWrapper>
          <Title>{currentVideo.title}</Title>
          <Details>
            <Info>
              {currentVideo.views} views • {format(currentVideo.created_at)}
            </Info>
          </Details>
          <Hr />
          <Channel>
            <ChannelInfo>
              <Image src={channel.img} />
              <ChannelDetail>
                <ChannelName>{channel.name}</ChannelName>
              </ChannelDetail>
            </ChannelInfo>
          </Channel>
          <Hr />
          <Product
            userId={channel._id}
            videoId={currentVideo._id}
            darkMode={darkMode}
          />
        </Content>
      ) : null}
      {currentUser ? (
        <Comments videoId={currentVideo ? currentVideo._id : null} />
      ) : (
        <Text mt="4" textAlign="center" color="gray.500">
          Please Sign In to Comment
        </Text>
      )}
    </Container>
  );
};

export default Video;
