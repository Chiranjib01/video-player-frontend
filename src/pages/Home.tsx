import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useGetAllVideosQuery } from "../redux/videosApiSlice";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { data: videos, isLoading } = useGetAllVideosQuery(["videos"]);
  return (
    <Box px={2} py={4}>
      <Grid templateColumns="repeat(auto-fit,minmax(300px,1fr))" gap={4}>
        {isLoading ? (
          <>
            {Array.from({ length: 12 }, () =>
              Math.floor(Math.random() * 1000)
            ).map((val) => (
              <GridItem h={60} w={"100%"} maxW={80} mx={"auto"} key={val}>
                <Stack>
                  <Skeleton h={40}></Skeleton>
                  <Flex alignItems={"center"}>
                    <SkeletonCircle size="10" m={1} />
                    <SkeletonText
                      flex={1}
                      mt="1"
                      noOfLines={3}
                      spacing="2"
                      skeletonHeight="2"
                    />
                  </Flex>
                </Stack>
              </GridItem>
            ))}
          </>
        ) : (
          videos.map(
            ({
              _id,
              title,
              userName,
              userProfilePicture,
              thumbnail,
              createdAt,
            }: any) => (
              <GridItem
                cursor={"pointer"}
                key={_id}
                h={60}
                w={"100%"}
                maxW={80}
                mx={"auto"}
                bg={"white"}
                shadow={"md"}
                borderRadius={"lg"}
                transition={"box-shadow 300ms ease-in-out"}
                _hover={{
                  shadow: "xl",
                }}
                onClick={() => navigate(`/video/${_id}`)}
              >
                <Image
                  borderTopRadius={"lg"}
                  h={"170px"}
                  w={"100%"}
                  src={thumbnail}
                ></Image>
                <Flex h={"70px"} alignItems={"center"}>
                  <Image
                    h={10}
                    w={10}
                    m={1}
                    borderRadius={"50%"}
                    border={"1px solid #c5c7c5"}
                    src={userProfilePicture}
                  ></Image>
                  <Box flex={1} maxH={"70px"}>
                    <Text
                      fontSize={"sm"}
                      fontWeight={"semibold"}
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        lineClamp: 2,
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {title}
                    </Text>
                    <Flex alignItems={"center"} gap={2}>
                      <Text fontFamily={"sm"}>{userName}</Text>
                      <Text fontSize={"xs"}>{moment(createdAt).fromNow()}</Text>
                    </Flex>
                  </Box>
                </Flex>
                {/* <video
                controls
                controlsList="nodownload"
                disablePictureInPicture
                style={{
                  width: "100%",
                  height: "100%",
                  outline: "none",
                }}
              >
                <source
                  src="https://firebasestorage.googleapis.com/v0/b/socialmedia-3d7ed.appspot.com/o/videos%2Fvideo%2Fvideo-1645955278343?alt=media&token=41d83cc9-578e-4623-a01a-f7afc5a3f7d5"
                  type="video/mp4"
                />
              </video> */}
              </GridItem>
            )
          )
        )}
      </Grid>
    </Box>
  );
};
export default Home;
