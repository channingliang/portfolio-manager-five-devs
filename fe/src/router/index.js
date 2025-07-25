import { createRouter, createWebHistory } from "vue-router";
import BaseLayout from "@/layout/BaseLayout.vue";
import Dashboard from "@/views/Dashboard.vue";
import ProductMarket from "@/views/ProductMarket.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/layout",
    component: BaseLayout,
    children: [
      {
        path: "/dashboard",
        component: Dashboard,
      },
      {
        path: "/market",
        component: ProductMarket,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
