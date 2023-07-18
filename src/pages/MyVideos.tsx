import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  useDeleteVideoMutation,
  useGetMyVideosQuery,
} from "../redux/videosApiSlice";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { APP_NAME } from "../utils/constants";

const MyVideos = () => {
  const [videos, setVideos] = useState<any>([]);
  const { data, isLoading } = useGetMyVideosQuery(["videos"]);
  const navigate = useNavigate();
  const [deleteVideo] = useDeleteVideoMutation();
  const handleDelete = async (videoId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const video = await deleteVideo(videoId).unwrap();
      if (video) {
        const newVideos = videos.filter((item: any) => item._id !== videoId);
        setVideos(newVideos);
        toast.success("Video Deleted", { autoClose: 600 });
      }
    } catch (err) {
      toast.error("Something went wrong", { autoClose: 600 });
    }
  };

  useEffect(() => {
    if (data) {
      setVideos(data);
    }
  }, [data]);

  document.title = `${APP_NAME} - My Videos`;

  return (
    <>
      <Center mt={6}>
        <Heading fontFamily={"monospace"}>My Videos</Heading>
      </Center>
      <Container maxW={"container.md"} my={6}>
        {isLoading ? (
          <Center my={20}>
            <Text>Loading...</Text>
          </Center>
        ) : videos.length === 0 ? (
          <Center mt={28}>
            <Text fontSize={20}>You Haven&apos;t Uploaded</Text>
          </Center>
        ) : (
          videos && (
            <Box>
              {videos.map(
                ({ _id, thumbnail, title, description, createdAt }: any) => (
                  <Flex
                    key={_id}
                    px={2}
                    py={1}
                    my={4}
                    borderRadius={12}
                    border={"1px solid"}
                    borderColor={"gray.400"}
                    cursor={"pointer"}
                    boxShadow={"md"}
                    transition={"box-shadow 400ms ease-in-out"}
                    _hover={{
                      boxShadow: "lg",
                    }}
                  >
                    <Image
                      src={thumbnail}
                      h={["120px"]}
                      w={["125px", "150px"]}
                      mr={2}
                      onClick={() => navigate(`/videos/${_id}`)}
                    />
                    <Box>
                      <Text
                        fontWeight={"semibold"}
                        className="truncate-1"
                        onClick={() => navigate(`/videos/${_id}`)}
                      >
                        {title}
                      </Text>
                      <Text
                        className="truncate-3"
                        onClick={() => navigate(`/videos/${_id}`)}
                      >
                        {description}
                      </Text>
                      <Flex justifyContent={"space-between"}>
                        <Text
                          fontSize={"sm"}
                          fontWeight={"semibold"}
                          mt={1}
                          onClick={() => navigate(`/videos/${_id}`)}
                        >
                          {moment(createdAt).format("DD MMMM YYYY")}
                        </Text>
                        <button
                          className="dlt-btn"
                          onClick={() => handleDelete(_id)}
                        >
                          Delete
                        </button>
                      </Flex>
                    </Box>
                  </Flex>
                )
              )}
            </Box>
          )
        )}
      </Container>
    </>
  );
};

export default MyVideos;
