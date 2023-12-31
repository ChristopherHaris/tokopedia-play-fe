import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/video`);
        setVideos(res.data);
        console.log(res.data); 
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <Container>
      {videos && (
        videos.map((video) => <Card key={video._id} video={video} />)
      )}
    </Container>
  );
};

export default Home;
