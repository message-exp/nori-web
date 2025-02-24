
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
import { addRoom } from "@/hooks/room-list";

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

export const AddRoomDialog = () => {
  const [addRoomName, setAddRoomName] = useState("");
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <AddRoomButton />
        {/* <Button>test</Button> */}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle >
            <Heading size={"2xl"}>Add Room</Heading>
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
              variant="outline" onClick={() => {
                console.log("cancel");
                setAddRoomName("");
              }}
            >Cancel</Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button onClick={() => addRoom(addRoomName)}>Save</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};