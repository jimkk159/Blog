function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#d65a31] p-3">
      <p className={"min-h-4 m-2 text-center font-kanit"}>
        copyright {year} &copy; Jim's Blog
      </p>
    </footer>
  );
}

export default Footer;
