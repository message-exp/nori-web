import { UserServiceClient } from "../../proto-generated/nori/v0/user/user_service_pb_service";
import { UserId } from "../../proto-generated/nori/v0/user/user_id_pb";

const userClient = new UserServiceClient("https://my.grpc/server");
const req = new UserId();
req.setUserId("");
userClient.getUser(req, (err, user) => {
  /* ... */
});
