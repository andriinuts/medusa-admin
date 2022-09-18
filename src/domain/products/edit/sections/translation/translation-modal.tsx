import { Product } from "@medusajs/medusa"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { nestedForm } from "../../../../../utils/nested-form"
import useEditProductActions from "../../hooks/use-edit-product-actions"
import TranslationForm from "./TranslationForm";

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

export type TranslationFormDetails = {
  description?: string;
  material?: string;
}

export type TranslationFormType = {
  translation: Record<string, TranslationFormDetails>
}

const TranslationModal = ({ product, open, onClose }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id)
  const form = useForm<TranslationFormType>({
    defaultValues: getDefaultValues(product),
  })
  const {
    formState: { isDirty },
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
          <h1 className="inter-xlarge-semibold m-0">Edit Translation</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="mb-xlarge">
              <h2 className="inter-large-semibold mb-2xsmall">Description</h2>
              <p className="inter-base-regular text-grey-50 mb-large">
                Update description for all languages
              </p>
              <TranslationForm form={nestedForm(form, "translation")} />
            </div>
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

const getDefaultValues = (product: Product): TranslationFormType => {
  return {
    translation: (product.metadata?.translation as Record<string, TranslationFormDetails>) || {uk: {}, en: {}},
  }
}

export default TranslationModal
