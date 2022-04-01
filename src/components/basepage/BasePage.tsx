import CreationPopup from "../../features/creation/CreationPopup";
import ServiceCreationPopup from "../../features/service/ServiceCreationPoopup";
import NavBar from "../navbar";

export type BaseProps = {
  Child: React.FC;
};

function BasePage({ Child }: BaseProps) {
  return (
    <div className="max-h-screen overflow-hidden">
      <NavBar />
      <div className="bg-slate-50 dark:bg-gray-600">
        <Child />
      </div>
      <CreationPopup />
    </div>
  );
}

export default BasePage;
