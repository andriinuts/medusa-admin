import React, { FC, useCallback, useEffect, useState } from "react"
import { useAdminGetSession } from "medusa-react"
import { useNewOrderForm } from "../../form"
import { Controller } from "react-hook-form"
import { medusaUrl } from "../../../../../services/config"
import Select from "../../../../../components/molecules/select"
import Input from "../../../../../components/molecules/input"
import FormValidator from "../../../../../utils/form-validator"
import { GhostSmallLoading } from "../../../../../components/fundamentals/button/button.stories"
import { isValidPhoneNumber } from "react-phone-number-input"
import PhoneInput from "react-phone-number-input/react-hook-form-input"
import medusaRequest from "../../../../../services/request"

type Props = {}

const NovaposhtaShipping: FC<Props> = () => {
  const { user } = useAdminGetSession()
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
    const { data } = await medusaRequest(
      "GET",
      `${medusaUrl}/admin/np/cities?name=${encodeURI(name)}&limit=20`
    )

    return (data.data as any)?.map((item) => ({
      label: item.Description,
      value: { ref: item.Ref, title: item.Description },
    }))
  }

  const loadWarehouses = async (cityRef: string) => {
    setIsWarehousesLoading(true)
    const { data } = await medusaRequest(
      "GET",
      `${medusaUrl}/admin/np/warehouses?city=${encodeURI(cityRef)}`
    )

    const options = (data.data as any)?.map((item) => ({
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
    if (!user?.email) {
      return
    }
    setValue("email", user.email)
  }, [user?.email, setValue])

  useEffect(() => {
    const city = getValues("shipping_option_data.city")
    if (city?.value?.ref) {
      loadWarehouses(city?.value?.ref)
    }
  }, [])

  return (
    <>
      <span className="inter-base-semibold">General</span>
      <div className="mt-4 mb-8 grid grid-cols-2 gap-large">
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

          <div className="relative mt-4">
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
