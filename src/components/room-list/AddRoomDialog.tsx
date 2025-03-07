
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
import { storage } from "@/utils/storage/user-storage";
import { CreateRoom, GetRoomBasic } from "@/api/room/room-general-service";
import { RoomBasicInfoResponse } from "@/proto-generated/nori/v0/room/general/room_basic_info_response_pb";

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
  onRoomAdded?: (inputRoom: RoomBasicInfoResponse) => void;
}

export const AddRoomDialog = ({ onRoomAdded }: AddRoomDialogProps) => {
  const [addRoomName, setAddRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const userId = storage.getUserId();
      if (!userId) {
        throw new Error("user id is null or undifined");
      }
      const newRoomId = await CreateRoom(addRoomName, userId, []);
      const newRoomBasicInfo = await GetRoomBasic(newRoomId, userId);
      setAddRoomName("");
      onRoomAdded?.(newRoomBasicInfo);
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to add room:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DialogRoot open={openDialog} onOpenChange={(e) => setOpenDialog(e.open)}>
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
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogActionTrigger>
          {/* <DialogActionTrigger asChild>
            
          </DialogActionTrigger> */}
          <Button
            onClick={handleSave}
            loading={isLoading}
          >
            Save
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};