import React, { useEffect } from "react"
import InputField from "../../../../../components/molecules/input"
import Button from "../../../../../components/fundamentals/button"

export const defaultNovaposhtaMetadata: NovaposhtaMetadata = {
  weight: "0.5",
  description: "Біжутерія",
}

export type NovaposhtaMetadata = {
  weight?: string
  description?: string
  width?: string
  height?: string
  length?: string
  volume?: string
}

type Props = {
  metadata: NovaposhtaMetadata
  setMetadata: React.Dispatch<
    React.SetStateAction<Record<string, string | undefined>>
  >
  heading?: string
}

const calculateVolume = (width: number, height: number, length: number) =>
  (width * height * length) / 4000

const NovaposhtaFulfillment: React.FC<Props> = ({
  metadata,
  setMetadata,
  heading = "Novaposhta Options",
}) => {
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateValue = (key: keyof NovaposhtaMetadata, value: string) => {
    setMetadata((prevState) => {
      const updatedState = { ...prevState, [key]: value }
      updatedState.volume = undefined
      if (
        !!Number(updatedState.width) &&
        !!Number(updatedState.height) &&
        !!Number(updatedState.length)
      ) {
        updatedState.volume = calculateVolume(
          Number(updatedState.width),
          Number(updatedState.height),
          Number(updatedState.length)
        ).toFixed(2)
      }

      return updatedState
    })
  }

  const handleSmallSizeClick = () => {
    setMetadata((prevState) => {
      const updatedState = { ...prevState }
      updatedState.length = "17"
      updatedState.width = "12"
      updatedState.height = "6"
      updatedState.volume = calculateVolume(
        Number(updatedState.width),
        Number(updatedState.height),
        Number(updatedState.length)
      ).toFixed(2)

      return updatedState
    })
  }

  return (
    <div>
      <span className="inter-base-semibold">{heading}</span>
      <div className="mt-base flex flex-col gap-y-base">
        <div className="flex w-full items-center gap-x-xsmall">
          <div className="maw-w-[200px]">
            <InputField
              label="Weight"
              type="number"
              placeholder="Weight"
              defaultValue={metadata.weight}
              onChange={(e) => {
                updateValue("weight", e.currentTarget.value)
              }}
            />
          </div>
          <div className="flex-grow">
            <InputField
              label="Description"
              placeholder="Description"
              defaultValue={metadata.description}
              onChange={(e) => {
                updateValue("description", e.currentTarget.value)
              }}
            />
          </div>
        </div>
        <div className="flex w-full items-center gap-x-xsmall">
          <div className="maw-w-[200px]">
            <InputField
              label="Width"
              type="number"
              placeholder="Width"
              value={metadata.width}
              onChange={(e) => {
                updateValue("width", e.currentTarget.value)
              }}
            />
          </div>
          <div className="flex-grow">
            <InputField
              label="Height"
              type="number"
              placeholder="Height"
              value={metadata.height}
              onChange={(e) => {
                updateValue("height", e.currentTarget.value)
              }}
            />
          </div>
          <div className="flex-grow">
            <InputField
              label="Length"
              type="number"
              placeholder="Length"
              value={metadata.length}
              onChange={(e) => {
                updateValue("length", e.currentTarget.value)
              }}
            />
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            size="small"
            onClick={handleSmallSizeClick}
          >
            Small
          </Button>
        </div>
      </div>
    </div>
  )
}
export default NovaposhtaFulfillment
