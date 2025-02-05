import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { UserService } from "@/proto-generated/nori/v0/user/user_service_pb";
import { UserEmailPasswordLoginSchema } from "@/proto-generated/nori/v0/user/user_login_pb";
import { create } from "@bufbuild/protobuf";


const transport = createConnectTransport({
    baseUrl: "http://192.168.1.200:50051",
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
        const response = await client.login(loginRequest);
        console.log("登入成功", response);
    } catch (error) {
        console.error("登入失敗", error);
    }
}


