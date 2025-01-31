import * as grpcWeb from 'grpc-web';
import { UserServiceClient } from "@/proto-generated/nori/v0/user/User_serviceServiceClientPb";
import { UserId } from "@/proto-generated/nori/v0/user/user_id_pb";
import { User } from "@/proto-generated/nori/v0/user/user_pb";

const userService = new UserServiceClient("https://localhost:8080", null, null);

const request = new UserId();
request.setUserId("");

const call = userService.getUser(request, {'custom-header-1': 'value1'},
  (err: grpcWeb.RpcError, response: User) => {
    console.log("test");
  });
call.on('status', (status: grpcWeb.Status) => {
  // ...
});
