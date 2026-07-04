import { Loader2 } from "lucide-react";

const Spinner = ({ className = "h-5 w-5" }) => (
  <Loader2 className={`${className} animate-spin text-brand-400`} />
);

export default Spinner;
