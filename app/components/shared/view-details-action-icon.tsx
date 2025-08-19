import { ActionIcon, Tooltip } from "@mantine/core";
import { Info } from "lucide-react";
import { NavLink } from "react-router";

export function ViewDetailsActionIcon(props: { to: string }) {
  return (
    <Tooltip label="View Details">
      <NavLink to={props.to} preventScrollReset>
        {({ isPending }) => (
          <ActionIcon size="sm" variant="light" loading={isPending}>
            <Info size={14} />
          </ActionIcon>
        )}
      </NavLink>
    </Tooltip>
  );
}
