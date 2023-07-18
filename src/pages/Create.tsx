import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useState } from "react";
import Loading from "../components/Loading";
import { storage } from "../firebase/config";
import stringToArray from "../utils/stringToArray";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useCreateVideoMutation } from "../redux/videosApiSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { APP_NAME } from "../utils/constants";

const Create = () => {
  const { userInfo: user } = useSelector((state: any) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const navigate = useNavigate();
  const [createVideo, { isLoading }] = useCreateVideoMutation();

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

  const onVideoChange = async (e: any) => {
    if (!e?.target?.files || !e?.target?.files[0]) {
      return;
    }
    if (e?.target?.files[0].type === "video/mp4") {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e) => {
        setFile(e?.target?.result);
      };
    } else {
      setFile(null);
      toast.error("Unsupported File", { autoClose: 1000 });
    }
  };

  const uploadThumbnail = async () => {
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
      setThumbnail(url);
      toast.success("Thumbnail Uploaded", { autoClose: 1000 });
      setIsImageUploading(false);
    } catch (err) {
      setIsImageUploading(false);
      toast.error("Something Went Wrong", { autoClose: 1000 });
    }
  };

  const uploadVideo = async () => {
    if (!file) {
      toast.error("Select A File", { autoClose: 1000 });
      return;
    }
    // upload to firebase
    try {
      setIsUploading(true);
      const storageRef = ref(storage, `videos/video/video-${Date.now()}`);
      await uploadString(storageRef, file, "data_url");
      const url = await getDownloadURL(storageRef);
      setUrl(url);
      toast.success("Video Uploaded", { autoClose: 1000 });
      setIsUploading(false);
    } catch (err) {
      setIsUploading(false);
      toast.error("Something Went Wrong", { autoClose: 1000 });
    }
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    if (!user) {
      return;
    }
    if (
      !title.trim() ||
      !description.trim() ||
      !thumbnail ||
      !url ||
      !tags.trim() ||
      !user._id
    ) {
      toast.error("All fields are required", { autoClose: 1000 });
      return;
    }
    // save video
    try {
      setLoading(true);
      const video = await createVideo({
        title,
        description,
        url,
        thumbnail,
        tags: stringToArray(tags),
        userId: user._id,
      }).unwrap();
      setLoading(false);
      setTitle("");
      setTags("");
      setUrl("");
      setThumbnail("");
      setDescription("");
      toast.success("Video Published Successfully", { autoClose: 1000 });
      navigate(`/videos/${video._id}`);
    } catch (err) {
      setLoading(false);
      toast.success("Some error occured", { autoClose: 1000 });
    }
  };

  document.title = `${APP_NAME} - Create`;

  return (
    <Container my={6}>
      <Center py={4}>
        <Heading fontFamily={"monospace"}>Upload Video</Heading>
      </Center>
      <form onSubmit={submitHandler}>
        <FormControl>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            type="text"
            className="form-input"
            placeholder="Enter Title ..."
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            rows={10}
            className="form-input"
            placeholder="Enter Description ..."
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="tags">Tags</FormLabel>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            id="tags"
            type="text"
            className="form-input"
            placeholder="Enter tags Separated by , (comma)"
          />
        </FormControl>
        {/* thumbnail */}
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
          size={"xs"}
          bg={"teal.300"}
          my={2}
          type="button"
          className="upload-btn"
          onClick={uploadThumbnail}
          disabled={isImageUploading}
        >
          Upload
        </Button>
        {isImageUploading && (
          <Box display={"inline-block"} ml={2}>
            <Loading height="20px" width="20px" className="inline-block" />
          </Box>
        )}
        {thumbnail && (
          <Box
            display={"inline-block"}
            bg={"gray.300"}
            borderRadius={20}
            px={4}
            py={1}
            ml={2}
          >
            Uploaded
          </Box>
        )}
        {/* video */}
        <FormControl>
          <FormLabel htmlFor="video">Video</FormLabel>
          <Input
            onChange={onVideoChange}
            id="video"
            type="file"
            className="form-input"
          />
        </FormControl>
        <Button
          size={"xs"}
          my={2}
          bg={"teal.300"}
          type="button"
          onClick={uploadVideo}
          disabled={isUploading || !file}
        >
          Upload
        </Button>
        {isUploading && (
          <Box display={"inline-block"} ml={2}>
            <Loading height="20px" width="20px" className="inline-block" />
          </Box>
        )}
        {url && (
          <Box
            display={"inline-block"}
            bg={"gray.300"}
            borderRadius={20}
            px={4}
            py={1}
            ml={2}
          >
            Uploaded
          </Box>
        )}
        <Center>
          <Button
            bg={"teal.300"}
            className="submit-btn"
            type="submit"
            disabled={loading || isLoading}
          >
            {loading || isLoading ? (
              <Loading height="20px" width="20px" />
            ) : (
              "Publish"
            )}
          </Button>
        </Center>
      </form>
    </Container>
  );
};

export default Create;
