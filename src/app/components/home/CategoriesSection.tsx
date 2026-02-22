import { getCategories } from "@/app/apis/categoriesApi";
import { ICategory } from "@/app/interfaces/categoryInterface";
import React from "react";
import SectionTitle from "../shared/SectionTitle";
import { Separator } from "@/components/ui/separator";
import CategoriesSwiper from "./CategoriesSwiper";

export default async function CategoriesSection() {
  const { data: categories }: { data: ICategory[] } = await getCategories();

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <SectionTitle title={"Categories"} subtitle={"Browse By Category"} />
        <CategoriesSwiper categories={categories} />
        <Separator className="mt-10" />
      </div>
    </div>
  );
}