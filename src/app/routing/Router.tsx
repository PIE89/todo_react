import { useEffect, useState } from "react";

type MatchPathParams = Record<string, string>;

const matchPath = (path: string, route: string): MatchPathParams | null => {
  const pathParts = path.split("/");
  const routePaths = route.split("/");

  if (pathParts.length !== routePaths.length) return null;

  const params = {};

  for (let i = 0; i < routePaths.length; i++) {
    if (routePaths[i].startsWith(":")) {
      const paramsName = routePaths[i].slice(1);
      params[paramsName] = pathParts[i];
    } else if (routePaths[i] !== pathParts[i]) {
      return null;
    }
  }

  return params;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRoute = () => {
  const [path, setPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", onLocationChange);

    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  return path;
};

export type RouteParams = MatchPathParams;

export type RouteComponent = React.ComponentType<{ params: RouteParams }>;

export interface RouterProps {
  routes: Record<string, RouteComponent>;
}

const Router = ({ routes }: RouterProps) => {
  const path = useRoute();

  for (const route in routes) {
    const params = matchPath(path, route);

    if (params) {
      const Page = routes[route];

      return <Page params={params} />;
    }
  }

  const NotFound = routes["*"];

  return <NotFound params={{}} />;
};

export default Router;
