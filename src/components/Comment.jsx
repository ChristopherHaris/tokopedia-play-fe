import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const DateText = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Comment = ({ comment }) => {
  const [channel, setChannel] = useState({});
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/user/${comment.user_id}`
        );
        setChannel(res.data);
        setIsDataFetched(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchComment();
  }, [comment.user_id]);

  if (!isDataFetched) {
    return null;
  }

  const formattedDate = moment(comment.created_at).format(
    "MMM Do YYYY, h:mm:ss a"
  );

  return (
    <Container>
      <Avatar src={channel.img} />
      <Details>
        <Name>
          {channel.name} <DateText>{formattedDate}</DateText>
        </Name>
        <Text>{comment.comment}</Text>
      </Details>
    </Container>
  );
};

export default Comment;
