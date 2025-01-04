const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">登入系統</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <form className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">帳號</label>
            <input
              type="text"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">密碼</label>
            <input
              type="password" 
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
          >
            登入
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
