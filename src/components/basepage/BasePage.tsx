import NavBar from "../navbar";

export type BaseProps = {
  Child: React.FC;
};

function BasePage({ Child }: BaseProps) {
  return (
    <>
      <NavBar />
      <div className="bg-slate-50 dark:bg-gray-600">
        <Child />
      </div>
    </>
  );
}

export default BasePage;
