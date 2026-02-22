import React from 'react'
import Link from 'next/link';
import { getCategories } from '@/app/apis/categoriesApi';
import { ICategory } from '@/app/interfaces/categoryInterface';

export default async function CategoriesList() {
  const { data: categories }: { data: ICategory[] } = await getCategories();

  return (
    <div className="container w-fit">
      <ul className="flex flex-col gap-4 p-0">
        {categories.map((category) => (
          <li key={category._id}>
            <Link href={`/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
