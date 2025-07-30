<script setup lang="ts">
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PieChart from "@/components/dashboard/PieChart.vue";
import LineGraph from "@/components/dashboard/LineGraph.vue";

const plugin = Autoplay({
  delay: 3500,
  stopOnMouseEnter: true,
  stopOnInteraction: false,
});
</script>

<template>
  <div class="rounded-2xl border">
    <div class="border px-4">
      <Carousel
        class="relative w-full max-w-xl"
        :plugins="[plugin]"
        @mouseenter="plugin.stop"
        @mouseleave="[plugin.reset(), plugin.play()]"
      >
        <CarouselContent>
          <CarouselItem class="mx-auto">
            <PieChart />
          </CarouselItem>
          <CarouselItem class="mx-auto">
            <LineGraph />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  </div>
</template>
