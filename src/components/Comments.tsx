import { Box, Center, Container, Flex, Image, Text } from "@chakra-ui/react";
import {
  useDeleteCommentMutation,
  useGetCommentsQuery,
  usePostCommentMutation,
} from "../redux/commentsApiSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

type Props = {
  videoId: string;
};

const Comments = ({ videoId }: Props) => {
  const [text, setText] = useState("");
  const [comments, setComments] = useState<any>([]);
  const { data } = useGetCommentsQuery(videoId);

  const { userInfo } = useSelector((state: any) => state.auth);

  const [postComment] = usePostCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const commentHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const comment: any = await postComment({ videoId, text }).unwrap();
      if (comment) {
        setComments([comment, ...comments]);
        setText("");
        toast.success("Comment Added", { autoClose: 600 });
      }
    } catch (err) {}
  };
  const deleteCommentHandler = async (commentId: string) => {
    if (confirm("Confirm?")) {
      try {
        const resp = await deleteComment({ videoId, commentId }).unwrap();
        if (resp?._id) {
          const newComments = comments.filter(
            (item: any) => item._id !== resp._id
          );
          setComments(newComments);
        }
      } catch (err) {}
    }
  };
  useEffect(() => {
    setComments(data);
  }, [data]);
  return (
    <Container maxW={"976px"} mb={10} px={[1, 4]}>
      {comments && (
        <Text fontWeight={"semibold"}>{comments.length} Comments</Text>
      )}
      {/* comment form start */}
      {userInfo ? (
        <form onSubmit={commentHandler}>
          <div className="comment-form-container">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="comment-input"
              placeholder="Add a comment"
            />
            <button type="submit">Post</button>
          </div>
        </form>
      ) : (
        <Center my={6}>
          <Text>Login To Comment</Text>
        </Center>
      )}
      {/* comment form end */}
      {comments && comments.length === 0 ? (
        <Center my={8}>
          <Text>No Comment Yet!!</Text>
        </Center>
      ) : (
        comments && (
          <Box>
            {comments.map(
              ({ _id, userId, text, userName, userProfilePicture }: any) => (
                <Flex key={_id} my={2}>
                  <Image
                    h={10}
                    w={10}
                    m={1}
                    borderRadius={"50%"}
                    border={"1px solid #c5c7c5"}
                    src={userProfilePicture}
                    cursor={"pointer"}
                  ></Image>
                  <Box flex={1}>
                    <Text
                      cursor="pointer"
                      px={2}
                      id={_id}
                      className="short-desc"
                      fontWeight={"hairline"}
                      fontSize={"15px"}
                      onClick={() => {
                        document
                          .getElementById(_id)
                          ?.classList.toggle("short-desc");
                      }}
                    >
                      {text}
                    </Text>
                    <Text px={2} fontSize={"xs"}>
                      {userName}
                    </Text>
                  </Box>
                  {userInfo && userInfo._id === userId && (
                    <button
                      className="dlt-btn"
                      onClick={() => deleteCommentHandler(_id)}
                    >
                      delete
                    </button>
                  )}
                </Flex>
              )
            )}
          </Box>
        )
      )}
    </Container>
  );
};

export default Comments;
