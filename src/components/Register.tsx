import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { MutableRefObject } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../redux/authApiSlice";
import { storage } from "../firebase/config";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Loading from "./Loading";

type Props = {
  initialRef: MutableRefObject<null>;
  onClose: () => void;
};

const Register = ({ initialRef, onClose }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state: any) => state.auth);

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
    } catch (err) {
      setIsImageUploading(false);
      toast.error("Something Went Wrong", { autoClose: 1000 });
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !profilePicture) {
      toast.error("All fields are required", { autoClose: 1000 });
      return;
    }
    try {
      const res = await register({
        name,
        email,
        password,
        profilePicture,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Registration Successful", { autoClose: 1000 });
      navigate("/");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || err.error, { autoClose: 1000 });
    }
  };
  return (
    <>
      <form onSubmit={handleRegister}>
        <ModalBody pb={6}>
          {/* profile picture start */}
          <FormControl>
            <FormLabel htmlFor="profilePicture">Profile Picture</FormLabel>
            <Input
              onChange={onImageChange}
              id="profilePicture"
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
          {profilePicture && (
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
              ref={initialRef}
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
        </ModalBody>

        <ModalFooter>
          <Button type="submit" colorScheme="blue" mr={3}>
            {isLoading ? "Loading..." : "SignUp"}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </form>
    </>
  );
};

export default Register;
