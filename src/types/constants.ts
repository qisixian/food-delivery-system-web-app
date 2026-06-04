export const CategoryType = {
  Dish: 1,
  SetMeal: 2,
} as const;

export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];

export const Status = {
  Enabled: 1,
  Disabled: 0,
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const Gender = {
  Male: 1,
  Female: 0,
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const IsDefault = {
  True: 1,
  False: 0,
} as const;

export type IsDefault = (typeof IsDefault)[keyof typeof IsDefault];

// OrderStatus 订单状态 1待付款 2待接单 3已接单 4派送中 5已完成 6已取消 7退款
export const OrderStatus = {
  PendingPayment: 1,
  ToBeConfirmed: 2,
  Confirmed: 3,
  Delivering: 4,
  Complete: 5,
  Canceled: 6,
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderStatusI18nKeyMap: Record<OrderStatus, string> = {
  [OrderStatus.PendingPayment]: "pendingPayment",
  [OrderStatus.ToBeConfirmed]: "toBeConfirmed",
  [OrderStatus.Confirmed]: "confirmed",
  [OrderStatus.Delivering]: "delivering",
  [OrderStatus.Complete]: "complete",
  [OrderStatus.Canceled]: "canceled",
};

// PayStatus 支付状态 0未支付 1已支付 2退款
export const PayStatus = {
  UnPaid: 0,
  Paid: 1,
  Refund: 2,
};

export type PayStatus = (typeof PayStatus)[keyof typeof PayStatus];

// payMethod 支付方式 1微信，2支付宝
// deliveryStatus 配送状态  1立即送出  0选择具体时间
// tablewareStatus 餐具数量状态  1按餐量提供  0选择具体数量
