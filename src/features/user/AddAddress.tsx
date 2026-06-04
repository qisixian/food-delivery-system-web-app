import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ApiRequestBody } from "@/types";
import { Gender, IsDefault } from "@/types/constants.ts";
import { useTranslation } from "react-i18next";
import { addAddress, deleteAddress, fetchAddress, updateAddress } from "@/features/user/api";

function AddAddress() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { id } = useParams();
  const isEdit = Boolean(id);

  const labels = ["公司", "家", "学校"];

  type Form = ApiRequestBody<"/user/addressBook", "post">;

  const [form, setForm] = useState<Form>({
    id: id ? Number(id) : 0,
    userId: 0,
    consignee: "",
    phone: "",
    sex: String(Gender.Male),
    provinceCode: "",
    provinceName: "",
    cityCode: "",
    cityName: "",
    districtCode: "",
    districtName: "",
    detail: "",
    label: "",
    isDefault: IsDefault.False,
  });

  type Errors = Partial<Record<keyof Form, Error>>;
  type Error = { key: string; fieldKey?: string; values?: Record<string, any> } | undefined;

  const [errors, setErrors] = useState<Errors>({});

  const getErrorMessage = (error: Error) => {
    if (!error) return "";
    // const {key, options} = error;
    return t(`validation.${error.key}`, { field: error.fieldKey ? t(`${error.fieldKey}`) : "", ...error.values });
  };

  type Validator<T> = (value: T) => Error;

  type Validators<Form> = {
    [K in keyof Form]: Validator<Form[K]>;
  };

  const validators = {
    id: () => undefined,
    consignee: (v: string) => (!v ? { key: "required", fieldKey: "fields.order.consignee" } : undefined),
    phone: (v: string) => {
      if (!v) return { key: "required", fieldKey: "fields.phone" };
      if (!/^\d{11}$/.test(v)) return { key: "phone.digits", fieldKey: "fields.phone", values: { len: 11 } };
      if (!/^1([345678])\d{9}$/.test(v)) return { key: "invalid", fieldKey: "fields.phone" };
      return undefined;
    },
    sex: () => undefined,
    provinceName: (v: string) => (!v ? { key: "required", fieldKey: "fields.order.address" } : undefined),
    cityName: (v: string) => (!v ? { key: "required", fieldKey: "fields.order.address" } : undefined),
    detail: (v: string) => (!v ? { key: "required", fieldKey: "fields.order.address" } : undefined),
    isDefault: () => undefined,
  } satisfies Validators<Form>;

  useEffect(() => {
    if (isEdit) {
      fetchAddress({ id: Number(id) })
        .then((res) => {
          if (res.code === 1 && res.data) {
            setForm({
              id: Number(id),
              userId: res.data.userId,
              consignee: res.data.consignee,
              phone: res.data.phone,
              sex: res.data.sex,
              provinceCode: res.data.provinceCode,
              provinceName: res.data.provinceName,
              cityCode: res.data.cityCode,
              cityName: res.data.cityName,
              districtCode: res.data.districtCode,
              districtName: res.data.districtName,
              detail: res.data.detail,
              label: res.data.label,
              isDefault: res.data.isDefault,
            });
          } else {
            console.error("Failed to fetch employee data:", res.msg);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch employee data:", err);
        });
    }
  }, [id, isEdit]);

  const handleSubmit = async () => {
    // validate errors
    const nextErrors: Errors = {
      consignee: validators.consignee(form.consignee),
      phone: validators.phone(form.phone),
      provinceName: validators.provinceName(form.provinceName),
      cityName: validators.cityName(form.cityName),
      detail: validators.detail(form.detail),
    };
    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) return;
    // submit form
    console.log(JSON.stringify(form));
    // submit form
    if (isEdit) {
      // update Address
      try {
        const response = await updateAddress(form);
        if (response.code === 1) {
          navigate(-1);
          return;
        }
        console.error("Failed to update address:", response.msg);
      } catch (error) {
        console.error("Failed to update address:", error);
      }
    } else {
      // add Address
      try {
        const response = await addAddress(form);
        if (response.code === 1) {
          navigate(-1);
          return;
        }
        console.error("Failed to add address:", response.msg);
      } catch (error) {
        console.error("Failed to add address:", error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteAddress({ id: id });
      console.log("delete address response:", response);
      if (response.code === 1) {
        console.log("successfully delete address");
      } else {
        console.error("Failed to delete address:", response.msg);
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  return (
    <div className="card-padding flex flex-col gap-4">
      <div className="card-padding flex flex-col gap-2 bg-base-100">
        <div className="flex gap-2 items-start">
          <div className="font-bold shrink-0 w-19">{t("common.contactName")}：</div>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder={t("common.contactNamePlaceholder")}
              className="flex-1 min-w-0 focus:outline-none"
              value={form.consignee}
              onChange={(e) => setForm((prev) => ({ ...prev, consignee: e.target.value }))}
              onBlur={() => {
                setErrors((p) => ({
                  ...p,
                  consignee: validators.consignee(form.consignee),
                }));
              }}
            />
            {errors.consignee && <div className="text-sm text-red-500">{getErrorMessage(errors.consignee)}</div>}
          </div>
          <label className="flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap">
            <input
              type="radio"
              name="gender"
              value={String(Gender.Male)}
              className="peer sr-only"
              checked={form.sex === String(Gender.Male)}
              onChange={(e) => setForm((prev) => ({ ...prev, sex: e.target.value }))}
            />
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 bg-white peer-checked:border-primary peer-checked:[&>span]:opacity-100">
              <span className="h-2 w-2 rounded-full bg-primary opacity-0 transition-opacity" />
            </span>
            <span>{t("common.mr")}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap">
            <input
              type="radio"
              name="gender"
              value={String(Gender.Female)}
              className="peer sr-only"
              checked={form.sex === String(Gender.Female)}
              onChange={(e) => setForm((prev) => ({ ...prev, sex: e.target.value }))}
            />
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 bg-white peer-checked:border-primary peer-checked:[&>span]:opacity-100">
              <span className="h-2 w-2 rounded-full bg-primary opacity-0 transition-opacity" />
            </span>
            <span>{t("common.ms")}</span>
          </label>
        </div>
        <hr className="border-gray-200 my-2" />
        <div className="flex gap-2 items-start">
          <div className="font-bold shrink-0 w-19">{t("common.phoneNumber")}：</div>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder={t("common.phoneNumberPlaceholder")}
              className="flex-1 min-w-0 focus:outline-none"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              onBlur={() => {
                setErrors((p) => ({
                  ...p,
                  phone: validators.phone(form.phone),
                }));
              }}
            />
            {errors.phone && <div className="text-sm text-red-500">{getErrorMessage(errors.phone)}</div>}
          </div>
        </div>
        <hr className="border-gray-200 my-2" />
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-start">
            <div className="font-bold shrink-0 whitespace-nowrap w-19">{t("common.province")}：</div>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder={t("common.province")}
                className="flex-1 min-w-0 focus:outline-none"
                value={form.provinceName}
                onChange={(e) => setForm((prev) => ({ ...prev, provinceName: e.target.value }))}
                onBlur={() => {
                  setErrors((p) => ({
                    ...p,
                    provinceName: validators.provinceName(form.provinceName),
                  }));
                }}
              />
              {errors.provinceName && (
                <div className="text-sm text-red-500">{getErrorMessage(errors.provinceName)}</div>
              )}
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <div className="font-bold shrink-0 whitespace-nowrap w-19">{t("common.city")}：</div>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder={t("common.city")}
                className="flex-1 min-w-0 focus:outline-none"
                value={form.cityName}
                onChange={(e) => setForm((prev) => ({ ...prev, cityName: e.target.value }))}
                onBlur={() => {
                  setErrors((p) => ({
                    ...p,
                    cityName: validators.cityName(form.cityName),
                  }));
                }}
              />
              {errors.cityName && <div className="text-sm text-red-500">{getErrorMessage(errors.cityName)}</div>}
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <div className="font-bold shrink-0 w-19">{t("common.detailedAddress")}：</div>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder={t("common.detailedAddress")}
                className="flex-1 min-w-0 focus:outline-none"
                value={form.detail}
                onChange={(e) => setForm((prev) => ({ ...prev, detail: e.target.value }))}
                onBlur={() => {
                  setErrors((p) => ({
                    ...p,
                    detail: validators.detail(form.detail),
                  }));
                }}
              />
              {errors.detail && <div className="text-sm text-red-500">{getErrorMessage(errors.detail)}</div>}
            </div>
          </div>
        </div>
        <hr className="border-gray-200 my-2" />
        <div className="flex gap-2 items-center">
          <div className="font-bold shrink-0 whitespace-nowrap w-19">{t("common.label")}：</div>
          {labels.map((label) => (
            // <label className="cursor-pointer" key={label}>
            //     <input type="radio" name="label" value={label} className="peer sr-only"/>
            //     <span className="inline-flex items-center whitespace-nowrap rounded-sm border border-gray-300 px-1.5 py-0.5 text-sm text-gray-700 transition-colors peer-checked:bg-blue-200 peer-checked:border-blue-200">
            //       {label}
            //     </span>
            // </label>
            <button
              type="button"
              aria-pressed={form.label === label}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  label: prev.label === label ? "" : label,
                }))
              }
              className="whitespace-nowrap rounded-sm border border-gray-300 px-1.5 py-0.5 text-sm text-onbase transition-colors aria-pressed:bg-blue-200 aria-pressed:border-blue-200"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <button className="button-primary p-2" onClick={handleSubmit}>
        {t("common.saveAddress")}
      </button>
      {isEdit && (
        <button
          className="bg-base-300 rounded-full text-on-base p-2"
          onClick={() => {
            if (form.id) handleDelete(form.id);
            navigate(-1);
          }}
        >
          {t("common.deleteAddress")}
        </button>
      )}
    </div>
  );
}

export default AddAddress;
