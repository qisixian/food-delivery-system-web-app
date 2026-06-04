import { store } from "@/app/store";
import { clearToken } from "@/app/store/authSlice";

export function logout() {
  store.dispatch(clearToken());
  // 在组件外使用 react router 好像很麻烦
  // TODO: This causes a full page reload and should be improved
  window.location.replace("/login");
}
