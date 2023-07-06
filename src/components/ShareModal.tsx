import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { toast } from "react-toastify";

type Props = {
  url: string;
  isOpen: boolean;
  onClose: () => void;
};

const ShareModal = ({ url, isOpen, onClose }: Props) => {
  const copyToClipBoard = () => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to Clipboard", { autoClose: 500 });
  };
  return (
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={url} />
          </ModalBody>
          <ModalFooter>
            <Button
              variant={"outline"}
              colorScheme="red"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={copyToClipBoard}
            >
              Copy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShareModal;
