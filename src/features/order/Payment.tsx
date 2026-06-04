import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ApiResponseData } from "@/types";
import { Gender, OrderStatus } from "@/types/constants.ts";
import { fetchOrderDetail, payOrder } from "@/features/order/api";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

function Payment() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { orderNumber } = useParams();

  type Order = ApiResponseData<"/user/order/{orderNumber}", "get">;

  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (!orderNumber) return;
        const response = await fetchOrderDetail({ orderNumber });
        console.log("fetch order detail response:", response);
        if (response.code === 1) {
          if (!response.data || response.data.status != OrderStatus.PendingPayment) {
            navigate("/");
            return;
          } else {
            console.log("successfully fetch order detail");
            setOrder(response.data);
          }
        } else {
          console.error("Failed to fetch order detail:", response.msg);
        }
      } catch (error) {
        console.error("Failed to fetch order detail:", error);
      }
    };

    loadOrder();
  }, [orderNumber, navigate]);

  const [countdown, setCountdown] = useState({
    minutes: 0,
    seconds: 0,
    isOvertime: false,
  });

  useEffect(() => {
    if (!order) return;

    const updateCountdown = () => {
      const expireTime = dayjs(order.orderTime).add(15, "minute");
      const diff = expireTime.diff(dayjs(), "second");
      if (diff <= 0) {
        setCountdown({
          minutes: 0,
          seconds: 0,
          isOvertime: true,
        });
        // clearInterval(timer);
        return;
      }
      setCountdown({
        minutes: Math.floor(diff / 60),
        seconds: diff % 60,
        isOvertime: false,
      });
    };
    // 立即执行一次
    updateCountdown();
    // 再开始 interval
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [order]);

  const handleSubmit = async () => {
    // validate errors

    try {
      const response = await payOrder({ orderNumber: orderNumber, payMethod: 1 });
      if (response.code === 1) {
        navigate(`/order/${orderNumber}`);
        return;
      }
      console.error("Failed to update address:", response.msg);
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  // http://localhost:5173/payment/1779784505802

  return (
    <div className="card-padding flex flex-col gap-4">
      <div className="flex flex-col gap-3 items-center py-4">
        <div className="text-caption">
          {t("common.remainingPaymentTime")}: {countdown.minutes}:{countdown.seconds}
        </div>
        <div className="text-5xl text-title ">$ {order?.amount}</div>
        <div className="text-caption">
          {t("common.skyRestaurant")}-{orderNumber}
        </div>
      </div>
      {/*<div>*/}
      {/*    下单时间: {order?.orderTime}*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*    是否超时: {countdown.isOvertime ? "是" : "否"}*/}
      {/*</div>*/}
      <div className="card-padding flex flex-col gap-2 bg-base-100">
        <div className="flex gap-2 items-start">
          <label className="flex items-center justify-between w-full gap-2 cursor-pointer shrink-0 whitespace-nowrap">
            <input
              type="radio"
              name="gender"
              value={String(Gender.Male)}
              className="peer sr-only"
              defaultChecked
              // checked={form.sex === String(Gender.Male)}
              // onChange={(e) =>
              //     setForm((prev) =>
              //         ({...prev, sex: e.target.value}))
              // }
            />
            <span>{t("common.wechatPay")}</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 bg-white peer-checked:border-primary peer-checked:[&>span]:opacity-100">
              <span className="h-2 w-2 rounded-full bg-primary opacity-0 transition-opacity" />
            </span>
          </label>
        </div>
      </div>
      <button className="button-primary p-2" onClick={handleSubmit}>
        {t("common.confirmPayment")}
      </button>
    </div>
  );
}

export default Payment;
