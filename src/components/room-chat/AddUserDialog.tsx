
import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
import { InviteToRoom } from "@/api/room/room-member-service";

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
        <Heading size={"2xl"}>Invite User</Heading>
      </Center>
    </Button>
  );
});

export const AddRoomDialog = () => {
  const [addUserId, setaddUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { roomId } = useParams();


  const handleInvite = async () => {
    try {
      setIsLoading(true);
      const userId = storage.getUserId();
      if (!userId) {
        throw new Error("user id is null or undifined");
      }
      if (!roomId) {
        throw new Error("room id is null or undifined");
      }
      console.log(roomId)
      await InviteToRoom(BigInt(roomId), userId, [BigInt(addUserId)]);
      setaddUserId("");
      setOpenDialog(false);

    } catch (error) {
      console.error("Failed to invite user:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <DialogRoot open={openDialog} onOpenChange={(e) => setOpenDialog(e.open)}>
      <DialogTrigger asChild>
        <AddRoomButton />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle >
            Invite User
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Field label="Enter User Id">
            <Input
              placeholder="User Id"
              value={addUserId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log("change");
                setaddUserId(e.target.value);
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
                setaddUserId("");
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogActionTrigger>
          {/* <DialogActionTrigger asChild>
            
          </DialogActionTrigger> */}
          <Button
            onClick={handleInvite}
            loading={isLoading}
          >
            Invite
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};