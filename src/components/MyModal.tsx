import { useRef } from "react";
import {
  Center,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Login from "./Login";
import Register from "./Register";
import { APP_NAME } from "../utils/constants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MyModal = ({ isOpen, onClose }: Props) => {
  const initialRef = useRef(null);
  return (
    <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center fontFamily={"monospace"} fontWeight={"semibold"}>
            {APP_NAME}
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login initialRef={initialRef} onClose={onClose} />
            </TabPanel>
            <TabPanel>
              <Register initialRef={initialRef} onClose={onClose} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  );
};

export default MyModal;
