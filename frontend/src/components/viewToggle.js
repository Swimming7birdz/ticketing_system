import * as React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function ViewToggle({ value, onChange }) {
  const handle = (_e, val) => {
    if (val) onChange?.(val);
  };
  return (
    <ToggleButtonGroup size="small" value={value} exclusive onChange={handle} aria-label="view">
      <ToggleButton value="list" aria-label="list view">List</ToggleButton>
      <ToggleButton value="grid" aria-label="grid view">Grid</ToggleButton>
    </ToggleButtonGroup>
  );
}
