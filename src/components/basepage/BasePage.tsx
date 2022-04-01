import CreationPopup from "../../features/creation/CreationPopup";
import ServiceCreationPopup from "../../features/service/ServiceCreationPoopup";
import NavBar from "../navbar";

export type BaseProps = {
  Child: React.FC;
};

function BasePage({ Child }: BaseProps) {
  return (
    <div className="max-h-screen overflow-clip">
      <NavBar />
      <div className="bg-slate-50 dark:bg-gray-600 h-min-screen">
        <Child />
      </div>
      <CreationPopup />
    </div>
  );
}

export default BasePage;
