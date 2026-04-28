export const AdminNav = [
  {
    name: "Dashboard",
    href: "dashboard",
    path: "/dashboard",
  },
  {
    name: "Blogs",
    href: "blogs",
    children: [
      {
        name: "All Blog",
        href: "all-blog",
        path: "/all-blogs-admin",
      },
      {
        name: "Add Blog",
        href: "add-blog",
        path: "/blogs/create/admin",
      },
      {
        name: "Edit Blog",
        href: "edit-blog",
        path: "/blogs/edit/admin",
      },
    ],
  },
];