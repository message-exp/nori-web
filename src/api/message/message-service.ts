import { createClient, Code, ConnectError } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import { MessageService } from "@/proto-generated/nori/v0/message/message_service_pb";
import { Message, MessageSchema } from "@/proto-generated/nori/v0/message/message_pb";
import { MessageIdSchema } from "@/proto-generated/nori/v0/message/message_id_pb";
import { RoomIdSchema } from "@/proto-generated/nori/v0/room/room_id_pb";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { Direction, GetMessageRequestSchema } from "@/proto-generated/nori/v0/message/get_message_request_pb";
import { transport } from "@/api/client";


const client = createClient(MessageService, transport);
    

/**
 * Send a message to a room.
 * @param roomId The ID of the room to send the message to.
 * @param author The author's user ID.
 * @param text The message text.
 * @returns `null`. Throws an error if the request fails.
 */
export const SendMessage = async (roomId: bigint, author: bigint, text: string): Promise<null> => {
  // prepare the request
  const accessToken = "";  // TODO: get access token
  const request = create(MessageSchema, {
    roomId: create(RoomIdSchema, {
      id: roomId
    }),
    author: create(UserIdSchema, {
      id: author
    }),
    text: text,
  });

  // send the request
  try {
    await client.sendMessage(request, { headers: { authorization: accessToken } });
  } catch (error) {
    if (error instanceof ConnectError) {
      const errorCode = error.code;
      if (errorCode === Code.Unauthenticated) {
        // TODO: get a new access token and retry
      } else if (errorCode === Code.PermissionDenied) {
        // TODO: handle permission denied case
      }
    }
    // other error
    console.error("Unexpected error when trying to retrieve room list", error);
    throw error;
  }

  // return
  return null;
};


/**
 * Get messages from a room.
 * @param roomId The ID of the room to retrieve messages from.
 * @param baseline The ID of the message to start retrieving from.
 * @param limit The maximum number of messages to retrieve.
 * @returns An async generator that yields messages. Throws an error if the request fails.
 */
export const GetMessage = async function* (roomId: bigint, baseline?: bigint, limit?: number): AsyncGenerator<Message, void, void> {
  // prepare the request
  const accessToken = "";  // TODO: get access token
  const request = create(GetMessageRequestSchema, {
    roomId: create(RoomIdSchema, {
      id: roomId
    }),
    limit: limit || 0,
    baseline: baseline ?  create(MessageIdSchema, {
      id: baseline
    }): create(MessageIdSchema, {
      id: 0n  // 使用 0n 來表示要獲取最新的訊息
    }),
    direction: Direction.OLDER,
  });
  let response;

  // send the request
  try {
    response = client.getMessages(request, { headers: { authorization: accessToken } });
  } catch (error) {
    if (error instanceof ConnectError) {
      const errorCode = error.code;
      if (errorCode === Code.Unauthenticated) {
        // TODO: get a new access token and retry
      } else if (errorCode === Code.PermissionDenied) {
        // TODO: handle permission denied case
      }
    }
    // other error
    console.error("Unexpected error when trying to retrieve room list", error);
    throw error;
  }

  // process the response and return
  for await (const message of response) {
    console.log("Message received", message);
    yield message;
  }
};
