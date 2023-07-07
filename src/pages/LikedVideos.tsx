import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { useGetLikedVideosQuery } from "../redux/videosApiSlice";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const LikedVideos = () => {
  const { data: videos, isLoading } = useGetLikedVideosQuery(["videos"], {
    refetchOnMountOrArgChange: true,
  });
  const navigate = useNavigate();
  return (
    <>
      <Center mt={6}>
        <Heading fontFamily={"monospace"}>Liked Videos</Heading>
      </Center>
      <Container maxW={"container.md"} my={6}>
        {isLoading ? (
          <Center my={20}>
            <Text>Loading...</Text>
          </Center>
        ) : videos.length === 0 ? (
          <Center mt={28}>
            <Text fontSize={20}>You Haven&apos;t Liked!!</Text>
          </Center>
        ) : (
          videos && (
            <Box>
              {videos.map(
                ({ _id, thumbnail, title, description, createdAt }: any) => (
                  <Flex
                    onClick={() => navigate(`/videos/${_id}`)}
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
                    <Image src={thumbnail} h={"120px"} w={"150px"} mr={2} />
                    <Box>
                      <Text fontWeight={"semibold"} className="truncate-1">
                        {title}
                      </Text>
                      <Text className="truncate-3">{description}</Text>
                      <Text fontSize={"sm"} fontWeight={"semibold"} mt={1}>
                        {moment(createdAt).format("DD MMMM YYYY")}
                      </Text>
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

export default LikedVideos;
