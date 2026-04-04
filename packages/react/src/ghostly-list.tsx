import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react'
import { Children, cloneElement, forwardRef, isValidElement, useId, useMemo } from 'react'
import type { GhostlyConfig } from 'ghostly'
import { Ghostly } from './ghostly'

interface GhostlyListProps extends GhostlyConfig, Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** When true, shows skeleton items instead of children */
  loading: boolean
  /** Number of skeleton items to show while loading */
  count: number
  /** Template element to repeat as skeleton. If omitted, uses the first child as template */
  item?: ReactElement
  children: ReactNode
}

/**
 * Skeleton loader for lists and grids.
 *
 * @example
 * ```tsx
 * <GhostlyList
 *   loading={isLoading}
 *   count={6}
 *   item={<ProductCard />}
 *   className="grid grid-cols-3 gap-4"
 * >
 *   {products.map(p => <ProductCard key={p.id} product={p} />)}
 * </GhostlyList>
 * ```
 */
export const GhostlyList = forwardRef<HTMLElement, GhostlyListProps>(function GhostlyList(
  { loading, count, item, children, animation, radius, speed, className, ...rest },
  ref: Ref<HTMLElement>,
) {
  const listId = useId()
  const template = item ?? getFirstChild(children)

  const skeletonItems = useMemo(() => {
    if (!loading || !template) return null
    return Array.from({ length: count }, (_, i) =>
      cloneElement(template, { key: `${listId}-${i}` }),
    )
  }, [loading, count, template, listId])

  if (loading) {
    return (
      <Ghostly
        ref={ref}
        loading={true}
        animation={animation}
        radius={radius}
        speed={speed}
        className={className}
        {...rest}
      >
        {skeletonItems}
      </Ghostly>
    )
  }

  return (
    <div ref={ref as Ref<HTMLDivElement>} className={className} {...rest}>
      {children}
    </div>
  )
})

function getFirstChild(children: ReactNode): ReactElement | null {
  const arr = Children.toArray(children)
  for (const child of arr) {
    if (isValidElement(child)) return child
  }
  return null
}
