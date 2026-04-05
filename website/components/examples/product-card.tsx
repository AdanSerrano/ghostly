interface ProductCardProps {
  product?: {
    title: string
    price: string
    image: string
    category: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {product?.image ? (
        <img
          src={product.image}
          alt={product.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="h-48 w-full bg-gray-200" />
      )}
      <div className="flex flex-col gap-2 p-4">
        <span className="w-fit rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {product?.category ?? ''}
        </span>
        <h3 className="text-lg font-semibold text-gray-900">
          {product?.title ?? ''}
        </h3>
        <p className="text-xl font-bold text-blue-600">
          {product?.price ?? ''}
        </p>
        <button className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
          Add to cart
        </button>
      </div>
    </div>
  )
}
