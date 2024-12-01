import NavBreadcrumb from "./components/nav-breadcrumb";

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b">
        <div className="container mx-auto px-4">
          <NavBreadcrumb />
        </div>
      </div>
      {children}
    </div>
  );
}
