import React, {FC, useCallback, useMemo} from "react"
import {NextSelect} from "../../../../../components/molecules/select/next-select";
import {useAdminProducts} from "medusa-react";

type TranslationFormProps = {
    onChange: (data: string[]) => void;
    value: string[];
}

const RelatedProductsForm: FC<TranslationFormProps> = ({onChange, value}) => {
    const {products} = useAdminProducts();
    const productsOptions = useMemo(() => products?.map(item => ({
        value: item.id,
        label: item.title
    })), [value, products]);
    const selectValue = useMemo(() => value.map(item => productsOptions?.find(el => el.value === item)).filter(value => value),
        [productsOptions, value])

    const handleAddProduct = useCallback((selectedProducts: any) => {
        onChange(selectedProducts.map(item => item.value));
    }, [])

    if (!productsOptions?.length) return null;

    return (
        <NextSelect
            label="Related products"
            onChange={handleAddProduct}
            options={productsOptions}
            value={selectValue}
            placeholder="Choose a product"
            isMulti
            isClearable
        />

    )
}

export default RelatedProductsForm
