interface RouterLinkProps {
  to: string;
  children: string;
}

const RouterLink = (props: RouterLinkProps) => {
  const { to, children, ...rest } = props;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

export default RouterLink;
