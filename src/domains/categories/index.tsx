'use client'

import { ProductsService, type Category } from '@/lib/services/products'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await ProductsService.getCategories()
                setCategories(data)
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [])

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">Loading categories...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">All Categories</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="group block"
                    >
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                            {category.image ? (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    width={400}
                                    height={400}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                        <h3 className="font-semibold text-center group-hover:text-red-600 transition-colors">
                            {category.name}
                        </h3>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default CategoriesPage
