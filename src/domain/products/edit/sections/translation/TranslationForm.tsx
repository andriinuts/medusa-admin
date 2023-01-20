import React, { FC, useState } from "react"
import clsx from "clsx"
import Textarea from "../../../../../components/molecules/textarea"
import { NestedForm } from "../../../../../utils/nested-form"
import { TranslationFormDetails } from "./translation-modal"
import { fields, languages } from "./index"

type TranslationFormProps = {
  form: NestedForm<Record<string, TranslationFormDetails>>
}

const TranslationForm: FC<TranslationFormProps> = ({ form }) => {
  const { register, path } = form

  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    languages[0].code
  )

  return (
    <>
      <div className="flex">
        {languages.map(({ title, code, img }, index, array) => (
          <div
            key={code}
            className={clsx(
              "w-20 bg-white border border-grey-20 p-2 cursor-pointer",
              {
                "rounded-l": index === 0,
                "rounded-r": index === array.length - 1,
                "bg-grey-20": selectedLanguage === code,
              }
            )}
            onClick={() => setSelectedLanguage(code)}
          >
            <div className="justify-center flex items-center">
              <img className="h-3 mr-2" alt={title} src={img} /> {title}
            </div>
          </div>
        ))}
      </div>
      {languages.map(({ code }) => (
        <div className={clsx({ hidden: selectedLanguage !== code })} key={code}>
          {fields.map((field) => (
            <Textarea
              label={field.label}
              placeholder={field.placeholder}
              className="mt-3"
              rows={field.rows}
              {...register(path(`${code}.${field.name}`))}
            />
          ))}
        </div>
      ))}
    </>
  )
}

export default TranslationForm
