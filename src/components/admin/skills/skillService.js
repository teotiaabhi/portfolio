export const getSkills = () => {
  return JSON.parse(localStorage.getItem("skills")) || [];
};

export const addSkill = (skill) => {
  const existing = getSkills();
  if (!existing.includes(skill)) {
    const updated = [...existing, skill];
    localStorage.setItem("skills", JSON.stringify(updated));
  }
};

export const deleteSkill = (skill) => {
  const updated = getSkills().filter((s) => s !== skill);
  localStorage.setItem("skills", JSON.stringify(updated));
};
