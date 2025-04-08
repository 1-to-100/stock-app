"use client";

import * as React from "react";
import { useState } from "react";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { Tabs, TabList, Tab, TabPanel } from "@mui/joy";
import RoleSettings from "@/components/dashboard/role-settings/role-settings";
import UserPersonas from "@/components/dashboard/role-settings/user-personas";
import SearchInput from "@/components/dashboard/layout/search-input";

export default function Page(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState("role-settings");

  const handleSearch = (searchTerm: string) => {
    
  };

  return (
    <Box sx={{ p: "var(--Content-padding)" }}>
      <SearchInput
        onSearch={handleSearch}
        style={{ position: "fixed", top: "4%", zIndex: "1000" }}
      />
      <Stack spacing={3}>
        <div>
          <Typography fontSize={{ xs: "xl3", lg: "xl4" }} level="h1">
            Role & Personas Settings
          </Typography>
        </div>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue as string)}
          variant="custom"
        >
          <TabList sx={{ width: "100%", maxWidth: "400px" }}>
            <Tab value="role-settings">Role settings</Tab>
            <Tab value="rich-user">Rich user personas</Tab>
          </TabList>
          <TabPanel value="role-settings" sx={{ p: 0, mt: 2 }}>
            <RoleSettings />
          </TabPanel>
          <TabPanel value="rich-user" sx={{ p: 0, mt: 2 }}>
            <UserPersonas />
          </TabPanel>
        </Tabs>
      </Stack>
    </Box>
  );
}
