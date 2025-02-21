import { toaster } from "@/components/ui/toaster";

export const ToasterNotification = ({ type, description, title }) => {
  return toaster.create({
    title: title,
    type: type,
    description: description,
    duration: 2000,
    // offsets: {bottom: "500px"},
  });
};
