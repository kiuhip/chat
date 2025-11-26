import { LoaderIcon } from "lucide-react"

function PageLoader() {
  return (
    <div className = "flex item-center justify-center h-screen">
        <LoaderIcon className = "size-10 animate-spin" /> 
    </div>
  );
}

export default PageLoader;
