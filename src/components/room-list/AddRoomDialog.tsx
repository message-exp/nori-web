
import React, { useState } from "react";
import { Button, Center, DialogCloseTrigger, Heading, Icon, Input } from "@chakra-ui/react";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { addRoom } from "@/utils/grpc-helper";

interface AddRoomButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const AddRoomButton = React.forwardRef<HTMLButtonElement, AddRoomButtonProps>((props, ref) => {
  return (
    <Button variant={"surface"} {...props} ref={ref}>
      <Center inline gap={"2"}>
        <Icon size={"xl"}>
          <IoMdAddCircleOutline />
        </Icon>
        <Heading size={"2xl"}>ADD ROOM</Heading>
      </Center>
    </Button>
  );
});

interface AddRoomDialogProps {
  onRoomAdded?: () => void;
}

export const AddRoomDialog = ({ onRoomAdded }: AddRoomDialogProps) => {
  const [addRoomName, setAddRoomName] = useState("");

  const handleSave = async () => {
    await addRoom(addRoomName);
    setAddRoomName(""); // 清空輸入
    onRoomAdded?.(); // 調用更新函數
  };
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <AddRoomButton />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle >
            Add Room
          </DialogTitle>

        </DialogHeader>
        <DialogBody>
          <Field label="Room name">
            <Input
              placeholder="room name"
              value={addRoomName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log("change");
                setAddRoomName(e.target.value);
              }}
            />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                console.log("cancel");
                setAddRoomName("");
              }}
            >
              Cancel
            </Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button onClick={handleSave}>Save</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};