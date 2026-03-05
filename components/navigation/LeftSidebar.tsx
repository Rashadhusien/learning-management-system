import NavLinks from "./navbar/NavLinks";

const LeftSidebar = async () => {
  return (
    <section className=" custom-scrollbar p-6 bg-background/30   max-sm:hidden border-r border-foreground/20    flex flex-col  justify-between overflow-y-auto  sticky left-0 top-0 h-screen  lg:w-[266px]  ">
      <div className="  flex flex-1 md:w-full justify-start flex-col w-fit gap-5">
        <NavLinks isAdmin />
      </div>
    </section>
  );
};

export default LeftSidebar;
