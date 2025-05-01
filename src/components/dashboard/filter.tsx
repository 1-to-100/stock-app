"use client";

import * as React from "react";
import { useState } from "react";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import { Funnel as FunnelIcon } from "@phosphor-icons/react/dist/ssr/Funnel";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { X as X } from "@phosphor-icons/react/dist/ssr/X";
import { ApiUser, Customer } from "@/contexts/auth/types";
import { useQuery } from "@tanstack/react-query";
import { getCustomers, getSubscriptions } from "@/lib/api/customers";
import { getRoles } from "@/lib/api/roles";
import { getManagers } from "@/lib/api/managers";
import { getStatuses } from "@/lib/api/users";

interface FilterProps {
  users?: ApiUser[];
  customers?: Customer[];
  onClose?: () => void;
  open?: boolean;
  onOpen?: () => void;
  onFilter?: (filters: {
    statusId: string[];
    customerId: number[];
    roleId: number[];
  }) => void;
  onFilterCustomers?: (filters: {
    managerId: number[];
    subscriptionId: number[];
    statusId: string[];
  }) => void;
}

const Filter = ({
  users,
  customers,
  onFilter,
  onFilterCustomers,
  onClose,
  open = false,
  onOpen,
}: FilterProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [selectedManagerIds, setSelectedManagerIds] = useState<number[]>([]);
  const [selectedSubscriptionIds, setSelectedSubscriptionIds] = useState<
    number[]
  >([]);
  const [activeCategory, setActiveCategory] = useState<string | null>("Status");

  const { data: customersSelect, isLoading: isCustomersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
    enabled: open,
  });

  const { data: managersSelect, isLoading: isManagersLoading } = useQuery({
    queryKey: ["managers"],
    queryFn: getManagers,
    enabled: open,
  });

  const { data: roles, isLoading: isRolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    enabled: open,
  });

  const { data: subscriptions, isLoading: isSubscriptionsLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
    enabled: open,
  });

  const { data: statuses, isLoading: isStatusesLoading } = useQuery({
    queryKey: ["statuses"],
    queryFn: getStatuses,
    enabled: open,
  });

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (onOpen) {
      onOpen();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveCategory("Status");
    if (onClose) {
      onClose();
    }
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category === activeCategory ? null : category);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleCustomerChange = (customerId: number) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(customerId)
        ? prev.filter((c) => c !== customerId)
        : [...prev, customerId]
    );
  };

  const handleRoleChange = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleManagerChange = (managerId: number) => {
    setSelectedManagerIds((prev) =>
      prev.includes(managerId)
        ? prev.filter((m) => m !== managerId)
        : [...prev, managerId]
    );
  };

  const handleSubscriptionChange = (subscriptionId: number) => {
    setSelectedSubscriptionIds((prev) =>
      prev.includes(subscriptionId)
        ? prev.filter((s) => s !== subscriptionId)
        : [...prev, subscriptionId]
    );
  };

  const handleApply = () => {
    if (users && onFilter) {
      onFilter({
        statusId: selectedStatuses,
        customerId: selectedCustomerIds,
        roleId: selectedRoleIds,
      });
    }
    if (customers && onFilterCustomers) {
      onFilterCustomers({
        managerId: selectedManagerIds,
        subscriptionId: selectedSubscriptionIds,
        statusId: selectedStatuses,
      });
    }
    handleClose();
  };

  const handleReset = (
    event: React.MouseEvent<SVGSVGElement | HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setSelectedStatuses([]);
    setSelectedCustomerIds([]);
    setSelectedRoleIds([]);
    setSelectedManagerIds([]);
    setSelectedSubscriptionIds([]);
    if (users && onFilter) {
      onFilter({ statusId: [], customerId: [], roleId: [] });
    }
    if (customers && onFilterCustomers) {
      onFilterCustomers({ managerId: [], subscriptionId: [], statusId: [] });
    }
    // handleClose();
  };

  const totalFiltersApplied =
    selectedStatuses.length +
    selectedCustomerIds.length +
    selectedRoleIds.length +
    selectedManagerIds.length +
    selectedSubscriptionIds.length;

  return (
    <>
      <Button
        variant="outlined"
        startDecorator={
          totalFiltersApplied > 0 ? (
            <X fontSize="var(--Icon-fontSize)" onClick={handleReset} />
          ) : (
            <FunnelIcon fontSize="var(--Icon-fontSize)" />
          )
        }
        onClick={handleOpen}
        sx={{
          borderColor:
            totalFiltersApplied > 0
              ? "transparent"
              : "var(--joy-palette-divider)",
          borderRadius: "20px",
          background:
            totalFiltersApplied > 0
              ? "#C7C5FC"
              : "var(--joy-palette-background-mainBg)",
          color:
            totalFiltersApplied > 0
              ? "#3D37DD"
              : "var(--joy-palette-text-primary)",
          padding: "7px 14px",
        }}
      >
        {totalFiltersApplied > 0
          ? `${totalFiltersApplied} filter${
              totalFiltersApplied !== 1 ? "s" : ""
            } apply`
          : "Filter"}
      </Button>

      {open && anchorEl && (
        <Sheet
          sx={{
            position: "absolute",
            top: anchorEl.getBoundingClientRect().bottom + 5,
            right: "9.5vw",
            width: "550px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid var(--joy-palette-divider)",
            zIndex: 1300,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" spacing={1}>
            <Box sx={{ width: "58%", pr: 1 }}>
              <Typography
                level="body-sm"
                sx={{
                  color: "var(--joy-palette-text-secondary)",
                  fontSize: "12px",
                  mb: 1.5,
                }}
              >
                {totalFiltersApplied} filter
                {totalFiltersApplied !== 1 ? "s" : ""} apply
              </Typography>
              <Stack
                spacing={1}
                sx={{
                  borderRight: "1px solid var(--joy-palette-divider)",
                  paddingRight: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: "6px 12px",
                    bgcolor:
                      activeCategory === "Status"
                        ? "var(--joy-palette-background-mainBg)"
                        : "transparent",
                    borderRadius: "4px",
                    border:
                      activeCategory === "Status"
                        ? "1px solid var(--joy-palette-divider)"
                        : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick("Status")}
                >
                  <Typography
                    level="body-md"
                    fontWeight="400"
                    sx={{
                      color:
                        activeCategory === "Status"
                          ? "var(--joy-palette-text-primary)"
                          : "#32383E",
                      fontSize: "16px",
                    }}
                  >
                    Status
                  </Typography>
                  <ArrowRightIcon fontSize="var(--Icon-fontSize)" />
                </Box>
                {users && users?.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: "6px 12px",
                      bgcolor:
                        activeCategory === "Customer"
                          ? "var(--joy-palette-background-mainBg)"
                          : "transparent",
                      borderRadius: "4px",
                      border:
                        activeCategory === "Customer"
                          ? "1px solid var(--joy-palette-divider)"
                          : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCategoryClick("Customer")}
                  >
                    <Typography
                      level="body-md"
                      fontWeight="400"
                      sx={{
                        color:
                          activeCategory === "Customer"
                            ? "var(--joy-palette-text-primary)"
                            : "#32383E",
                        fontSize: "16px",
                      }}
                    >
                      Customer
                    </Typography>
                    <ArrowRightIcon fontSize="var(--Icon-fontSize)" />
                  </Box>
                )}
                {users && users?.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: "6px 12px",
                      bgcolor:
                        activeCategory === "Role"
                          ? "var(--joy-palette-background-mainBg)"
                          : "transparent",
                      borderRadius: "4px",
                      border:
                        activeCategory === "Role"
                          ? "1px solid var(--joy-palette-divider)"
                          : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCategoryClick("Role")}
                  >
                    <Typography
                      level="body-md"
                      fontWeight="400"
                      sx={{
                        color:
                          activeCategory === "Role"
                            ? "var(--joy-palette-text-primary)"
                            : "#32383E",
                        fontSize: "16px",
                      }}
                    >
                      Role
                    </Typography>
                    <ArrowRightIcon fontSize="var(--Icon-fontSize)" />
                  </Box>
                )}
                {customers && customers?.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: "6px 12px",
                      bgcolor:
                        activeCategory === "Manager"
                          ? "var(--joy-palette-background-mainBg)"
                          : "transparent",
                      borderRadius: "4px",
                      border:
                        activeCategory === "Manager"
                          ? "1px solid var(--joy-palette-divider)"
                          : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCategoryClick("Manager")}
                  >
                    <Typography
                      level="body-md"
                      fontWeight="400"
                      sx={{
                        color:
                          activeCategory === "Manager"
                            ? "var(--joy-palette-text-primary)"
                            : "#32383E",
                        fontSize: "16px",
                      }}
                    >
                      Manager
                    </Typography>
                    <ArrowRightIcon fontSize="var(--Icon-fontSize)" />
                  </Box>
                )}
                {customers && customers?.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: "6px 12px",
                      bgcolor:
                        activeCategory === "Subscription"
                          ? "var(--joy-palette-background-mainBg)"
                          : "transparent",
                      borderRadius: "4px",
                      border:
                        activeCategory === "Subscription"
                          ? "1px solid var(--joy-palette-divider)"
                          : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCategoryClick("Subscription")}
                  >
                    <Typography
                      level="body-md"
                      fontWeight="400"
                      sx={{
                        color:
                          activeCategory === "Subscription"
                            ? "var(--joy-palette-text-primary)"
                            : "#32383E",
                        fontSize: "16px",
                      }}
                    >
                      Subscription
                    </Typography>
                    <ArrowRightIcon fontSize="var(--Icon-fontSize)" />
                  </Box>
                )}
              </Stack>
            </Box>

            <Box sx={{ width: "42%", pl: 1 }}>
              {activeCategory && (
                <>
                  <Typography
                    level="body-md"
                    fontWeight="600"
                    sx={{
                      fontSize: "12px",
                      mb: 1.5,
                      color: "var(--joy-palette-text-primary)",
                    }}
                  >
                    Select {activeCategory.toLowerCase()}
                  </Typography>
                  <Stack spacing={1}>
                    {activeCategory === "Status" &&
                      statuses?.map((status) => (
                        <Box
                          key={status}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Checkbox
                            checked={selectedStatuses.includes(status)}
                            onChange={() => handleStatusChange(status)}
                          />
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: "14px",
                              color: "var(--joy-palette-text-primary)",
                            }}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Typography>
                        </Box>
                      ))}
                    {activeCategory === "Customer" &&
                      customersSelect?.map((customer) => (
                        <Box
                          key={customer.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Checkbox
                            checked={selectedCustomerIds.includes(customer.id)}
                            onChange={() => handleCustomerChange(customer.id)}
                          />
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: "14px",
                              color: "var(--joy-palette-text-primary)",
                            }}
                          >
                            {customer.name}
                          </Typography>
                        </Box>
                      ))}
                    {activeCategory === "Role" &&
                      roles?.map((role) => (
                        <Box
                          key={role.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Checkbox
                            checked={selectedRoleIds.includes(role.id)}
                            onChange={() => handleRoleChange(role.id)}
                          />
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: "14px",
                              color: "var(--joy-palette-text-primary)",
                            }}
                          >
                            {role.name}
                          </Typography>
                        </Box>
                      ))}
                    {activeCategory === "Manager" &&
                      managersSelect?.map((manager) => (
                        <Box
                          key={manager.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Checkbox
                            checked={selectedManagerIds.includes(manager.id)}
                            onChange={() => handleManagerChange(manager.id)}
                          />
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: "14px",
                              color: "var(--joy-palette-text-primary)",
                            }}
                          >
                            {manager.name}
                          </Typography>
                        </Box>
                      ))}
                    {activeCategory === "Subscription" &&
                      subscriptions?.map((subscription) => (
                        <Box
                          key={subscription.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Checkbox
                            checked={selectedSubscriptionIds.includes(
                              subscription.id
                            )}
                            onChange={() =>
                              handleSubscriptionChange(subscription.id)
                            }
                          />
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: "14px",
                              color: "var(--joy-palette-text-primary)",
                            }}
                          >
                            {subscription.name}
                          </Typography>
                        </Box>
                      ))}
                  </Stack>
                </>
              )}
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
            }}
          >
            <Button variant="plain" onClick={handleReset}>
              Reset filters
            </Button>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="solid"
                onClick={handleApply}
                sx={{
                  borderRadius: "20px",
                  bgcolor: "#4F46E5",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  "&:hover": { bgcolor: "#4338CA" },
                }}
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </Sheet>
      )}
    </>
  );
};

export default Filter;
