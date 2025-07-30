<script setup lang="ts">
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import PieChart from "@/components/dashboard/PieChart.vue";
import LineGraph from "@/components/dashboard/LineGraph.vue";
import { ChartArea } from "lucide-vue-next";

const plugin = Autoplay({
  delay: 4000,
  stopOnMouseEnter: true,
  stopOnInteraction: false,
});
</script>

<template>
  <div class="rounded-2xl border p-4">
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
    </Carousel>
  </div>
</template>
