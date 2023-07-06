import { useNavigate, useParams } from "react-router-dom";
import { useGetVideoByIdQuery } from "../redux/videosApiSlice";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Image,
  Skeleton,
  Spacer,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { useState, useEffect } from "react";
import { API_URL } from "../utils/constants";
import { toast } from "react-toastify";
import nFormatter from "../utils/nFormatter";
import {
  useSubscribeMutation,
  useUnsubscribeMutation,
} from "../redux/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/authSlice";

const Video = () => {
  const { videoid } = useParams();
  const [channel, setChannel] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: video, isLoading } = useGetVideoByIdQuery(videoid);
  const { userInfo } = useSelector((state: any) => state.auth);

  const getUser = async () => {
    try {
      const resp = await fetch(`${API_URL}/api/users/user/${video.userId}`);
      const user = await resp.json();
      return user;
    } catch (err) {}
  };
  const set = async () => {
    const user = await getUser();
    if (user && userInfo) {
      for (let subscriber of user.subscribers) {
        for (let subscribed of userInfo.subscribed) {
          if (subscriber.channelId === subscribed.channelId) {
            setIsSubscribed(true);
          }
        }
      }
    }
    setChannel(user);
  };
  useEffect(() => {
    set();
    console.log(isSubscribed);
  }, [video, isSubscribed, userInfo]);

  const [subscribeApiCall] = useSubscribeMutation();
  const [unSubscribeApiCall] = useUnsubscribeMutation();
  const subscribe = async (channelId: string) => {
    if (isSubscribed) return;
    try {
      const resp = await subscribeApiCall(channelId).unwrap();
      if (resp.user) {
        toast.success("Channel Subscribed", { autoClose: 1000 });
        dispatch(setCredentials({ ...resp.user }));
        setIsSubscribed(true);
      } else {
        toast.error("Something went wrong", { autoClose: 1000 });
      }
    } catch (err) {
      toast.error("Something went wrong", { autoClose: 1000 });
    }
  };
  const unsubscribe = async (channelId: string) => {
    if (!isSubscribed) return;
    try {
      const resp = await unSubscribeApiCall(channelId).unwrap();
      if (resp.user) {
        dispatch(setCredentials({ ...resp.user }));
        toast.success("Channel Unsubscribed", { autoClose: 1000 });
        setIsSubscribed(false);
      } else {
        toast.error("Something went wrong", { autoClose: 1000 });
      }
    } catch (err) {
      toast.error("Something went wrong", { autoClose: 1000 });
    }
  };
  return (
    <>
      {isLoading ? (
        <>
          <Box mx={"auto"} p={4} maxH={"80vh"} h={""} maxW={"container.lg"}>
            <AspectRatio ratio={11 / 6}>
              <Skeleton></Skeleton>
            </AspectRatio>
          </Box>
        </>
      ) : (
        video && (
          <>
            <Center p={4}>
              <video
                width={940}
                style={{
                  maxHeight: "70vh",
                  backgroundColor: "#dedcdc",
                }}
                controlsList="nodownload"
                disablePictureInPicture
                controls
                autoPlay
                autoFocus
                poster={video.thumbnail}
              >
                <source src={video.url} type="video/mp4" />
              </video>
            </Center>
            <Container maxW={"976px"} px={4} py={0}>
              <Heading
                fontSize={"xl"}
                fontFamily="Times New Roman"
                textTransform={"capitalize"}
              >
                {video.title}
              </Heading>
              {channel && (
                <Flex gap={2} my={2} alignItems={"center"} flexWrap={"wrap"}>
                  <Image
                    h={10}
                    w={10}
                    m={1}
                    borderRadius={"50%"}
                    border={"1px solid #c5c7c5"}
                    src={channel.profilePicture}
                    cursor={"pointer"}
                    onClick={() => navigate(`/users/${channel._id}`)}
                  ></Image>
                  <Box>
                    <Text
                      onClick={() => navigate(`/users/${channel._id}`)}
                      fontWeight={"semibold"}
                      cursor={"pointer"}
                    >
                      {channel.name}
                    </Text>
                    <Text fontSize={"xs"}>
                      {nFormatter(channel.subscribers.length)} Subscribers
                    </Text>
                  </Box>
                  <Button
                    bg="teal.300"
                    _hover={{ bg: "teal.400" }}
                    borderRadius={20}
                    py={1}
                    onClick={() => {
                      if (isSubscribed) {
                        unsubscribe(channel._id);
                      } else {
                        subscribe(channel._id);
                      }
                    }}
                  >
                    {isSubscribed ? "Unsubscribe" : "Subscribe"}
                  </Button>
                  <Spacer />
                  <Flex alignItems={"center"} gap={2} pl={1}>
                    <Flex
                      bg={"gray.200"}
                      alignItems={"center"}
                      borderRadius={20}
                      cursor={"pointer"}
                      fontWeight={"semibold"}
                    >
                      <Box
                        _hover={{ bg: "gray.300" }}
                        borderLeftRadius="20px"
                        borderRight="1px solid gray"
                        display="flex"
                        alignItems="center"
                        padding="4px 8px 4px 16px"
                        transition={"background-color 300ms ease-in"}
                        // onClick={()=>like(video._id)}
                      >
                        <AiOutlineLike className="mr-2" />
                        {nFormatter(video.likes.length)}
                      </Box>
                      <Box
                        borderRightRadius="20px"
                        padding="8px 16px 8px 8px"
                        _hover={{ bg: "gray.300" }}
                        transition={"background-color 300ms ease-in"}
                      >
                        <AiOutlineDislike />
                      </Box>
                    </Flex>
                    <Flex
                      bg={"gray.200"}
                      alignItems={"center"}
                      borderRadius={20}
                      cursor={"pointer"}
                      fontWeight={"semibold"}
                      px={4}
                      py={1}
                      _hover={{ bg: "gray.300" }}
                      transition={"background-color 300ms ease-in"}
                    >
                      Share
                    </Flex>
                  </Flex>
                </Flex>
              )}
            </Container>
            <Container maxW={"976px"} px={4} py={2}>
              <Flex alignItems={"center"} gap={2} flexWrap={"wrap"}>
                <Text fontWeight={"semibold"} fontSize={"sm"}>
                  {moment(video.createdAt).format("DD MMMM YYYY")}
                </Text>
                <Flex gap={2} flexWrap={"wrap"}>
                  {video.tags.map((tag: string) => (
                    <Text key={tag} color={"blue.400"} cursor={"pointer"}>
                      #{tag}
                    </Text>
                  ))}
                </Flex>
              </Flex>
              <Flex bg={"gray.100"} py={2} px={2} my={4}>
                {video.description}
              </Flex>
              <Text fontWeight={"semibold"}>100 Comments</Text>
            </Container>
          </>
        )
      )}
    </>
  );
};

export default Video;
