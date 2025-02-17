"use client";

import { useColorMode } from "@/hooks/color-mode.hooks";
import type { IconButtonProps } from "@chakra-ui/react";
import { ClientOnly, IconButton, Skeleton } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { LuMoon, LuSun } from "react-icons/lu";

// 移除空介面，直接使用 ThemeProviderProps
export function ColorModeProvider(props: ThemeProviderProps) {
    return (
        <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
    );
}

export type ColorModeProviderProps = ThemeProviderProps;

// 將 hooks 和 utility functions 移至單獨的文件 color-mode.hooks.ts
type ColorModeButtonProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeButton = React.forwardRef<
    HTMLButtonElement,
    ColorModeButtonProps
>(function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode();
    return (
        <ClientOnly fallback={<Skeleton boxSize="8" />}>
            <IconButton
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle color mode"
                size="sm"
                ref={ref}
                {...props}
                css={{
                    _icon: {
                        width: "5",
                        height: "5",
                    },
                }}
            >
                <ColorModeIcon />
            </IconButton>
        </ClientOnly>
    );
});

// 將 Icon 組件保留在這個文件中
export function ColorModeIcon() {
    const { colorMode } = useColorMode();
    return colorMode === "light" ? <LuSun /> : <LuMoon />;
}