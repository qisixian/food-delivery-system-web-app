import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ApiRequestBody, ApiResponseData } from "@/types";
import { submitOrder } from "@/features/order/api";
import { fetchDefaultAddress } from "@/features/user/api";
import { fetchShoppingCartList } from "@/features/shop/api";
import { useTranslation } from "react-i18next";

function SubmitOrder() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  type Payload = ApiRequestBody<"/user/order/submit", "post">;

  const packagingFee = 2;
  const deliveryFee = 6;
  const estimatedDeliveryTime = "2026-01-01 20:14:00";
  const tablewareNumber = 1;
  const remark = t("common.pleaseProvideContactlessDelivery");

  type Address = ApiResponseData<"/user/addressBook/default", "get">;
  const [address, setAddress] = useState<Address>();

  type CartItem = ApiResponseData<"/user/shoppingCart/list", "get">[0];

  const [cart, setCart] = useState<{
    totalPrice: number;
    items: CartItem[];
  }>({
    totalPrice: 0,
    items: [],
  });

  const [errors, setErrors] = useState<{
    address: boolean;
  }>({
    address: false,
  });

  const validators = {
    address: (v: Address | undefined): boolean => !v,
  };

  const handleSubmit = async () => {
    // 提交时组装 form 还是进入页面时组装form？
    // 校验
    const nextErrors = {
      address: validators.address(address),
    };
    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) return;
    if (!address) return;
    // 组装数据
    const payload: Payload = {
      addressBookId: address.id,
      payMethod: 1,
      remark: remark,
      estimatedDeliveryTime: estimatedDeliveryTime,
      deliveryStatus: 1,
      tablewareNumber: tablewareNumber,
      tablewareStatus: 1,
      packAmount: packagingFee,
      amount: cart.totalPrice + packagingFee + deliveryFee,
    };

    try {
      const response = await submitOrder(payload);
      console.log("submit order response:", response);
      if (response.code === 1 && response.data) {
        console.log("successfully submit order, order id: " + response.data.orderNumber);
        navigate(`/payment/${response.data.orderNumber}`);
      } else {
        console.error("Failed to submit order:", response.msg);
      }
    } catch (error) {
      console.error("Failed to submit order:", error);
    }
  };

  useEffect(() => {
    const loadDefaultAddress = async () => {
      try {
        const response = await fetchDefaultAddress();
        console.log("fetch default address response:", response);
        if (response.code === 1 && response.data) {
          console.log("successfully fetch default address");
          setAddress(response.data);
        } else {
          console.error("Failed to fetch default address:", response.msg);
        }
      } catch (error) {
        console.error("Failed to fetch default address:", error);
      }
    };

    const loadCart = async () => {
      try {
        const response = await fetchShoppingCartList();
        console.log("Shopping Cart list response:", response);
        if (response.code === 1 && response.data) {
          if (response.data.length === 0) {
            navigate("/");
            return;
          }
          const data = response.data;
          console.log(data);
          const totalPrice = data.reduce((sum, item) => {
            const count = item.number ?? 0;
            const price = item.amount ?? 0;
            return sum + count * price;
          }, 0);
          setCart((prev) => ({
            ...prev,
            totalPrice: totalPrice,
            items: data,
          }));
        } else {
          console.error("Failed to fetch Shopping Cart list:", response.msg);
        }
      } catch (error) {
        console.error("Failed to fetch Shopping Cart list:", error);
      }
    };

    loadDefaultAddress();
    loadCart();
  }, []);

  return (
    <div>
      <section>
        <div className="flex flex-col gap-2 card-padding bg-base-100">
          {address ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {address?.label && (
                  <div className="whitespace-nowrap rounded-sm border  px-2 py-0.5 text-sm text-onbase transition-colors bg-blue-200 border-blue-200">
                    {address.label}
                  </div>
                )}
                <div className="text-title">
                  {address?.provinceName}
                  {address?.cityName}
                  {address?.detail}
                </div>
              </div>
              <div className="flex gap-2">
                <div>{address?.consignee}</div>
                <div>{address?.phone}</div>
              </div>
            </div>
          ) : (
            <div
              className={`text-title
                                    ${errors.address && "text-red-500"}`}
            >
              {t("error.selectDeliveryAddress")}
            </div>
          )}
          <button
            className="button-primary"
            onClick={() => {
              navigate("/addresses");
            }}
          >
            {t("headBar.manageAddress")}
          </button>
          <div className="flex gap-2 justify-between">
            <div className="">{t("common.deliverNow")}</div>
            <div className="">
              {estimatedDeliveryTime} {t("common.delivery")}
            </div>
          </div>
          <div className="text-caption">{t("common.deliveryTimeMayVary")}</div>
        </div>
      </section>

      <section className="mt-2">
        <div className="flex flex-col gap-4 card-padding bg-base-100">
          <div className="text-title">{t("common.skyRestaurant")}</div>
          {cart.items.map((item) => {
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
            <div>${packagingFee}</div>
          </div>
          <div className="flex justify-between">
            <div>{t("common.deliveryFee")}</div>
            <div>${deliveryFee}</div>
          </div>
          <div className="flex justify-end text-title text-lg mt-2">
            {t("common.total")}：${cart.totalPrice + packagingFee + deliveryFee}
          </div>
          <div className="flex justify-between mt-4">
            <div>{t("common.remark")}</div>
            <div>{remark}</div>
          </div>
          <div className="flex justify-between">
            <div>{t("common.utensils")}</div>
            <div>{tablewareNumber}</div>
          </div>
          <div className="flex justify-between">
            <div>{t("common.invoice")}</div>
            <div>{t("common.contactRestaurantForDetails")}</div>
          </div>
        </div>
      </section>

      {/*Cart & checkout button*/}
      <div className="fixed -translate-y-1/2 -translate-x-1/2 bottom-2 left-1/2 w-full max-w-sm px-4  z-50">
        <div className="flex rounded-4xl bg-neutral w-full px-2 py-2 font-medium text-on-neutral hover:bg-neutral/90 active:bg-neutral/80">
          <img src="/src/assets/btn_waiter_sel.png" alt="waiter" className="relative w-16 -mt-10" />
          <div className="px-2">${cart.totalPrice + packagingFee + deliveryFee}</div>
          <div className="grow"></div>
          <button
            className={`px-2 text-sm rounded-2xl bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80`}
            disabled={cart.items.length === 0}
            onClick={handleSubmit}
          >
            {t("common.placeOrder")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitOrder;
