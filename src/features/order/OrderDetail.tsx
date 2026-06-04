import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ApiResponseData } from "@/types";
import { OrderStatusI18nKeyMap } from "@/types/constants.ts";
import { useTranslation } from "react-i18next";
import { fetchOrderDetail } from "@/features/order/api";

function OrderDetail() {
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
        if (response.code === 1 && response.data) {
          console.log("successfully fetch order detail");
          if (!response.data) {
            navigate("/");
            return;
          }
          setOrder(response.data);
        } else {
          console.error("Failed to fetch order detail:", response.msg);
        }
      } catch (error) {
        console.error("Failed to fetch order detail:", error);
      }
    };

    loadOrder();
  }, [orderNumber, navigate]);

  return (
    <div className="card-padding flex flex-col gap-4 bg-base-100">
      <div className="flex flex-col gap-4 items-center pt-2">
        <div className="text-title">{order && t(`enums.orderStatus.${OrderStatusI18nKeyMap[order.status]}`)}</div>
        <div className="flex gap-4 items-center">
          <button className="bg-base-300 text-on-base px-4 py-1 rounded-sm">{t("common.cancelOrder")}</button>
          <button className="bg-primary text-on-primary px-4 py-1 rounded-sm">{t("common.remindOrder")}</button>
          <button className="bg-base-300 text-on-base px-4 py-1 rounded-sm">{t("common.orderAgain")}</button>
        </div>
      </div>

      <div className="flex flex-col gap-4 card-padding">
        <div className="text-title">{t("common.skyRestaurant")}</div>
        {order &&
          order.orderDetailList &&
          order.orderDetailList.map((item) => {
            const count = item.number ?? 0;
            const price = item.amount ?? 0;
            return (
              // <div key={item.id} className="flex justify-between">
              //     <div>{name} x{count}</div>
              //     <div>¥{price * count}</div>
              // </div>
              <div className="flex gap-3" key={item.id}>
                <div className="h-14 w-14 rounded-lg bg-gray-200" />
                <div className="flex flex-col flex-1 min-w-0 justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="">{item.name}</div>
                    <div className="grow"></div>
                    <div className="text-on-base">${price * count}</div>
                  </div>
                  <div className="text-caption">{item.dishFlavor}</div>
                  <div className="text-caption">x{count}</div>
                </div>
              </div>
            );
          })}
        <div className="flex justify-between">
          <div>{t("common.packagingFee")}</div>
          <div>${order?.packAmount}</div>
        </div>
        <div className="flex justify-between">
          <div>{t("common.deliveryFee")}</div>
          <div>${6}</div>
        </div>
        <div className="flex justify-end text-title text-lg mt-2">
          {t("common.total")}：${order?.amount}
        </div>
      </div>

      <div className="flex gap-4 justify-start">
        <div>{t("common.expectedDeliveryTime")}</div>
        <div>{order?.estimatedDeliveryTime}</div>
      </div>
      <div className="flex gap-4 justify-start">
        <div>{t("common.deliveryAddress")}</div>
        <div>{order?.address}</div>
      </div>
      <div className="flex gap-4 justify-start">
        <div>{t("common.orderNumber")}</div>
        <div>{order?.number}</div>
      </div>
      <div className="flex gap-4 justify-start">
        <div>{t("common.orderTime")}</div>
        <div>{order?.checkoutTime}</div>
      </div>
    </div>
  );
}

export default OrderDetail;
