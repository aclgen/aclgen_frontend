import CreationPopup from "../../features/creation/CreationPopup";
import NavBar from "../navbar";
import dynamic from "next/dynamic";

const RightClickHandler = dynamic(
  () => import("../../features/rightclick/RightClickHandler"),
  { ssr: false }
);

export type BaseProps = {
  Child: React.FC;
};

function BasePage({ Child }: BaseProps) {
  return (
    <div className="max-h-screen overflow-hidden">
      <RightClickHandler />
      <NavBar />
      <div className="bg-slate-50 dark:bg-gray-600">
        <Child />
      </div>
      <CreationPopup />
    </div>
  );
}

export default BasePage;
