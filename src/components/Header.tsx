import { useLocation, useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Button,
  Heading,
  IconButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineClose, AiOutlineArrowLeft } from "react-icons/ai";
import { GoSearch } from "react-icons/go";
import SideMenu from "./SideMenu";
import HeaderProps from "../types/HeaderProps";
import MyModal from "./MyModal";
import { APP_NAME } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../redux/authApiSlice";
import { deleteCredentials } from "../redux/authSlice";

const navItems: { name: string; path: string }[] | [] = [
  // {
  //   name: "Contact",
  //   path: "/contact",
  // },
  // {
  //   name: "profile",
  //   path: "/profile",
  // },
];

const Header = ({ sideMenu, setSideMenu }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [activeItem, setActiveItem] = useState("");
  const [search, setSearch] = useState("");
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: any) => state.auth);
  const [logout] = useLogoutMutation();

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (search.length === 0) return;
    navigate(`/search/${search}`);
  };

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
    setActiveItem(pathname);
  }, [pathname]);

  return (
    <>
      <Flex
        minWidth="max-content"
        alignItems="center"
        gap="2"
        p={2}
        shadow="md"
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
        <div className="show-md flex-1" />
        <Box flex={1} className="hide-md">
          <form onSubmit={handleSearch}>
            <FormControl position={"relative"} maxW={500} mx={"auto"}>
              <FormLabel
                position={"absolute"}
                cursor={"pointer"}
                border={"1px solid #ddd"}
                borderLeftRadius={20}
                py={"11px"}
                px={4}
                mr={0}
                mb={0}
                zIndex={1}
              >
                <GoSearch />
              </FormLabel>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                pl={14}
                borderRadius={20}
              />
            </FormControl>
          </form>
        </Box>
        {isSearchOpen ? (
          <form
            style={{ position: "fixed", left: 0, right: 0, zIndex: 5 }}
            onSubmit={handleSearch}
          >
            <Box display={"flex"} px={2} bg={"white"}>
              <Box
                cursor={"pointer"}
                borderY={"1px solid #ddd"}
                borderLeft={"1px solid #ddd"}
                display={"flex"}
                alignItems={"center"}
                px="11px"
                borderLeftRadius={10}
                onClick={() => setIsSearchOpen((state) => !state)}
              >
                <AiOutlineArrowLeft />
              </Box>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                borderLeftRadius={0}
                placeholder="Search"
              />
            </Box>
          </form>
        ) : (
          <Box
            className="show-md"
            cursor={"pointer"}
            borderRadius={"50%"}
            py="11px"
            px={4}
            mr={0}
            mb={0}
            _hover={{
              bg: "gray.100",
            }}
            onClick={() => setIsSearchOpen((state) => !state)}
          >
            <GoSearch />
          </Box>
        )}
        {navItems.map(({ name, path }) => (
          <Box
            key={path}
            px={3}
            py={1}
            fontWeight={"semibold"}
            fontSize={"sm"}
            borderRadius={20}
            cursor={"pointer"}
            _hover={{ bg: "gray.300" }}
            transition={"background-color 400ms ease-in-out"}
            onClick={() => {
              setActiveItem(path);
              navigate(path);
            }}
            className={activeItem === path ? "nav-active" : ""}
          >
            {name}
          </Box>
        ))}
        {userInfo ? (
          <Button
            onClick={logoutHandler}
            size="sm"
            textAlign="center"
            colorScheme="teal"
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={onOpen}
            size="sm"
            textAlign="center"
            colorScheme="teal"
          >
            Login
          </Button>
        )}
        <MyModal isOpen={isOpen} onClose={onClose} />
      </Flex>
      {sideMenu && (
        <SideMenu
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          sideMenu={sideMenu}
          setSideMenu={setSideMenu}
        />
      )}
    </>
  );
};

export default Header;
