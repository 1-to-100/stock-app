import * as React from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { DotsThree as DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree";
import { IconButton } from "@mui/joy";
import Link from "next/link"; 
import { paths } from "@/paths"; 


const RouterLink = Link;

export interface Role {
  id: string;
  abbreviation: string;
  name: string;
  description: string;
  peopleCount: number;
}

export const roles: Role[] = [
  {
    id: "1",
    abbreviation: "SA",
    name: "System Admin",
    description:
      "Admins have full access to the platform, just like owners. Reserved for founders and tech ops...",
    peopleCount: 13,
  },
  {
    id: "2",
    abbreviation: "CS",
    name: "Customer Success / Support",
    description:
      "Can access accounts they are assigned to and impersonate users in those accounts",
    peopleCount: 3,
  },
  {
    id: "3",
    abbreviation: "CA",
    name: "Customer Admin",
    description:
      "Has access to customer wide configuration and setup including adding and removing users, assigning licenses and the li...",
    peopleCount: 33,
  },
  {
    id: "4",
    abbreviation: "MA",
    name: "Manager",
    description:
      "Has access to information directly pertaining to the people that report to them",
    peopleCount: 56,
  },
  {
    id: "5",
    abbreviation: "US",
    name: "User",
    description:
      "Default user for an organization that signs up via onboarding flow. Further assigned into a Rich User Persona...",
    peopleCount: 1253,
  },
];

const RoleSettings: React.FC = () => {
  const getRolePath = (roleId: string) => {
    switch (roleId) {
      case "1":
        return paths.dashboard.roleSettings.systemAdmin;
      case "2":
        return paths.dashboard.roleSettings.customerSuccess;
      case "3":
        return paths.dashboard.roleSettings.customerAdmin;
      case "4":
        return paths.dashboard.roleSettings.manager;
      case "5":
        return paths.dashboard.roleSettings.user;
      default:
        return paths.dashboard.roleSettings.list; 
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        p: 0,
        gap: 2,
        mt: 2,
        maxWidth: "1050px",
      }}
    >
      {roles.map((role: Role) => (
        <RouterLink
          key={role.id}
          href={{
            pathname: getRolePath(role.id),
          }}
          passHref
          style={{ textDecoration: "none" }}
        >
          <Card
            variant="outlined"
            sx={{
              p: "16px",
              borderRadius: "8px",
              border: "1px solid var(--joy-palette-divider)",
              boxShadow: "none",
              backgroundColor: "var(--joy-palette-background-body)",
              display: "flex",
              flexDirection: "column",
              minHeight: "210px",
              cursor: "pointer",
              "&:hover": {
                borderColor: "var(--joy-palette-text-secondary)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor:
                    role.abbreviation === "SA"
                      ? "#DAD8FD"
                      : role.abbreviation === "CS"
                      ? "#DDE7EE"
                      : role.abbreviation === "CA"
                      ? "#FFE9E8"
                      : role.abbreviation === "MA"
                      ? "#FFF8C5"
                      : "#FFE9E8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color:
                    role.abbreviation === "SA"
                      ? "#443DF6"
                      : role.abbreviation === "CS"
                      ? "#555E68"
                      : role.abbreviation === "CA"
                      ? "#9C1818"
                      : role.abbreviation === "MA"
                      ? "#7D4E00"
                      : "#D3232F",
                }}
              >
                {role.abbreviation}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  level="title-md"
                  sx={{
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "var(--joy-palette-text-primary)",
                  }}
                >
                  {role.name}
                </Typography>
                <Typography
                  level="body-xs"
                  sx={{
                    mt: 0.5,
                    color: "var(--joy-palette-text-secondary)",
                    fontWeight: "400",
                    fontSize: "12px",
                  }}
                >
                  Default role
                </Typography>
              </Box>
              <IconButton
                size="sm"
                // onClick={(event) => {
                //   handleMenuOpen(event, index);
                // }}
              >
                <DotsThree
                  weight="bold"
                  size={22}
                  color="var(--joy-palette-text-secondary)"
                />
              </IconButton>
            </Box>
            <Box
              sx={{
                mt: 1.5,
                flexGrow: 1,
              }}
            >
              <Typography
                level="body-sm"
                sx={{
                  color: "var(--joy-palette-text-secondary)",
                  fontWeight: "300",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {role.description}
              </Typography>
            </Box>
            <Typography
              level="body-md"
              sx={{
                fontWeight: "400",
                fontSize: "12px",
                color: "var(--joy-palette-text-secondary)",
                pt: 1.5,
                borderTop: "1px solid var(--joy-palette-divider)",
                mt: "auto",
              }}
            >
              {role.peopleCount} people
            </Typography>
          </Card>
        </RouterLink>
      ))}
    </Box>
  );
};

export default RoleSettings;