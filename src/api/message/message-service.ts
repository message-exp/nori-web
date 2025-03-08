import { createClient, Code, ConnectError } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import { MessageService } from "@/proto-generated/nori/v0/message/message_service_pb";
import {
  Message,
  MessageSchema,
} from "@/proto-generated/nori/v0/message/message_pb";
import { RoomIdSchema } from "@/proto-generated/nori/v0/room/room_id_pb";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import {
  GetLatestMessageRequestSchema,
  GetHistoryMessageRequestSchema,
} from "@/proto-generated/nori/v0/message/get_message_requests_pb";
import { SendMessageRequestSchema } from "@/proto-generated/nori/v0/message/send_message_request_pb";
import { transport } from "@/api/client";
import { MessageId } from "@/proto-generated/nori/v0/message/message_id_pb";

const client = createClient(MessageService, transport);

/**
 * Send a message to a room.
 * @param roomId The ID of the room to send the message to.
 * @param author The author's user ID.
 * @param text The message text.
 * @returns `null`. Throws an error if the request fails.
 */
export const SendMessage = async (
  roomId: bigint,
  author: bigint,
  text: string
):Promise<MessageId> => {
  // prepare the request
  const request = create(SendMessageRequestSchema, {
    roomId: create(RoomIdSchema, {
      id: roomId,
    }),
    author: create(UserIdSchema, {
      id: author,
    }),
    text: text,
  });

  try {
    console.log(request);
    const MessageId = await client.sendMessage(request, {"timeoutMs":0});
    console.log("Successfully sent message");
    return MessageId;
  } catch (error) {
    console.error("Unexpected error when trying to retrieve room list", error);
    throw error;
  }
};

/**
 * Get messages from a room.
 * @param roomId The ID of the room to retrieve messages from.
 * @param userId The ID of the user retrieving the messages.
 * @returns An async generator that yields messages. Throws an error if the request fails.
 */
export const GetLatestMessage = async function* (
  roomId: bigint,
  userId: bigint | undefined
): AsyncGenerator<Message, void, void> {
  const request = create(GetLatestMessageRequestSchema, {
    roomId: create(RoomIdSchema, {
      id: roomId,
    }),
    userId: create(UserIdSchema, {
      id: userId,
    }),
  });
  let response;

  // send the request
  try {
    response = client.getLatestMessages(request);
    console.log("Successfully get message");
  } catch (error) {
    console.error("Unexpected error when trying to retrieve room list", error);
    throw error;
  }
  // process the response and return
  for await (const message of response) {
    console.log("Message received", message);
    yield message;
  }
};
