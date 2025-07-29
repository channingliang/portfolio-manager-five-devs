import { createRouter, createWebHistory } from "vue-router";
import BaseLayout from "@/layout/BaseLayout.vue";
import Dashboard from "@/views/Dashboard.vue";
import Stock from "@/views/Stock.vue";
import Fund from "@/views/Fund.vue";
import Crypto from "@/views/Crypto.vue";

const routes = [
  {
    path: "/",
    component: BaseLayout,
    children: [
      {
        path: "",
        redirect: "/dashboard",
      },
      {
        path: "dashboard",
        component: Dashboard,
      },
      {
        path: "stock",
        component: Stock,
      },
      {
        path: "fund",
        component: Fund,
      },
      {
        path: "crypto",
        component: Crypto,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
