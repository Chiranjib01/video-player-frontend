import {
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { MutableRefObject, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../redux/authSlice";
import { toast } from "react-toastify";
import { useLoginMutation } from "../redux/authApiSlice";

type Props = {
  initialRef: MutableRefObject<null>;
  onClose: () => void;
};

const Login = ({ initialRef, onClose }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    console.log({ email, password });
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Login Successful", { autoClose: 1000 });
      navigate("/");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || err.error, { autoClose: 1000 });
    }
  };
  return (
    <>
      <form onSubmit={handleLogin}>
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Enter Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              ref={initialRef}
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
            {isLoading ? "Loading..." : "Login"}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </form>
    </>
  );
};

export default Login;
