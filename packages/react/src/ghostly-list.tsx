import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react'
import { Children, cloneElement, forwardRef, isValidElement, useId, useMemo } from 'react'
import { validateGhostlyProps, type GhostlyConfig } from 'ghostly'
import { Ghostly } from './ghostly'

type ListTag = 'div' | 'ul' | 'ol' | 'section' | 'main' | 'aside'

interface GhostlyListProps extends GhostlyConfig, Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** When true, shows skeleton items instead of children */
  loading: boolean
  /** Number of skeleton items to show while loading */
  count: number
  /** Template element to repeat as skeleton. If omitted, uses the first child as template */
  item?: ReactElement
  /** HTML tag for the wrapper element. Default: 'div' */
  as?: ListTag
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
  { loading, count, item, children, animation, radius, speed, color, shine, as: Tag = 'div', className, ...rest },
  ref: Ref<HTMLElement>,
) {
  validateGhostlyProps('GhostlyList', { animation, radius, speed })

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
        color={color}
        shine={shine}
        as={Tag}
        className={className}
        {...rest}
      >
        {skeletonItems}
      </Ghostly>
    )
  }

  return (
    <Tag ref={ref as Ref<never>} className={className} {...rest}>
      {children}
    </Tag>
  )
})

function getFirstChild(children: ReactNode): ReactElement | null {
  const arr = Children.toArray(children)
  for (const child of arr) {
    if (isValidElement(child)) return child
  }
  return null
}
