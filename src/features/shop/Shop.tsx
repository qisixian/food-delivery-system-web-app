import { useEffect, useState } from "react";
import {
  addShoppingCart,
  cleanShoppingCart,
  fetchCategoryList,
  fetchDishList,
  fetchSetmealList,
  fetchShoppingCartList,
  subShoppingCart,
} from "@/features/shop/api";
import type { ApiRequestBody, ApiResponseData } from "@/types";
import { CategoryType } from "@/types/constants.ts";
import { Plus, Minus, Trash2, CircleUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Shop() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [categories, setCategories] = useState<{ id: number; categoryType: CategoryType; name: string }[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<{ id: number; categoryType: CategoryType }>({
    id: 16,
    categoryType: CategoryType.Dish,
  });

  type MenuItem = ApiResponseData<"/user/dish/list", "get">[0] & { categoryType: CategoryType };

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [flavorPopup, setFlavorPopup] = useState<{
    isOpen: boolean;
    item: MenuItem | null;
    selectedFlavors: string[];
  }>({
    isOpen: false,
    item: null,
    selectedFlavors: [],
  });

  type CartItem = ApiResponseData<"/user/shoppingCart/list", "get">[0];

  const [cart, setCart] = useState<{
    isOpen: boolean;
    totalPrice: number;
    items: CartItem[];
  }>({
    isOpen: false,
    totalPrice: 0,
    items: [],
  });

  const estimatedDeliveryTime = 30;
  const monthlySales = 2000;
  const deliveryFee = 2.99;
  const minOrderAmount = 15;

  const loadCategories = async () => {
    try {
      const response = await fetchCategoryList({});
      console.log("Dish list response:", response);
      if (response.code === 1 && response.data) {
        const data = response.data;
        console.log(data);
        const sortedCategories = data
          .sort((a, b) => a.sort - b.sort)
          // todo: fix this
          .map((item) => ({
            id: item.id as number,
            categoryType: item.type as CategoryType,
            name: item.name as string,
          }));
        // todo: fix this
        setCategories(sortedCategories);
      } else {
        console.error("Failed to fetch category list:", response.msg);
      }
    } catch (error) {
      console.error("Failed to fetch category list:", error);
    }
  };

  const loadMenuItems = async (categoryId: number, categoryType: CategoryType) => {
    if (categoryType === CategoryType.Dish) {
      try {
        const response = await fetchDishList({ categoryId: categoryId });
        console.log("Dish list response:", response);
        if (response.code === 1 && response.data) {
          const data = response.data;
          setMenuItems(
            data.map((item) => ({
              ...item,
              categoryType: CategoryType.Dish,
            }))
          );
        } else {
          console.error("Failed to fetch dish list:", response.msg);
        }
      } catch (error) {
        console.error("Failed to fetch dish list:", error);
      }
    }
    if (categoryType === CategoryType.SetMeal) {
      try {
        const response = await fetchSetmealList({ categoryId: categoryId });
        console.log("Setmeal list response:", response);
        if (response.code === 1 && response.data) {
          const data = response.data;
          setMenuItems(
            data.map((item) => ({
              id: item.id,
              categoryType: CategoryType.SetMeal,
              name: item.name,
              categoryId: item.categoryId,
              price: item.price,
              image: item.image,
              description: item.description,
              status: item.status,
              updateTime: item.updateTime,
              categoryName: "",
              flavors: [],
            }))
          );
        } else {
          console.error("Failed to fetch Setmeal list:", response.msg);
        }
      } catch (error) {
        console.error("Failed to fetch Setmeal list:", error);
      }
    }
  };

  const loadCart = async () => {
    try {
      const response = await fetchShoppingCartList();
      console.log("Shopping Cart list response:", response);
      if (response.code === 1 && response.data) {
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

  const addToCart = async (param: ApiRequestBody<"/user/shoppingCart/add", "post">) => {
    try {
      const response = await addShoppingCart(param);
      console.log("add to cart response:", response);
      if (response.code === 1) {
        console.log("successfully added to cart");
        loadCart();
      } else {
        console.error("Failed to added to cart:", response.msg);
      }
    } catch (error) {
      console.error("Failed to added to cart:", error);
    }
  };

  const subFromCart = async (cartItem: CartItem) => {
    try {
      const response = await subShoppingCart(cartItem);
      console.log("sub from cart response:", response);
      if (response.code === 1) {
        console.log("successfully sub from cart");
        loadCart();
      } else {
        console.error("Failed to sub from cart:", response.msg);
      }
    } catch (error) {
      console.error("Failed to sub from cart:", error);
    }
  };

  const cleanCart = async () => {
    try {
      const response = await cleanShoppingCart();
      console.log("Clean Shopping Cart response:", response);
      if (response.code === 1) {
        console.log("successfully Clean Shopping Cart");
        loadCart();
      } else {
        console.error("Failed to clean Shopping Cart:", response.msg);
      }
    } catch (error) {
      console.error("Failed to clean Shopping Cart:", error);
    }
  };

  const toggleFlavor = (flavor: string) => {
    setFlavorPopup((prev) => {
      return {
        ...prev,
        selectedFlavors: prev.selectedFlavors.includes(flavor)
          ? prev.selectedFlavors.filter((f) => f !== flavor)
          : [...prev.selectedFlavors, flavor],
      };
    });
  };

  useEffect(() => {
    loadCategories();
    loadCart();
  }, []);

  useEffect(() => {
    loadMenuItems(selectedCategory.id, selectedCategory.categoryType);
  }, [selectedCategory]);

  const MenuItemQuantityControl = ({ item }: { item: MenuItem }) => {
    const cartItem = cart.items.find((i) =>
      item.categoryType === CategoryType.Dish ? i.dishId === item.id : i.setmealId === item.id
    );
    if (item.flavors && item.flavors.length > 0) {
      return (
        <button
          className="bg-primary text-on-primary rounded-full text-xs font-medium py-1 px-2 hover:bg-primary/90 active:bg-primary/80"
          onClick={() => {
            setFlavorPopup({ isOpen: true, item: item, selectedFlavors: [] });
          }}
        >
          {t("common.flavor")}
          {/*<FlavorPopup item={item}/>*/}
        </button>
      );
    } else {
      return (
        <div className="flex gap-3 items-center">
          {cartItem && (
            <button
              className="bg-primary text-on-primary rounded-full p-1 hover:bg-primary/90 active:bg-primary/80"
              onClick={() => {
                subFromCart(cartItem);
                loadCart();
              }}
            >
              <Minus className="w-3 h-3" strokeWidth={4} />
            </button>
          )}
          {cartItem && <div className="text-on-base">{cartItem.number}</div>}
          <button
            className="bg-primary text-on-primary rounded-full p-1 hover:bg-primary/90 active:bg-primary/80"
            onClick={() => {
              addToCart({
                dishId: item.categoryType === CategoryType.Dish ? item.id : undefined,
                setmealId: item.categoryType === CategoryType.SetMeal ? item.id : undefined,
                dishFlavor: "",
              });
              loadCart();
            }}
          >
            <Plus className="w-3 h-3" strokeWidth={4} />
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-base-200">
      <section className="shrink-0">
        <div className="relative h-44 w-full overflow-hidden">
          <img src="/src/assets/bg.png" alt="Merchant cover" className="h-full w-full object-cover" />
          <div className="absolute top-4 left-4">
            <button
              className="flex items-center gap-2"
              onClick={() => {
                navigate("/me");
              }}
            >
              <CircleUser className="w-7 h-7 rounded-full text-white" />
              <span className="text-white">{t("headBar.profile")}</span>
            </button>
          </div>
        </div>

        <div className="-mt-11 mx-4 rounded-2xl bg-base-100 card-padding shadow-md relative z-10">
          <h1 className="text-title">{t("common.skyRestaurant")}</h1>
          <div className={"flex gap-3 items-center mt-1"}>
            <p className="text-caption">
              {t("common.monthlySales")} {monthlySales}+
            </p>
            <p className="text-caption">
              {estimatedDeliveryTime} {t("common.min")} {t("common.delivery")}
            </p>
          </div>
          <div className={"flex gap-3 items-center mt-1"}>
            <p className="text-caption">
              {t("common.deliveryFee")} ${deliveryFee}
            </p>
            <p className="text-caption">
              {t("common.minOrder")} ${minOrderAmount}
            </p>
          </div>
        </div>
      </section>

      <section className="flex-1 min-h-0 mt-4 overflow-hidden h-full">
        <div className="h-full flex flex-1 min-h-[60dvh]">
          <aside className="w-24 shrink-0 overflow-y-auto bg-base-200 h-full">
            <ul className="py-2">
              {categories.map((category) => (
                <button
                  className={`p-3 w-full hover:bg-black/10 active:bg-black/20
                                        ${
                                          selectedCategory.id === category.id
                                            ? "text-sm bg-base-100 text-on-base font-medium"
                                            : "text-caption"
                                        }`}
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory({ id: category.id, categoryType: category.categoryType });
                  }}
                >
                  {category.name}
                </button>
              ))}
            </ul>
          </aside>

          <main className="flex flex-col flex-1 min-w-0 overflow-y-auto card-padding bg-base-100 rounded-2xl">
            <section>
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div className="flex gap-3" key={item.id}>
                    <div className="h-20 w-20 rounded-lg bg-gray-200" />
                    <div className="min-w-0 flex-1">
                      <div className="text-body font-medium">{item.name}</div>
                      <div className="mt-1 text-caption line-clamp-2">{item.description}</div>
                      <div className="flex gap-3 items-center mt-2">
                        <div className="text-red-500 font-semibold">${item.price}</div>
                        <div className="grow"></div>
                        <MenuItemQuantityControl item={item} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </section>
      {/*flavor popup*/}
      <div
        className={`fixed inset-y-0 z-20 w-full max-w-md flex justify-center transition-opacity duration-300 ${
          flavorPopup.isOpen
            ? "bg-black/30 opacity-100 pointer-events-auto"
            : "bg-black/0 opacity-0 pointer-events-none"
        }`}
        onClick={() => setFlavorPopup({ isOpen: false, item: null, selectedFlavors: [] })}
      >
        <div
          className={`fixed z-30 min-h-24 w-full max-w-xs -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2 rounded-2xl bg-white transform transition-all duration-300 ${
            flavorPopup.isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {flavorPopup.isOpen && flavorPopup.item && (
            <div className="flex flex-col p-4 gap-3">
              <div className="text-title text-center">{flavorPopup.item.name}</div>
              {flavorPopup.item.flavors.map((flavor) => (
                <div className="flex flex-col gap-1">
                  <div className="text-body">{flavor.name}</div>
                  <div className="flex justify-start gap-4">
                    {JSON.parse(flavor.value).map((flavorOption: string) => (
                      <button
                        className={`rounded-md text-xs font-medium py-1 px-2 border border-primary ${
                          flavorPopup.selectedFlavors.includes(flavorOption)
                            ? "bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80"
                            : "bg-white "
                        }`}
                        onClick={() => toggleFlavor(flavorOption)}
                      >
                        {flavorOption}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between pt-3">
                <div className="text-red-500 font-semibold">${flavorPopup.item.price}</div>
                <button
                  className="bg-primary text-on-primary rounded-full text-xs font-medium py-1 px-2 hover:bg-primary/90 active:bg-primary/80"
                  onClick={() => {
                    if (!flavorPopup.item) return;
                    addToCart({
                      dishId: flavorPopup.item.categoryType === CategoryType.Dish ? flavorPopup.item.id : undefined,
                      setmealId:
                        flavorPopup.item.categoryType === CategoryType.SetMeal ? flavorPopup.item.id : undefined,
                      dishFlavor: flavorPopup.selectedFlavors.toString(),
                    });
                    loadCart();
                    setFlavorPopup({ isOpen: false, item: null, selectedFlavors: [] });
                  }}
                >
                  {t("common.addToCart")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/*Cart & checkout button*/}
      <div className="fixed -translate-y-1/2 -translate-x-1/2 bottom-2 left-1/2 w-full max-w-sm px-4  z-50">
        <button
          className="flex rounded-4xl bg-neutral w-full px-2 py-2 font-medium text-on-neutral hover:bg-neutral/90 active:bg-neutral/80"
          onClick={() => {
            if (cart.isOpen) {
              setCart((prev) => ({ ...prev, isOpen: false }));
            } else {
              setCart((prev) => ({ ...prev, isOpen: true }));
              loadCart();
            }
          }}
          // disabled={cart.items.length === 0}
        >
          <img
            src={cart.items.length === 0 ? "/src/assets/btn_waiter_nor.png" : "/src/assets/btn_waiter_sel.png"}
            alt="waiter"
            className="relative w-16 -mt-10"
          />
          <div className="px-2">¥{cart.totalPrice}</div>
          <div className="grow"></div>
          <button
            className={`px-2 text-sm rounded-2xl 
                            ${
                              cart.items.length === 0
                                ? "bg-gray-400 hover:bg-gray-400/90 active:bg-gray-400/80 cursor-not-allowed"
                                : "bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80"
                            }`}
            disabled={cart.items.length === 0}
            onClick={() => {
              navigate("/submit");
            }}
          >
            {t("common.goToCheckout")}
          </button>
        </button>
      </div>
      {/*shopping cart*/}
      <div
        className={`fixed inset-y-0 z-20 w-full max-w-md flex justify-center transition-opacity duration-300 ${
          cart.isOpen ? "bg-black/0 opacity-100 pointer-events-auto" : "bg-black/0 opacity-0 pointer-events-none"
        }`}
        onClick={() => setCart({ ...cart, isOpen: false })}
      >
        <div
          className={`fixed z-30 bottom-0 h-[60vh] w-full max-w-md -translate-x-1/2 left-1/2 rounded-t-2xl bg-white transition-transform duration-300 ${
            cart.isOpen ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col card-padding h-full">
            <div className="flex items-center">
              <div className="text-title">{t("common.cart")}</div>
              <div className="grow"></div>
              <button
                className="flex items-center gap-1 text-body"
                onClick={() => {
                  cleanCart();
                  loadCart();
                }}
              >
                <Trash2 className="w-4 h-4" />
                {t("common.clear")}
              </button>
            </div>
            <div className="mt-3 space-y-4 overflow-y-auto flex-1">
              {cart.items.map((item) => (
                <div className="flex gap-3" key={item.id}>
                  <div className="h-20 w-20 rounded-lg bg-gray-200" />
                  <div className="flex flex-col flex-1 min-w-0 justify-between">
                    <div className="font-medium">{item.name}</div>
                    <div className="mt-1 text-caption line-clamp-2">{item.dishFlavor}</div>
                    <div className="flex gap-3 items-center mt-2">
                      <div className="text-red-500 font-semibold">${item.amount}</div>
                      <div className="grow"></div>
                      <button
                        className="bg-primary text-on-primary rounded-full p-1 hover:bg-primary/90 active:bg-primary/80"
                        onClick={() => {
                          subFromCart(item);
                          loadCart();
                        }}
                      >
                        <Minus className="w-3 h-3" strokeWidth={4} />
                      </button>
                      <div className="text-on-base">{item.number}</div>
                      <button
                        className="bg-primary text-on-primary rounded-full p-1 hover:bg-primary/90 active:bg-primary/80"
                        onClick={() => {
                          addToCart(item);
                          loadCart();
                        }}
                      >
                        <Plus className="w-3 h-3" strokeWidth={4} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
