import CreationPopup from "../../features/creation/CreationPopup";
import NavBar from "../navbar";
import RightClickHandler from "../../features/rightclick/RightClickHandler";

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
