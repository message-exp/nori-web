import { createClient, Code, ConnectError } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
// import { Empty } from "@bufbuild/protobuf/wkt";
import { RoomService } from "@/proto-generated/nori/v0/room/room_service_pb";
import { RoomCreateRequestSchema } from "@/proto-generated/nori/v0/room/room_create_request_pb";
// import { RoomList } from "@/proto-generated/nori/v0/room/room_list_pb";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { transport } from "@/api/client";


export const client = createClient(RoomService, transport);


/**
 * Create a new room
 * @param userId The creator's user id
 * @param roomName The name of the new room
 * @param invitees An array of user ids to invite
 * @returns The id of the created room
 */
export const CreateRoom = async (userId: bigint, roomName: string, invitees: bigint[]): Promise<bigint> => {
    // prepare the request
    const accessToken = "";  // TODO: get access token
    const request = create(RoomCreateRequestSchema, {
        name: roomName,
        creator: create(UserIdSchema, {
            id: userId
        }),
        invitees: invitees.map(user => create(UserIdSchema, {
            id: user
        })),
    });
    let response;

    // send the request
    try {
        response = await client.createRoom(request, { headers: { authorization: accessToken } });
    } catch (error) {
        if (error instanceof ConnectError) {
            const errorCode = error.code;
            console.error("Error Code:", errorCode);
            // console.error("Error Code Message:", error.message);
            // console.error("Error Detail:", error.details);

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
    return response.id;
};
