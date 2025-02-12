import { Field, Input, InputProps as ChakraInputProps } from "@chakra-ui/react";
import React from "react";
import { PasswordInput } from "../ui/password-input";

interface TextInputProps extends ChakraInputProps {
    
    invalid?: boolean;
    title?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
    password?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
    invalid,
    title,
    placeholder,
    value,
    onChange,
    errorMessage, 
    password,
    ...props
}) => {
    const InputComponent = password ? PasswordInput : Input;

    return (
        <Field.Root invalid={invalid ?? false}>
            <Field.Label>{title}</Field.Label>
            <InputComponent
                {...props}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                bg="gray.700"
                color="white"
                
            />
            <Field.ErrorText>{ errorMessage }</Field.ErrorText>
        </Field.Root>
    );
};

export default TextInput;