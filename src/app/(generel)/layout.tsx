import Header from "../components/Header/Header";
import Footer from "../components/sharedComponents/Footer/Footer";
import NavList from "../components/sharedComponents/NavList/NavList";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className=" w-full max-w-400 mx-auto">
        <Header />
      </header>

      <div className="w-full max-w-400 mx-auto pt-10">
        <div className="h-px bg-gray-700 w-full"></div>

        <main className="min-h-screen flex gap-6">
          <aside className="hidden md:block w-64 relative px-4">
            <div className="absolute left-0 top-0 h-full w-px bg-gray-700"></div>
            <div className="absolute right-0 top-0 h-full w-px bg-gray-700"></div>

            <div className="top-20">
              <NavList />
            </div>
          </aside>

          <section className="flex-1">{children}</section>
        </main>
      </div>

      <footer>
        <Footer />
      </footer>
    </>
  );
}