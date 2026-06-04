import { Outlet, useMatches, useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";
import {ArrowLeft, Languages} from "lucide-react";

function WithBackLayout() {

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const matches = useMatches();

  // 取最后一个匹配的 route（当前页面）
  const currentMatch = matches[matches.length - 1];
  const title = currentMatch?.handle?.title;

  const handleChangeLanguage = () => {
    const newLang = i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN';
    i18n.changeLanguage(newLang);
  }

  return (
    <div className="min-h-full flex flex-col">
      <header className="relative flex justify-between items-center h-12 px-3 pt-[env(safe-area-inset-top)] bg-neutral text-on-neutral">
        <div className="w-10 flex justify-start z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-white/10 active:bg-white/20"
            aria-label="Back"
          >
            <ArrowLeft/>
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-base font-medium truncate">{t(title)}</div>
        </div>

        <div className="w-10 flex justify-end z-10">
          <button
              type="button"
              onClick={() => handleChangeLanguage()}
              className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-white/10 active:bg-white/20"
              aria-label="Back"
          >
            <Languages />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default WithBackLayout;
