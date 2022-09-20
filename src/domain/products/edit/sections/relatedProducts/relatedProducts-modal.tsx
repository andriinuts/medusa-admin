import { Product } from "@medusajs/medusa"
import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import useEditProductActions from "../../hooks/use-edit-product-actions"
import RelatedProductsForm from "./RelatedProductsForm";

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

export type RelatedProductsFormType = {
  relatedProducts: string[];
}

const RelatedProductsModal = ({ product, open, onClose }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id)
  const form = useForm<RelatedProductsFormType>({
    defaultValues: getDefaultValues(product),
  })
  const {
    formState: { isDirty },
    control,
    handleSubmit,
    reset,
  } = form

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product])

  const onReset = () => {
    reset(getDefaultValues(product))
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    onUpdate(
      {
       metadata: {...product.metadata, ...data}
      },
      onReset
    )
  })

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">Edit Related Products</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
              <Controller
                  name="relatedProducts"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <RelatedProductsForm value={value} onChange={onChange} />
                  )}
              />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex gap-x-2 justify-end w-full">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={updating}
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product): RelatedProductsFormType => {
  return {
    relatedProducts: (product.metadata?.relatedProducts as string[]) || [],
  }
}

export default RelatedProductsModal
