import BridgeTelegram from "~/components/bridge/bridge-telegram";
import { test, login, verify } from "~/lib/contacts-server-api/bridge";

export default function TestRoute() {
  return (
    // <BridgeTelegram />
    <div>
      <h1>Test Route</h1>
      <button
        onClick={async () => {
          // const response = await test();
          const response = await login("+886968982166");
          console.log("API Response:", response);
        }}
      >
        Test API
      </button>
      <br />
      <button
        onClick={async () => {
          const response = await verify("82192");
          console.log("API Response:", response);
        }}
      >
        Test Verify
      </button>
    </div>
  );
}
