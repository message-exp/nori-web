import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { create } from "@bufbuild/protobuf";
import { UserService } from "@/proto-generated/nori/v0/user/user_service_pb";
import { UserEmailPasswordLoginSchema } from "@/proto-generated/nori/v0/user/user_login_pb";
import config from "@/utils/config";

const transport = createConnectTransport({
    baseUrl: config.backendUrl,
});


const client = createClient(UserService, transport);

const api_mode = config.api_mode;

export const login = async (input_email: string, input_password: string): Promise<any> => {
    console.info("get login info");
    console.info("email: ", input_email);
    console.info("password: ", input_password);

    if (api_mode === "MOCK") {
        if (input_email === "test" && input_password === "test123")
        {
            const response = "test_OK[if you see this, it just a test]";
            console.debug("登入成功", response);
            return response;
        }
        else
        {
            console.error("登入失敗: Email or Password not right");
            throw new Error("Email or Password not right");
        }
    }

    // 準備登入請求
    const loginRequest = create(UserEmailPasswordLoginSchema, {
        email: input_email,
        password: input_password
    })

    // 執行登入請求
    try {
        const response = await client.login(loginRequest);
        console.log("登入成功", response);
        return response;
    } catch (error) {
        console.error("登入失敗", error);
        throw error;
    }
}

export const signup = async (input_name: string, input_email: string, input_password: string): Promise<any> => {
    console.log("get signup info");
    console.info("name: ", input_name);
    console.info("email: ", input_email);
    console.info("password: ", input_password);

    // verify is input valid
    // name
    if (!input_name || input_name.trim() === ''){
        throw new Error("name is empty")
    }

    //email
    if (!input_email) {
        throw new Error("Email is empty")
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input_email)) {
        throw new Error('Invalid email address');
    }

    //password
    if (!input_password || input_password.trim() === '') {
        throw new Error("password is empty")
    }


    if (api_mode === "MOCK") {
        if (Math.random() < 0.5){
            const response = "test_OK[if you see this, it just a test]";
            console.debug("signup successful", response);
            return response;
        }
        else {
            console.error("signup fail: just not good luck");
            throw new Error("just not good luck");
        }
    }

    // TODO: wait proto v0.3
    
}


