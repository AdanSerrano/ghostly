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
    <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      {product?.image ? (
        <img
          src={product.image}
          alt={product.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="h-48 w-full bg-fd-muted" />
      )}
      <div className="flex flex-col gap-2 p-4">
        <span className="w-fit rounded-full bg-fd-muted px-2 py-0.5 text-xs text-fd-muted-foreground">
          {product?.category ?? ''}
        </span>
        <h3 className="text-lg font-semibold text-fd-foreground">
          {product?.title ?? ''}
        </h3>
        <p className="text-xl font-bold text-fd-primary">
          {product?.price ?? ''}
        </p>
        <button className="mt-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground">
          Add to cart
        </button>
      </div>
    </div>
  )
}
