import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";

const Container = styled.div``;

const CommentContainer = styled.div`
  max-height: 570px;
  overflow-y: auto;
  flex-direction: column-reverse;
  padding: 20px;
`;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const PlaceholderAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  /* Add styles for the placeholder image here */
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const commentContainerRef = useRef();

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/comment/${videoId}`
      );
      setComments(res.data);
      commentContainerRef.current.scrollTop =
        commentContainerRef.current.scrollHeight;
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
    return () => {
      setComments([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  useEffect(() => {
    return () => {
      setComments([]);
    };
  }, []);

  const postComment = async () => {
    if (newCommentText.trim() === "") {
      return;
    }

    try {
      const newComment = {
        comment: newCommentText,
        video_id: videoId,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/comment/`,
        newComment,
        {
          withCredentials: true,
        }
      );
      setNewCommentText("");
      setComments((prevComments) => [res.data, ...prevComments]);
      fetchComments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <CommentContainer ref={commentContainerRef}>
        {comments.length > 0 && comments !== null
          ? comments.map((comment) => (
              comment ? (
                <Comment key={comment._id} comment={comment} />
              ) : null
            ))
          : null}
      </CommentContainer>
      <NewComment>
        {currentUser && currentUser.img ? (
          <Avatar src={currentUser.img} />
        ) : (
          <PlaceholderAvatar src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg" />
        )}
        <Input
          placeholder="Add a comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.currentTarget.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              postComment();
            }
          }}
        />
      </NewComment>
    </Container>
  );
};

export default Comments;