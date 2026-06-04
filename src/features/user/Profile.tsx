import { useNavigate } from "react-router-dom";

import { store } from "@/app/store";
import { CircleUser, MapPinnedIcon, BookText, ChevronRight, Languages, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { fetchMe } from "@/features/user/api";
import { logout } from "@/services/auth.ts";

function Profile() {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const userId = store.getState().auth.userId;

  const handleChangeLanguage = () => {
    const newLang = i18n.language === "zh-CN" ? "en-US" : "zh-CN";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const loadMe = async () => {
      try {
        const response = await fetchMe();
        console.log("fetch user response:", response);
        if (response.code === 1) {
          console.log("successfully fetch user");
        } else {
          console.error("Failed to fetch user:", response.msg);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    loadMe();
  }, []);

  return (
    <div>
      <div className="p-8 bg-primary">
        <div className="flex gap-4 items-center">
          <CircleUser className="w-10 h-10" />
          <div>{t("common.userId")}</div>
          <div>{userId}</div>
        </div>
      </div>
      <div className="m-4 bg-white flex flex-col rounded-md">
        <button className="p-4 w-full flex items-center gap-2 rounded-md" onClick={() => navigate("/addresses")}>
          <MapPinnedIcon />
          <span>{t("common.manageAddress")}</span>
          <ChevronRight className="ml-auto" />
        </button>
        <button className="p-4 w-full flex items-center gap-2 rounded-md" onClick={() => navigate("/history")}>
          <BookText />
          <span>{t("common.orderHistory")}</span>
          <ChevronRight className="ml-auto" />
        </button>
        <button className="p-4 w-full flex items-center gap-2 rounded-md" onClick={() => handleChangeLanguage()}>
          <Languages />
          <span>{t("common.changeLanguage")}</span>
          <ChevronRight className="ml-auto" />
        </button>
        <button className="p-4 w-full flex items-center gap-2 rounded-md" onClick={() => logout()}>
          <LogOut />
          <span>{t("common.logout")}</span>
          <ChevronRight className="ml-auto" />
        </button>
      </div>
    </div>
  );
}

export default Profile;
