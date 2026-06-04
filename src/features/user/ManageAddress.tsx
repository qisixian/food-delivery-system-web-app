import { fetchAddressList, setDefaultAddress } from "@/features/user/api";
import type { ApiResponseData } from "@/types";
import { Gender, IsDefault } from "@/types/constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Check } from "lucide-react";
import {useTranslation} from "react-i18next";

function ManageAddress() {

  const { t } = useTranslation();

  const navigate = useNavigate();

  type Address = ApiResponseData<"/user/addressBook/list", "get">[0];

  const [addressList, setAddressList] = useState<Address[]>([]);

  const loadAddress = async () => {
    try {
      const response = await fetchAddressList();
      console.log("fetch address list response:", response);
      if (response.code === 1 && response.data) {
        console.log("successfully fetch address list");
        setAddressList(response.data);
      } else {
        console.error("Failed to fetch address list:", response.msg);
      }
    } catch (error) {
      console.error("Failed to fetch address list:", error);
    }
  };

  const handleSetDefaultAddress = async (address: Address) => {
    try {
      const response = await setDefaultAddress(address);
      console.log("set default address response:", response);
      if (response.code === 1) {
        console.log("successfully set default address");
      } else {
        console.error("Failed to set default address:", response.msg);
      }
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  // todo!: 现在有循环渲染的问题
  useEffect(() => {
    loadAddress();
  }, []);

  return (
    <div className="card-padding flex flex-col gap-4">
      {addressList.length > 0 ? (
        addressList.map((address) => (
          <div className="card-padding bg-base-100" key={address.id}>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex flex-col flex-1 gap-3">
                  <div className="flex gap-2 items-center">
                    {address.label && (
                      <div className="whitespace-nowrap rounded-sm border  px-2 py-0.5 text-sm text-onbase transition-colors bg-blue-200 border-blue-200">
                        {address.label}
                      </div>
                    )}
                    <div>{address.provinceName + address.cityName + address.detail}</div>
                  </div>
                  <div className="flex gap-2 text-gray-600">
                    <div>{address.consignee}</div>
                    <div>{address.sex === String(Gender.Male) ? t("common.mr") : t("common.ms")}</div>
                    <div>{address.phone}</div>
                  </div>
                </div>
                <button className="p-2 text-gray-500" onClick={() => navigate(`/addresses/edit/${address.id}`)}>
                  <Pencil />
                </button>
              </div>
              <hr className="border-gray-200 my-3" />
              {/*<button*/}
              {/*    className="inline-flex gap-2"*/}
              {/*    onClick={() => handleSetDefaultAddress(address)}*/}
              {/*>*/}
              {/*    <div className={`rounded-full p-1 border ${*/}
              {/*        address.isDefault === IsDefault.True*/}
              {/*            ? "bg-primary text-on-primary border-primary"*/}
              {/*            : "bg-base-100 border-gray-300"*/}
              {/*    }*/}
              {/*    `}>*/}
              {/*        {*/}
              {/*            address.isDefault === IsDefault.True?*/}
              {/*                <Check className="w-4 h-4" strokeWidth="3"/>*/}
              {/*                : <div className="w-4 h-4"/>*/}
              {/*        }*/}
              {/*    </div>*/}
              {/*    设为默认地址*/}
              {/*</button>*/}

              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="default-address"
                  className="sr-only"
                  checked={address.isDefault === IsDefault.True}
                  onChange={async () => {
                    await handleSetDefaultAddress(address);
                    await loadAddress();
                  }}
                />
                <div
                  aria-hidden="true"
                  className={`rounded-full border p-1 ${
                    address.isDefault === IsDefault.True
                      ? "border-primary bg-primary text-on-primary"
                      : "border-gray-300 bg-base-100"
                  }`}
                >
                  {address.isDefault === IsDefault.True ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <div className="block h-4 w-4" />
                  )}
                </div>
                <div>{t("common.setAsDefaultAddress")}</div>
              </label>
            </div>
          </div>
        ))
      ) : (
        <img src="/src/assets/no_address.png" alt="There is no address" className="h-full w-full" />
      )}
      <button
        className="button-primary py-2"
        onClick={() => {
          navigate("/addresses/add");
        }}
      >
        + {t("common.addAddress")}
      </button>
    </div>
  );
}

export default ManageAddress;
