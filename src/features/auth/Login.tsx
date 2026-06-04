export default function Login() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <button
        type="button"
        onClick={() => {
          window.location.href = "http://localhost:8080/user/auth/google/login";
        }}
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Google Login
      </button>
    </div>
  );
}
