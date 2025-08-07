import React, { useState } from "react";
import { Loader2 } from "lucide-react";

// Telegram SVG Icon 元件 (保持不變)
const TelegramIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M41.42,8.58A2.22,2.22,0,0,0,39.23,8L7,19.43a2.21,2.21,0,0,0,.43,4.14l9.57,2.79,2.8,9.55a2.23,2.23,0,0,0,4.15.43L39,10.77a2.22,2.22,0,0,0,2.42-2.19Z"
      fill="#30A3E6"
    />
    <path
      d="M21.11,26.54,34.42,13.23a1,1,0,0,0-1.42-1.42L19.69,25.12,17,35.19a2.23,2.23,0,0,0,4.15.43Z"
      fill="#C8DAEA"
    />
    <path
      d="M24.71,28.84l-3.6-3.6,12-12a1,1,0,0,0-1.42-1.42l-12,12-2,2,1.3,4.38a2.23,2.23,0,0,0,4.15.43l1.83-6.22Z"
      fill="#A9C9DD"
    />
  </svg>
);

export default function BeeperStyleLogin() {
  // 1. 新增 loginStep 狀態來管理流程
  const [loginStep, setLoginStep] = useState<
    "enter_phone" | "enter_code" | "success"
  >("enter_phone");

  const [phoneNumber, setPhoneNumber] = useState("");
  // 2. 新增 verificationCode 狀態
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 3. 修改 handleSubmit 來處理不同的登入步驟
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    if (loginStep === "enter_phone") {
      console.log(`正在提交電話號碼: ${phoneNumber}`);
      // 在這裡呼叫真實的 API 來請求驗證碼
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 模擬網路延遲
      console.log("請求成功，請輸入驗證碼。");
      setLoginStep("enter_code"); // 成功後，切換到下一個步驟
    } else if (loginStep === "enter_code") {
      console.log(`正在提交驗證碼: ${verificationCode}`);
      // 在這裡呼叫真實的 API 來提交驗證碼
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 模擬網路延遲
      console.log("驗證成功！");
      setLoginStep("success"); // 登入成功
    }

    setIsLoading(false);
  };

  const instructions = [
    "Open the Telegram app on your phone",
    <>
      Go to <strong>Settings &rarr; Devices</strong>
    </>,
    <>
      Tap <strong>"Link Desktop Device"</strong>
    </>,
    loginStep === "enter_phone"
      ? "Please enter your phone number"
      : "Enter the code we sent you", // 根據步驟顯示不同的提示
  ];

  // 4. 根據登入步驟，決定表單和按鈕的內容
  const renderFormContent = () => {
    if (loginStep === "enter_phone") {
      return (
        <>
          <label
            htmlFor="phone-number"
            className="block text-sm font-medium mb-2"
          >
            Phone Number
          </label>
          <input
            id="phone-number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+886..."
            autoFocus
            className="block w-full bg-zinc-800 border border-zinc-600 rounded-md p-3 text-neutral-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Include the country code with +
          </p>
        </>
      );
    }

    if (loginStep === "enter_code") {
      return (
        <>
          <label
            htmlFor="verification-code"
            className="block text-sm font-medium mb-2"
          >
            Verification Code
          </label>
          <input
            id="verification-code"
            type="text"
            inputMode="numeric" // 讓行動裝置顯示數字鍵盤
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="12345"
            autoFocus
            className="block w-full bg-zinc-800 border border-zinc-600 rounded-md p-3 text-neutral-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Check your Telegram app for the code.
          </p>
        </>
      );
    }

    return null; // 其他狀態不顯示表單
  };

  if (loginStep === "success") {
    return (
      <div className="bg-zinc-900 text-neutral-200 font-sans flex flex-col gap-4 p-4 md:p-6 text-center">
        <h2 className="text-2xl font-bold text-green-400">✅ 連接成功！</h2>
        <p className="text-neutral-300">您現在可以關閉這個視窗了。</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 text-neutral-200 font-sans flex flex-col gap-6 p-4 md:p-6">
      <header className="text-center">
        <div className="inline-block">
          <TelegramIcon />
        </div>
        <h1 className="text-2xl font-bold mt-2">Telegram</h1>
      </header>

      <section>
        <ol className="flex flex-col gap-3">
          {instructions.map((instruction, index) => (
            <li
              key={index}
              className="relative pl-8 text-sm text-neutral-400 flex items-center min-h-[20px]"
            >
              <span className="absolute left-0 top-0 w-5 h-5 rounded-full bg-zinc-700 text-neutral-200 text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      </section>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">{renderFormContent()}</div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white rounded-md py-3 mt-4 font-bold hover:bg-blue-700 transition disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed flex justify-center items-center h-[48px]"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            // 根據步驟顯示不同的按鈕文字
            <span>
              {loginStep === "enter_phone" ? "Submit" : "Verify Code"} &rarr;
            </span>
          )}
        </button>
      </form>

      <footer className="flex flex-col gap-4">
        <div className="bg-zinc-800 rounded-lg p-4 text-sm text-neutral-400 leading-relaxed">
          <p>
            To import your full history from Telegram, go to your Telegram app
            on iOS or Android and click "Allow" on the data export request.
          </p>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4 text-sm text-neutral-400 leading-relaxed">
          <p>
            ☁️{" "}
            <strong className="text-neutral-200">
              This integration runs on the cloud.
            </strong>{" "}
            Your messages, contacts, and credentials are stored securely in our
            servers.{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Learn more.
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
