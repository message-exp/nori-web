import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { create } from "@bufbuild/protobuf";
import { UserService } from "@/proto-generated/nori/v0/user/user_service_pb";
import { UserEmailPasswordLoginSchema } from "@/proto-generated/nori/v0/user/user_login_pb";
import config from "@/utils/config";

const transport = createConnectTransport({
    baseUrl: config.backendUrl,
});

// Here we make the client itself, combining the service
// definition with the transport.
const client = createClient(UserService, transport);

export const login = async (input_email: string, input_password: string): Promise<any> => {
    console.info("get login info");
    console.info("email: ", input_email);
    console.info("password: ", input_password);
    // 準備登入請求
    const loginRequest = create(UserEmailPasswordLoginSchema, {
        email: input_email,
        password: input_password
    })

    // 執行登入請求
    try {
        // const response = await client.login(loginRequest);
        const response = "test_OK[if you see this, it just a test]";
        console.log("登入成功", response);
        return response;
    } catch (error) {
        console.error("登入失敗", error);
        throw error;
    }
}


