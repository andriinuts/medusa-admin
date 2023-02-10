import React, { FC, useCallback, useContext, useEffect, useState } from "react"
import { useNewOrderForm } from "../../form"
import { Controller } from "react-hook-form"
import { medusaUrl } from "../../../../../services/config"
import Select from "../../../../../components/molecules/select"
import Input from "../../../../../components/molecules/input"
import FormValidator from "../../../../../utils/form-validator"
import { AccountContext } from "../../../../../context/account"
import { GhostSmallLoading } from "../../../../../components/fundamentals/button/button.stories"
import { isValidPhoneNumber } from "react-phone-number-input"
import PhoneInput from "react-phone-number-input/react-hook-form-input"

type Props = {}

const NovaposhtaShipping: FC<Props> = () => {
  const { email } = useContext(AccountContext)
  const [isWarehousesLoading, setIsWarehousesLoading] = useState(false)
  const [warehouses, setWarehouses] = useState<any>([])
  const {
    context: { selectedShippingOption, validCountries },
    form: {
      control,
      setValue,
      register,
      getValues,
      formState: { errors },
    },
  } = useNewOrderForm()

  if (selectedShippingOption?.provider_id !== "novaposhta") {
    return null
  }

  const getNPCities = async (name: string) => {
    const rez = await fetch(
      `${medusaUrl}/store/np/cities?name=${encodeURI(name)}&limit=20`
    )
    const { data = [] } = (await rez.json()) || {}

    const options = (data as any)?.map((item) => ({
      label: item.Description,
      value: { ref: item.Ref, title: item.Description },
    }))

    return options
  }

  const loadWarehouses = async (cityRef: string) => {
    setIsWarehousesLoading(true)
    const rez = await fetch(
      `${medusaUrl}/store/np/warehouses?city=${encodeURI(cityRef)}`
    )
    const { data = [] } = (await rez.json()) || {}

    const options = (data as any)?.map((item) => ({
      label: item.Description,
      value: {
        ref: item.Ref,
        title: item.Description,
      },
    }))

    setWarehouses(options)
    setIsWarehousesLoading(false)
  }

  const searchWarehouse = useCallback(
    async (name: string) => {
      if (!name) {
        return warehouses.slice(0, 100)
      }

      return warehouses
        .filter((item) => item.label.includes(name))
        .slice(0, 100)
    },
    [warehouses]
  )

  useEffect(() => {
    setValue("email", email)
  }, [email, setValue])

  useEffect(() => {
    const city = getValues("shipping_option_data.city")
    if (city?.value?.ref) {
      loadWarehouses(city?.value?.ref)
    }
  }, [])

  return (
    <>
      <span className="inter-base-semibold">General</span>
      <div className="grid grid-cols-2 gap-large mt-4 mb-8">
        <Input
          {...register("shipping_address.first_name", {
            required: true,
            pattern: FormValidator.whiteSpaceRule("First name"),
          })}
          placeholder="First Name"
          label="First Name"
          required
        />
        <Input
          {...register("shipping_address.last_name", {
            required: true,
            pattern: FormValidator.whiteSpaceRule("Last name"),
          })}
          placeholder="Last Name"
          label="Last Name"
          required
        />

        <PhoneInput
          name="shipping_address.phone"
          international
          withCountryCallingCode
          country="UA"
          placeholder="Phone"
          label="Phone"
          defaultValue=""
          control={control}
          autoComplete="tel"
          required
          inputComponent={Input}
          aria-describedby="phone-error"
          aria-invalid={!!errors["phone-error"]}
          rules={{
            required: true,
            validate: isValidPhoneNumber,
          }}
        />
      </div>
      <div className="mt-4">
        <span className="inter-base-semibold">Novaposhta address</span>
        <div className="mt-4">
          <Controller
            control={control}
            name="shipping_option_data.city"
            render={({ field: { value, onChange } }) => {
              return (
                <Select
                  label="City"
                  onChange={(val) => {
                    setWarehouses([])
                    setValue("shipping_option_data.warehouse", null)
                    loadWarehouses(val.value.ref)
                    onChange(val)
                    setValue("shipping_address.city", val.value.title)
                  }}
                  value={value}
                  enableSearch
                  options={[]}
                  clearSelected
                  filterOptions={getNPCities as any}
                />
              )
            }}
          />

          <div className="mt-4 relative">
            <Controller
              control={control}
              name="shipping_option_data.warehouse"
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    label="Warehouse"
                    onChange={(val) => {
                      onChange(val)
                      setValue("shipping_address.address_1", val.value.title)
                      setValue(
                        "shipping_address.country_code",
                        validCountries[0]
                      )
                    }}
                    value={value}
                    enableSearch
                    options={[]}
                    clearSelected
                    filterOptions={searchWarehouse as any}
                  />
                )
              }}
            />
            {isWarehousesLoading && (
              <GhostSmallLoading
                className="absolute -top-3 left-12"
                loading
                variant="ghost"
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default NovaposhtaShipping