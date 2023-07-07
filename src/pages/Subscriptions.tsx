import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/constants";
import { toast } from "react-toastify";
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Subscriptions = () => {
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<any>([]);
  const { userInfo } = useSelector((state: any) => state.auth);

  const navigate = useNavigate();

  const getChannels = async () => {
    try {
      const data = userInfo.subscribed.map(async (item: any) => {
        const resp = await fetch(`${API_URL}/api/users/user/${item.channelId}`);
        const channel = await resp.json();
        return channel;
      });

      return Promise.all(data);
    } catch (err) {
      toast.error("Something went wrong", { autoClose: 600 });
      return [];
    }
  };

  const setInfo = async () => {
    setLoading(true);
    const info = await getChannels();
    setChannels(info);
    setLoading(false);
  };
  useEffect(() => {
    setInfo();
  }, [userInfo]);
  return (
    <>
      <Grid
        templateColumns="repeat(auto-fit,minmax(300px,1fr))"
        gap={4}
        my={10}
      >
        {loading ? (
          <Center my={20}>
            <Text>Loading...</Text>
          </Center>
        ) : channels.length === 0 ? (
          <Center mt={28}>
            <Text fontSize={20}>No Channel Subscribed</Text>
          </Center>
        ) : (
          channels.map(
            ({ _id, name, subscriberCount, profilePicture }: any) => (
              <>
                <GridItem
                  cursor={"pointer"}
                  key={_id}
                  h={60}
                  w={"100%"}
                  maxW={60}
                  mx={"auto"}
                  bg={"white"}
                  shadow={"md"}
                  borderRadius={"lg"}
                  borderTop={"1px solid"}
                  borderColor={"gray.200"}
                  py={2}
                  transition={"box-shadow 300ms ease-in-out"}
                  _hover={{
                    shadow: "xl",
                  }}
                  onClick={() => navigate(`/users/${_id}`)}
                >
                  <Image
                    borderTopRadius={"lg"}
                    mx={"auto"}
                    h={"170px"}
                    w={"80%"}
                    borderRadius={20}
                    src={profilePicture}
                  ></Image>
                  <Flex h={"70px"} alignItems={"center"}>
                    <Box flex={1} maxH={"70px"}>
                      <Text
                        fontSize={"sm"}
                        fontWeight={"semibold"}
                        textAlign={"center"}
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          lineClamp: 2,
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {name}
                      </Text>
                      <Flex
                        justifyContent={"center"}
                        alignItems={"center"}
                        gap={2}
                      >
                        Subscribers :
                        <Text fontFamily={"sm"}>{subscriberCount}</Text>
                      </Flex>
                    </Box>
                  </Flex>
                </GridItem>
              </>
            )
          )
        )}
      </Grid>
    </>
  );
};

export default Subscriptions;
