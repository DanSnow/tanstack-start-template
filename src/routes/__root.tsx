import {
  createRootRouteWithContext,
  HeadContent,
  linkOptions,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import jotaiDevtoolStyle from 'jotai-devtools/styles.css?url';
import type * as React from 'react';
import { lazy } from 'react';
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary';
import { NavLink } from '~/components/NavLink';
import { NotFound } from '~/components/NotFound';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '~/components/ui/navigation-menu';
import type { Context } from '~/router-context';
import appCss from '~/styles/app.css?url';
import { seo } from '~/utils/seo';
import { WrapComponent } from '~/WrapComponent';

export const Route = createRootRouteWithContext<Context>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title:
          'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
        description:
          'TanStack Start is a type-safe, client-first, full-stack React framework. ',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'stylesheet', href: jotaiDevtoolStyle },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

const EmptyComponent = () => null;

EmptyComponent.displayName = 'EmptyComponent';

const Devtools = import.meta.env.DEV
  ? lazy(() => import('~/components/Devtools'))
  : EmptyComponent;

function RootComponent() {
  const ctx = Route.useRouteContext();

  return (
    <RootDocument>
      <WrapComponent context={ctx}>
        <Outlet />
      </WrapComponent>
      <Devtools />
    </RootDocument>
  );
}

const links = linkOptions([
  {
    to: '/',
    label: 'Home',
  },
  {
    to: '/sign-in',
    label: 'Sign In',
  },
  {
    to: '/sign-up',
    label: 'Sign Up',
  },
]);

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // biome-ignore lint/a11y/useHtmlLang: <explanation>
    <html className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <NavigationMenu>
          <NavigationMenuList>
            {links.map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavLink to={link.to}>{link.label}</NavLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
