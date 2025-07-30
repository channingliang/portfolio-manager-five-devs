import { defineStore } from "pinia";
import api from "@/lib/request.js";

// Define a store for user info, including wallet balance
export const useAccountStore = defineStore("account", {
  state: () => ({
    id: 1, // User ID
    name: null, // User's name
    currency: "USD", // Default currency
    balance: null, // Wallet balance
  }),
  actions: {
    setBalance(amount) {
      this.balance = amount;
    },
    setName(name) {
      this.name = name;
    },
    setCurrency(currency) {
      this.currency = currency;
    },
    async fetchAccountInfo(id = this.id) {
      console.log("Fetching account info for ID:", id);
      const res = await api.get("/account/" + id, {});
      this.balance = res.balance;
      this.name = res.name;
      this.currency = res.currency;
    },
  },
});
