"use client";

import { ICategory } from "@/app/interfaces/categoryInterface";
import React from "react";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";


const swiperOptions = {
  slidesPerView: 4,
  loop: true,
  pagination: {
    clickable: true,
    bulletClass: "swiper-pagination-bullet !size-3 ",
    bulletActiveClass: "swiper-pagination-bullet-active !bg-red-500",
  },
  modules: [Pagination, Autoplay],
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
};


export default function CategoriesSwiper( {categories }: {categories: ICategory[] }) {
  return (
    <Swiper {...swiperOptions} className="CategoriesSwiper">
      {categories.map((cat) => (
        <SwiperSlide key={cat._id} className="mb-6">
          <Image src={cat.image} alt={cat.name} width={270} height={260} className="w-full object-contain h-[15.5rem]" />
          <h3 className="text-center">{cat.name}</h3>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
