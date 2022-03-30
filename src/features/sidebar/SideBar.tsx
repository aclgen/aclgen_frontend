function SideBar() {
  return (
    <div className="flex flex-col space-y-4 min-h-screen w-90">
      <div className="flex flex-col w-full flex-basis-1/2 ">
        <div>Devices</div>
      </div>
      <div className="flex flex-col flex-basis-1/2 border-t w-full">
        <div>Services and objects</div>
        <div className="flex flex-col w-full pl-2">
          <div>Netowrk objects</div>
        </div>
        <div className="flex flex-col w-full pl-2">
          <div>Services</div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
