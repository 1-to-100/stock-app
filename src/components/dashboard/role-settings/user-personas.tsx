import * as React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import { Plus as Plus } from "@phosphor-icons/react/dist/ssr/Plus";

const UserPersonas: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 20 }}>
      <Typography sx={{fontSize: '24px', fontWeight: '600', color: 'var(--joy-palette-text-primary)'}}>You do not have any rich persona</Typography>
      <Typography sx={{fontSize: '14px', fontWeight: '300', color: 'var(--joy-palette-text-secondary)', mt: 1}}>
        Create a persona to define your target user’s traits, needs, <br /> and goals.
      </Typography>
      <Button
        variant="outlined"
        startDecorator={<Plus size={20} weight="bold"/>}
        sx={{ mt: 2, color: 'var(--joy-palette-text-secondary)' }}
      >
        Add rich persona
      </Button>
    </Box>
  );
};

export default UserPersonas;
