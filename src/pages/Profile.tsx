import { useState } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../firebase/config";
import Loading from "../components/Loading";
import { setCredentials } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation } from "../redux/authApiSlice";
import { APP_NAME } from "../utils/constants";

const Profile = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState(userInfo.profilePicture);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [update, { isLoading }] = useUpdateUserMutation();

  const onImageChange = async (e: any) => {
    if (!e?.target?.files || !e?.target?.files[0]) {
      return;
    }
    if (
      e?.target?.files[0].type === "image/jpeg" ||
      e?.target?.files[0].type === "image/jpg" ||
      e?.target?.files[0].type === "image/png"
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e) => {
        setImageFile(e?.target?.result);
      };
    } else {
      setImageFile(null);
      toast.error("Unsupported File", { autoClose: 1000 });
    }
  };

  const uploadPicture = async () => {
    if (!imageFile) {
      toast.error("Select A File", { autoClose: 1000 });
      return;
    }
    // upload to firebase
    try {
      setIsImageUploading(true);
      const storageRef = ref(storage, `videos/thumbnail/image-${Date.now()}`);
      await uploadString(storageRef, imageFile, "data_url");
      const url = await getDownloadURL(storageRef);
      setProfilePicture(url);
      toast.success("Profile Picture Uploaded", { autoClose: 1000 });
      setIsImageUploading(false);
      setIsUploaded(true);
    } catch (err) {
      setIsImageUploading(false);
      toast.error("Something Went Wrong", { autoClose: 1000 });
    }
  };
  const handleUpdateProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!name || !email || !profilePicture) {
      toast.error("All fields are required", { autoClose: 1000 });
      return;
    }
    try {
      if (password) {
        const res = await update({
          name,
          email,
          profilePicture,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Updated Successfully", { autoClose: 1000 });
        navigate("/");
        return;
      }
      const res = await update({
        name,
        email,
        profilePicture,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Updated Successfully", { autoClose: 1000 });
      navigate("/");
    } catch (err: any) {
      toast.error(err?.data?.message || err.error, { autoClose: 1000 });
    }
  };

  document.title = `${APP_NAME} - Update Profile`;

  return (
    <Container>
      <Center pt={4}>
        <Heading fontFamily={"monospace"}>Update Profile</Heading>
      </Center>
      <Center my={4}>
        {profilePicture && <Image w={250} h={250} src={profilePicture}></Image>}
      </Center>
      <form onSubmit={handleUpdateProfile}>
        {/* profile picture start */}
        <FormControl>
          <FormLabel htmlFor="thumbnail">Thumbnail</FormLabel>
          <Input
            onChange={onImageChange}
            id="thumbnail"
            type="file"
            className="form-input"
          />
        </FormControl>
        <Button
          bg={"teal.300"}
          my={2}
          type="button"
          size={"xs"}
          className="upload-btn"
          onClick={uploadPicture}
          disabled={isImageUploading}
        >
          Upload
        </Button>
        {isImageUploading && (
          <Box display={"inline-block"} ml={2}>
            <Loading height="20px" width="20px" className="inline-block" />
          </Box>
        )}
        {isUploaded && (
          <Box
            display={"inline-block"}
            bg={"gray.300"}
            borderRadius={20}
            px={3}
            py={"1px"}
            ml={2}
            mt={2}
          >
            Uploaded
          </Box>
        )}
        {/* profile picture end */}
        <FormControl>
          <FormLabel>Enter Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Enter Email</FormLabel>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Enter Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </FormControl>
        <Center py={4}>
          <Button type="submit" colorScheme="blue" mr={3}>
            {isLoading ? "Loading..." : "Update"}
          </Button>
        </Center>
      </form>
    </Container>
  );
};

export default Profile;
