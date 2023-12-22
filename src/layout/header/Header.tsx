import { Menu } from "@mui/icons-material";
import { Box, Container } from "@mui/material";
import React from "react";
import ButtonConnectWallet from "src/components/ButtonConnectWallet/ButtonConnectWallet";

export default function Header({ headerHeight }: { headerHeight: string }) {
    return (
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider", height: headerHeight, position: "sticky", top: "0", left: 0, width: "100%", zIndex: "900" }}>
            <Container sx={{ height: headerHeight, display: "flex", placeItems: "center" }}>
                <Box component={"label"} htmlFor="control-sidebar" sx={{ display: { xs: "flex", lg: "none" }, cursor: "pointer", ml: 1 }}>
                    <Menu sx={{ fontSize: "28px" }} />
                </Box>
                <ButtonConnectWallet />
            </Container>
        </Box>
    );
}
