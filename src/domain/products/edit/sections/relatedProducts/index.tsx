import { Product } from "@medusajs/medusa"
import React, { useMemo } from "react"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import { ActionType } from "../../../../../components/molecules/actionables"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import RelatedProductsModal from "./relatedProducts-modal"
import { useAdminProducts } from "medusa-react"

type Props = {
  product: Product
}

const TranslationSection = ({ product }: Props) => {
  const { products } = useAdminProducts()
  const { state, toggle, close } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Edit Related Products",
      onClick: toggle,
      icon: <EditIcon size={20} />,
    },
  ]

  const relatedProducts = useMemo(() => {
    if (!products?.length) {
      return []
    }
    return ((product.metadata?.relatedProducts as string[]) || [])
      .map((productId) => {
        const p = products?.find((item) => item.id === productId)
        if (!p) {
          return null
        }
        return p.title
      })
      .filter((value) => value)
  }, [product?.metadata?.relatedProducts, products])

  return (
    <>
      <Section title="Related Products" actions={actions} forceDropdown>
        <div className="flex flex-col gap-y-xsmall mb-large mt-base">
          {relatedProducts.map((title) => (
            <>
              <p>{title}</p>
            </>
          ))}

          {!relatedProducts.length && <p>No related products</p>}
        </div>
      </Section>

      <RelatedProductsModal onClose={close} open={state} product={product} />
    </>
  )
}

export default TranslationSection
