import { createClient } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
// import { Empty } from "@bufbuild/protobuf/wkt";
import { RoomList } from "@/proto-generated/nori/v0/room/room_list_pb";
import { TokenPair } from "@/proto-generated/nori/v0/user/token_pair_pb";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { UserEmailPasswordLoginSchema } from "@/proto-generated/nori/v0/user/user_login_pb";
import { UserService } from "@/proto-generated/nori/v0/user/user_service_pb";


import { transport } from "@/api/client";

// Here we make the client itself, combining the service
// definition with the transport.
const client = createClient(UserService, transport);

export const GetUserRoomList = async (userId: bigint): Promise<RoomList> => {
    // prepare request
    const request = create(UserIdSchema, {
        id: userId
    });
    // send request
    try {
        const response = await client.getUserRoomList(request);
        console.log("Room list retrieved successfully", response);
        return response;
    } catch (error) {
        console.error("Failed to retrieve room list", error);
        throw error;
    }
};

export const login = async (input_email: string, input_password: string): Promise<TokenPair> => {
    console.info("get login info");
    console.info("email: ", input_email);
    console.info("password: ", input_password);
    // 準備登入請求
    const loginRequest = create(UserEmailPasswordLoginSchema, {
        email: input_email,
        password: input_password
    });

    // 執行登入請求
    try {
        const response = await client.login(loginRequest);
        // const response = "test_OK[if you see this, it just a test]";
        console.log("登入成功", response);
        return response;
    } catch (error) {
        console.error("登入失敗", error);
        throw error;
    }
};


