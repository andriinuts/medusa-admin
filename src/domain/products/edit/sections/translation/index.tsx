import { Product } from "@medusajs/medusa"
import React from "react"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import { ActionType } from "../../../../../components/molecules/actionables"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import TranslationModal, { TranslationFormDetails } from "./translation-modal"

type Props = {
  product: Product
}

export const languages = [
  {
    title: "UK",
    code: "uk",
    img: "https://purecatamphetamine.github.io/country-flag-icons/3x2/UA.svg",
  },
  {
    title: "EN",
    code: "en",
    img: "https://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg",
  },
]

export const fields = [
  {
    name: "description",
    label: "Description",
    placeholder: "Description of the product...",
    rows: 6,
  },
  {
    name: "materials",
    label: "Materials",
    placeholder: "Material description...",
    rows: 3,
  },
]

const TranslationSection = ({ product }: Props) => {
  const { state, toggle, close } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Edit Translation",
      onClick: toggle,
      icon: <EditIcon size={20} />,
    },
  ]

  return (
    <>
      <Section title="Translation" actions={actions} forceDropdown>
        {languages.map(({ title, code, img }) => (
          <div className="flex flex-col gap-y-xsmall mb-large mt-base">
            <h2 className="inter-base-semibold flex items-center">
              <img className="h-3 mr-2" alt={title} src={img} /> {title}
            </h2>

            {fields.map((field) => (
              <>
                <h3 className="text-sm inter-base-semibold">{field.label}</h3>
                <p>
                  {(product.metadata?.translation as TranslationFormDetails)?.[
                    code
                  ]?.[field.name] || "-"}
                </p>
              </>
            ))}
          </div>
        ))}
      </Section>

      <TranslationModal onClose={close} open={state} product={product} />
    </>
  )
}

export default TranslationSection
