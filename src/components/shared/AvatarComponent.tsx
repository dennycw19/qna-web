import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type AvatarComponentProps = {
  name: string;
  image: string;
};

export const AvatarComponent = (props: AvatarComponentProps) => {
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };
  return (
    <Avatar className="size-14">
      <AvatarFallback>{getInitials(props.name)}</AvatarFallback>
      <AvatarImage src={props.image ?? ""} alt={props.name ?? "User"} />
    </Avatar>
  );
};
