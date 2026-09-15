import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ApiResponseData } from "@/types";
import { OrderStatus, OrderStatusI18nKeyMap } from "@/types/constants.ts";
import { useTranslation } from "react-i18next";
import { fetchOrderList } from "@/features/order/api";

function OrderHistory() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [orderList, setOrderList] = useState<ApiResponseData<"/user/order/list", "get">>();

  useEffect(() => {
    const loadOrderList = async () => {
      try {
        const response = await fetchOrderList();
        console.log("fetch order detail response:", response);
        if (response.code === 1) {
          console.log("successfully fetch order detail");
          setOrderList(response.data);
        } else {
          console.error("Failed to fetch order detail:", response.msg);
        }
      } catch (error) {
        console.error("Failed to fetch order detail:", error);
      }
    };

    loadOrderList();
  }, []);

  return (
    <div>
      {/*<div className="p-8 bg-primary">*/}
      {/*    <div className="flex gap-4 items-center">*/}
      {/*        <div>*/}
      {/*            Order history, User Id: {userId}*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}
      <div className="m-4 flex flex-col gap-4">
        {orderList?.map((order) => {
          return (
            <button
              className="p-4 flex flex-col gap-2 bg-base-100"
              key={order.id}
              onClick={() => {
                if (order.status === OrderStatus.PendingPayment) {
                  navigate(`/payment/${order.number}`);
                } else {
                  navigate(`/order/${order.number}`);
                }
              }}
            >
              <div className="flex justify-between">
                <div>
                  {t("common.orderTime")}: {order.orderTime}
                </div>
                <div>{t(`enums.orderStatus.${OrderStatusI18nKeyMap[order.status]}`)}</div>
              </div>
              <div className="flex">
                <div className="flex gap-4">
                  {order.orderDetailList && order.orderDetailList.length > 0 ? (
                    order.orderDetailList
                      .slice(0, 3)
                      .map((item) => (
                        <img
                          key={item.id}
                          src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${item.image}`}
                          alt={item.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ))
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-gray-200" />
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0 justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="">{order.orderDishes}</div>
                    <div className="grow"></div>
                    <div className="text-on-base">${order.amount}</div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default OrderHistory;
