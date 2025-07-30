<script setup>
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { ref } from "vue";
import { useAccountStore } from "@/stores/account.js";
import {
  Wallet,
  User,
  BanknoteArrowUp,
  BanknoteArrowDown,
  ChartCandlestick,
  HandCoins,
  Bitcoin,
  Ellipsis,
} from "lucide-vue-next";
import TopUpDrawer from "@/components/nav/TopUpDrawer.vue";
import api from "@/lib/request.js";

const accountStore = useAccountStore();

const drawerOpen = ref(false);

api.get("account/3").then((res) => {
  accountStore.setBalance(res.balance);
});
</script>

<template>
  <nav class="fixed top-6 z-999 flex h-12 w-full justify-center">
    <div
      class="flex min-w-[500px] justify-center rounded-4xl border bg-white/70 px-16 shadow-lg backdrop-blur-md"
    >
      <NavigationMenu class="h-full">
        <NavigationMenuList>
          <NavigationMenuItem>
            <router-link to="/dashboard">
              <NavigationMenuLink :class="navigationMenuTriggerStyle()">
                Dashboard
              </NavigationMenuLink>
            </router-link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Market</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul
                class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]"
              >
                <li>
                  <router-link to="/stock">
                    <NavigationMenuLink as-child>
                      <div
                        class="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                      >
                        <div
                          class="inline-flex items-center text-sm leading-none"
                        >
                          <ChartCandlestick
                            class="text-muted-foreground mr-1 size-5"
                          />
                          Stock
                        </div>
                        <p
                          class="text-muted-foreground line-clamp-2 text-sm leading-snug"
                        >
                          View stock market data, charts, and more.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </router-link>
                </li>
                <li>
                  <router-link to="/fund">
                    <NavigationMenuLink as-child>
                      <div
                        class="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                      >
                        <div
                          class="inline-flex items-center text-sm leading-none"
                        >
                          <HandCoins
                            class="text-muted-foreground mr-1 size-5"
                          />
                          Fund
                        </div>
                        <p
                          class="text-muted-foreground line-clamp-2 text-sm leading-snug"
                        >
                          View mutual funds, ETFs, and other investment.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </router-link>
                </li>
                <li>
                  <router-link to="/crypto">
                    <NavigationMenuLink as-child>
                      <div
                        class="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                      >
                        <div
                          class="inline-flex items-center text-sm leading-none"
                        >
                          <Bitcoin class="text-muted-foreground mr-1 size-5" />
                          Crypto
                        </div>
                        <p
                          class="text-muted-foreground line-clamp-2 text-sm leading-snug"
                        >
                          Explore cryptocurrency markets, prices, and trends.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </router-link>
                </li>
                <li>
                  <NavigationMenuLink as-child>
                    <div
                      class="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                    >
                      <div
                        class="text-muted-foreground inline-flex items-center text-sm leading-none"
                      >
                        <Ellipsis class="mr-1 size-5" />
                        Coming Soon
                      </div>
                      <p
                        class="text-muted-foreground line-clamp-2 text-sm leading-snug"
                      >
                        More markets and investment options are on the way!
                      </p>
                    </div>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <div class="h-6">
            <Separator class="mx-2" orientation="vertical" />
          </div>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <div class="flex items-center justify-center font-normal">
                <span
                  ><Wallet class="text-muted-foreground mr-1 size-4 stroke-2"
                /></span>
                <span class="mr-2"
                  >${{
                    accountStore.balance == null ? "-" : accountStore.balance
                  }}</span
                >
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul
                class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]"
              >
                <li class="row-span-2">
                  <NavigationMenuLink as-child>
                    <div
                      class="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                    >
                      <User class="size-6" />
                      <div class="mt-2 mb-1 text-lg font-medium">Profile</div>
                      <p class="text-muted-foreground text-sm leading-tight">
                        Edit your profile, change password, and more.
                      </p>
                    </div>
                  </NavigationMenuLink>
                </li>

                <li>
                  <NavigationMenuLink @click="drawerOpen = true" as-child>
                    <div
                      class="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                    >
                      <div
                        class="inline-flex items-center text-sm leading-none"
                      >
                        <BanknoteArrowUp
                          class="text-muted-foreground mr-1 size-5"
                        />
                        Top Up
                      </div>
                      <p
                        class="text-muted-foreground line-clamp-2 text-sm leading-snug"
                      >
                        Add funds to your account to start trading and
                        investing.
                      </p>
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink as-child>
                    <div
                      class="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                    >
                      <div
                        class="inline-flex items-center text-sm leading-none"
                      >
                        <BanknoteArrowDown
                          class="text-muted-foreground mr-1 size-5"
                        />
                        Withdraw
                      </div>
                      <p
                        class="text-muted-foreground line-clamp-2 text-sm leading-snug"
                      >
                        Whoo! Time to withdraw your money to anywhere you want!
                      </p>
                    </div>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  </nav>
  <TopUpDrawer v-model:open="drawerOpen" />
</template>

<style scoped></style>
