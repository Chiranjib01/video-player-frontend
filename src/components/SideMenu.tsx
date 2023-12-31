import { Flex, Box, Heading, IconButton } from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLogoutMutation } from "../redux/authApiSlice";
import { deleteCredentials } from "../redux/authSlice";
import { toast } from "react-toastify";

const sideMenuItems: { name: string; path: string }[] | [] = [
  {
    name: "Home",
    path: "/",
  },
];

type SideMenuProps = {
  onOpen: () => void;
  activeItem: string;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
  sideMenu: boolean;
  setSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const SideMenu = ({
  onOpen,
  activeItem,
  setActiveItem,
  sideMenu,
  setSideMenu,
}: SideMenuProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.auth);
  const [menuItems, setMenuItems] = useState<
    { name: string; path: string }[] | never
  >([]);

  const [logout] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
      await logout(["videos"]);
      dispatch(deleteCredentials());
      toast.success("Logged out Successfully", { autoClose: 1000 });
    } catch (err) {
      toast.error("Logout Failed", { autoClose: 1000 });
    }
  };

  useEffect(() => {
    if (userInfo) {
      setMenuItems([
        ...sideMenuItems,
        {
          name: "Create",
          path: "/create",
        },
        {
          name: "Subscriptions",
          path: "/subscriptions",
        },
        {
          name: "My Videos",
          path: "/myvideos",
        },
        {
          name: "Liked Videos",
          path: "/likedvideos",
        },
        {
          name: "Profile",
          path: "/profile",
        },
      ]);
    } else {
      setMenuItems(sideMenuItems);
    }
  }, [userInfo]);

  return (
    <>
      <Flex
        zIndex={20}
        position={"fixed"}
        top={0}
        left={0}
        right={0}
        bottom={0}
      >
        <Box bg={"white"} w={"250px"} p={2} overflowY={"scroll"}>
          <Flex
            position={"absolute"}
            top={0}
            left={2}
            alignItems={"center"}
            gap={2}
            borderBottom={"1px solid #c5c7c5"}
            py={2}
            paddingRight={14}
            marginBottom={2}
            bg={"white"}
          >
            <Box
              onClick={() => setSideMenu((state) => !state)}
              as={IconButton}
              aria-label="Menu"
              icon={sideMenu ? <AiOutlineClose /> : <RxHamburgerMenu />}
              variant="outline"
              borderRadius={"50%"}
            />
            <Heading size="md" onClick={() => navigate("/")} cursor="pointer">
              {APP_NAME}
            </Heading>
          </Flex>
          <Box my={16} />
          {!userInfo && (
            <Box
              cursor={"pointer"}
              textTransform={"capitalize"}
              fontWeight={"semibold"}
              borderRadius={5}
              p={2}
              marginBottom={2}
              _hover={{ bg: "gray.300" }}
              transition={"background-color 400ms ease-in-out"}
              onClick={onOpen}
            >
              Login
            </Box>
          )}
          {/* other links */}
          {menuItems.map(({ name, path }) => (
            <Box
              key={path}
              cursor={"pointer"}
              textTransform={"capitalize"}
              fontWeight={"semibold"}
              borderRadius={5}
              p={2}
              marginBottom={2}
              _hover={{ bg: "gray.300" }}
              transition={"background-color 400ms ease-in-out"}
              onClick={() => {
                setActiveItem(path);
                navigate(path);
                setSideMenu((state) => !state);
              }}
              className={activeItem === path ? "nav-active" : ""}
            >
              {name}
            </Box>
          ))}
          {userInfo && (
            <Box
              cursor={"pointer"}
              textTransform={"capitalize"}
              fontWeight={"semibold"}
              borderRadius={5}
              p={2}
              marginBottom={2}
              _hover={{ bg: "gray.300" }}
              transition={"background-color 400ms ease-in-out"}
              onClick={logoutHandler}
            >
              Logout
            </Box>
          )}
        </Box>
        <Box
          bg={"gray.800"}
          opacity={0.5}
          flex={1}
          onClick={() => setSideMenu((state) => !state)}
        ></Box>
      </Flex>
    </>
  );
};

export default SideMenu;
