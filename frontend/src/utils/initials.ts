export function getInitials(name: string): string {
  const names = name.split(" ");
  const initials = names.map((name) => name[0]);
  return initials.join("");
}

export function getInitialsMaxTwoLetters(name: string): string {
  const names = name.split(" ");
  const initials = names.map((name) => name[0]);
  return initials.slice(0, 2).join("");
}
