import type { Meta, StoryObj } from "@storybook/react";
import { Label, RadioGroup, RadioGroupItem, View } from "ui";

const meta: Meta<typeof RadioGroup> = {
  title: "Organisms/RadioGroup",
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const RoleSelection: Story = {
  render: () => (
    <RadioGroup defaultValue="admin" className="gap-3">
      {[
        { value: "admin", label: "Admin" },
        { value: "monitor", label: "Monitor" },
        { value: "stakeholder", label: "Stakeholder" },
      ].map((option) => (
        <View key={option.value} className="flex-row items-center gap-2">
          <RadioGroupItem id={option.value} value={option.value} />
          <Label>{option.label}</Label>
        </View>
      ))}
    </RadioGroup>
  ),
};









