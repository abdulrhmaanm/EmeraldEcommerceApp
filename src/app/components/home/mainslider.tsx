"use client";
import slide1 from "@/assets/images/slider-image-1.jpeg";
import slide2 from "@/assets/images/slider-image-2.jpeg";
import slide3 from "@/assets/images/slider-image-3.jpeg";
import "swiper/css";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const swiperOptions = {
 slidesPerView: 1,
  loop: true,
 pagination: {
    clickable: true,
    bulletClass: 'swiper-pagination-bullet !size-3 ',
    bulletActiveClass: 'swiper-pagination-bullet-active !bg-red-500',

 },
  modules: [Pagination, Autoplay],
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
};

const images = [
    {
        path: slide1,
        label : "Slide 1",
    },
        {
        path: slide2,
        label : "Slide 2",
    },
        {
        path: slide3,
        label : "Slide 3",
    },
]

export default function Mainslider() {
  return (
<section>
    <div className="container mx-auto ">
            <Swiper {...swiperOptions} className="MainSlider">
        {
            images.map((img, index) => (
                <SwiperSlide key={index} className="">
                    <Image src={img.path} alt={img.label} width={892} height={344} />
                </SwiperSlide>
            ) )
        }
    </Swiper>
    </div>
</section>
  );
}
