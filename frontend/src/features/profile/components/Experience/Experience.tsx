import { useState } from "react";
import { EditableSection } from "../EditableSection/EditableSection";

interface ExperienceProps {
  isOwner?: boolean;
}

export function Experience({ isOwner = false }: ExperienceProps) {
  const [experience, setExperience] = useState("");

  return (
    <EditableSection
      title="Experience"
      value={experience}
      placeholder="Add your work experience."
      onSave={setExperience}
      isOwner={isOwner}
    />
  );
}