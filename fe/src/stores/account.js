import { defineStore } from "pinia";
import api from "@/lib/request.js";

// Define a store for user info, including wallet balance
export const useAccountStore = defineStore("account", {
  state: () => ({
    balance: 0, // Wallet balance
  }),
  actions: {
    setBalance(amount) {
      this.balance = amount;
    },
    // If you want, you can add async actions to fetch/update balance from API
    async fetchBalance() {
      // Call your API here and update
      const res = await api.get("/account/balance", {});
      this.balance = res.data.balance;
    },
  },
});
