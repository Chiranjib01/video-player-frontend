import { useParams } from "react-router-dom";
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

const Video = () => {
  const { videoid } = useParams();
  const { data: video, isLoading } = useGetVideoByIdQuery(videoid);
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
                controls
                autoPlay
                autoFocus
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
              <Flex gap={2} my={2} alignItems={"center"} flexWrap={"wrap"}>
                <Image
                  h={10}
                  w={10}
                  m={1}
                  borderRadius={"50%"}
                  border={"1px solid #c5c7c5"}
                  src={video.userProfilePicture}
                ></Image>
                <Box>
                  <Text fontWeight={"semibold"} cursor={"pointer"}>
                    {video.userName}
                  </Text>
                  <Text fontSize={"xs"}>3.31M Subscribers</Text>
                </Box>
                <Button
                  bg="teal.300"
                  _hover={{ bg: "teal.400" }}
                  borderRadius={20}
                  py={1}
                >
                  Subscribe
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
                    >
                      <AiOutlineLike /> 6.8K
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
            </Container>
            <Container maxW={"976px"} px={4} py={2}>
              <Flex alignItems={"center"} gap={2} flexWrap={"wrap"}>
                <Text fontWeight={"semibold"} fontSize={"sm"}>
                  {moment(video.createdAt).format("DD MMMM YYYY")}
                </Text>
                <Flex gap={2} flexWrap={"wrap"}>
                  {video.tags.map((tag: string) => (
                    <Text color={"blue.400"} cursor={"pointer"}>
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
