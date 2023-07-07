import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { useGetVideosByUserIdQuery } from "../redux/videosApiSlice";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserByIdQuery } from "../redux/authApiSlice";
import nFormatter from "../utils/nFormatter";

const ChannelProfile = () => {
  const { userId } = useParams();
  const { data: videos, isLoading } = useGetVideosByUserIdQuery(userId);
  const { data: user } = useGetUserByIdQuery(userId);
  const navigate = useNavigate();
  return (
    <>
      {user && (
        <Box mt={10} mx={"auto"} textAlign={"center"}>
          <Image
            mx={"auto"}
            src={user.profilePicture}
            h={["100px", "160px"]}
            w={["100px", "160px"]}
            borderRadius={"50%"}
          />
          <Text fontSize={"20px"} fontWeight={"semibold"} mt={2}>
            {user.name}
          </Text>
          <Text fontSize={"md"} mt={2}>
            Subscribers : {nFormatter(user.subscriberCount)}
          </Text>
        </Box>
      )}
      <Center mt={5}>
        <Heading fontSize={"xl"} fontFamily={"monospace"}>
          Videos
        </Heading>
      </Center>
      <Container maxW={"container.md"} my={6}>
        {isLoading ? (
          <Center my={20}>
            <Text>Loading...</Text>
          </Center>
        ) : (
          videos && (
            <Box>
              {videos.map(
                ({ _id, thumbnail, title, description, createdAt }: any) => (
                  <>
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
                  </>
                )
              )}
            </Box>
          )
        )}
      </Container>
    </>
  );
};

export default ChannelProfile;
