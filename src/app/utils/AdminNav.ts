export const AdminNav = [
  {
    name: "Dashboard",
    href: "dashboard",
    path: "/dashboard",
  },
  {
    name: "Profile",
    href: "/profile",
    children: [
      { name: "Show Profile", href: "/profile-show", path: "/profile-show-admin" },
      { name: "Update Profile", href: "/update-profile", path: "/update-profile-admin" },
    ]
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
        path: "/blogs-create-admin",
      },
    ],
  },
  {
    name: "Contact",
    href: "/contact-admin",
    children: [
      { name: "New Contacts", href: "/new-contact", path: "/admin/moshiur/new-contacts-admin" },
      { name: "Read Contacts", href: "/read-contacts", path: "/admin/moshiur/read-contacts-admin" },
    ]
  }
];