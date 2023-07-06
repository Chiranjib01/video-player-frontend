import { useNavigate, useParams } from "react-router-dom";
import {
  useDislikeVideoMutation,
  useGetVideoByIdQuery,
  useLikeVideoMutation,
  useUndislikeVideoMutation,
  useUnlikeVideoMutation,
} from "../redux/videosApiSlice";
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
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import {
  AiOutlineDislike,
  AiOutlineLike,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
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
import ShareModal from "../components/ShareModal";

const Video = () => {
  const { videoid } = useParams();
  const [channel, setChannel] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isDisLiked, setIsDisLiked] = useState(false);
  const [disLikes, setDisLikes] = useState(0);
  const [isShort, setIsShort] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const [subscribeApiCall] = useSubscribeMutation();
  const [unSubscribeApiCall] = useUnsubscribeMutation();
  const [likeVideoApiCall] = useLikeVideoMutation();
  const [unlikeVideoApiCall] = useUnlikeVideoMutation();
  const [dislikeVideoApiCall] = useDislikeVideoMutation();
  const [undislikeVideoApiCall] = useUndislikeVideoMutation();

  const like = async (videoId: string) => {
    if (isLiked || isDisLiked) return;
    try {
      const resp = await likeVideoApiCall(videoId).unwrap();
      if (resp) {
        toast.success("Liked", { autoClose: 600 });
        setIsLiked(true);
        setLikes((state) => state + 1);
      } else {
        toast.error("Something went wrong", { autoClose: 600 });
      }
    } catch (err) {
      toast.error("Something went wrong", { autoClose: 600 });
    }
  };
  const unLike = async (videoId: string) => {
    if (!isLiked) return;
    try {
      const resp = await unlikeVideoApiCall(videoId).unwrap();
      if (resp) {
        toast.success("Like Removed", { autoClose: 600 });
        setIsLiked(false);
        setLikes((state) => state - 1);
      } else {
        toast.error("Something went wrong", { autoClose: 600 });
      }
    } catch (err) {
      toast.error("Something went wrong", { autoClose: 600 });
    }
  };

  const disLike = async (videoId: string) => {
    if (isDisLiked || isLiked) return;
    try {
      const resp = await dislikeVideoApiCall(videoId).unwrap();
      if (resp) {
        toast.success("DisLiked", { autoClose: 600 });
        setIsDisLiked(true);
        setDisLikes((state) => state + 1);
      } else {
        toast.error("Something went wrong", { autoClose: 600 });
      }
    } catch (err) {
      toast.error("Something went wrong", { autoClose: 600 });
    }
  };
  const unDisLike = async (videoId: string) => {
    if (!isDisLiked) return;
    try {
      const resp = await undislikeVideoApiCall(videoId).unwrap();
      if (resp) {
        toast.success("DisLike Removed", { autoClose: 600 });
        setIsDisLiked(false);
        setDisLikes((state) => state - 1);
      } else {
        toast.error("Something went wrong", { autoClose: 600 });
      }
    } catch (err) {
      toast.error("Something went wrong", { autoClose: 600 });
    }
  };

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

  useEffect(() => {
    set();
    if (userInfo && video) {
      if (video.likes.includes(userInfo._id?.toString())) {
        setIsLiked(true);
      }
    }
    if (video) {
      setLikes(video.likes.length);
    }
  }, [video, isSubscribed, userInfo]);

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
      ) : !video ? (
        <Center mt={40}>
          <Text fontSize={24}>Video Not Found!!</Text>
        </Center>
      ) : (
        <>
          <ShareModal
            url={`https://videoplayer-00.vercel.app/videos/${video._id}`}
            isOpen={isOpen}
            onClose={onClose}
          />
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
                      onClick={() => {
                        if (isLiked) {
                          unLike(video._id);
                        } else {
                          like(video._id);
                        }
                      }}
                    >
                      {isLiked ? (
                        <AiFillLike className="mr-2" />
                      ) : (
                        <AiOutlineLike className="mr-2" />
                      )}
                      {nFormatter(likes)}
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      borderRightRadius="20px"
                      padding="4px 16px 4px 8px"
                      _hover={{ bg: "gray.300" }}
                      transition={"background-color 300ms ease-in"}
                      onClick={() => {
                        if (isDisLiked) {
                          unDisLike(video._id);
                        } else {
                          disLike(video._id);
                        }
                      }}
                    >
                      {isDisLiked ? (
                        <AiFillDislike className="mr-2" />
                      ) : (
                        <AiOutlineDislike className="mr-2" />
                      )}
                      {nFormatter(disLikes)}
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
                    onClick={onOpen}
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
            <Box bg={"gray.100"} py={2} px={2} my={4}>
              <div
                onClick={() => setIsShort(false)}
                className={isShort ? "short-desc" : ""}
              >
                {video.description}
                {/* show less btn */}
              </div>
              {!isShort && (
                <div
                  onClick={() => {
                    setIsShort(true);
                    console.log(isShort);
                  }}
                  className="show-less-btn"
                >
                  Show Less
                </div>
              )}
            </Box>
            <Text fontWeight={"semibold"}>100 Comments</Text>
          </Container>
        </>
      )}
    </>
  );
};

export default Video;
