// mainApi.js
import api from "utils/apiInstance";

export const getGroupList = async (userId) => {
  try {
    const { data } = await api.get("/groups", {
      params: { userId: userId, include: "subscribe" },
    });
    return data;
  } catch (err) {
    return err;
  }
};

export const getTotalFee = async (userId) => {
  try {
    const { data } = await api.get("/subscriptions/totalfee", {
      params: { userId },
    });

    return data ? data : { totalfee: 0, totalSavedAmount: 0 };
  } catch (err) {
    return err;
  }
};

export const getSubscriptionList = async (userId) => {
  try {
    const { data } = await api.get("/subscriptions", {
      params: { userId },
    });
    return data;
  } catch (err) {
    return err;
  }
};