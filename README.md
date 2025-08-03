# Just Another VSCode React NextJS File Generator ![Version](https://img.shields.io/visual-studio-marketplace/v/mikerheault.vscode-react-nextjs-generator)

A VSCode extension to effortlessly generate React and Next.js files with customizable templates.

## ✨ Features

- Automatically generate React components with SCSS modules and test file
- Supports NextJS file structure
  - Loading
  - Error
  - Page
  - Layout
- Customizable templates
- Integration with VSCode commands
- Snippets for React/Next components

![Context menu](https://raw.githubusercontent.com/mrheault/vscode-react-nextjs-generator/refs/heads/main/images/explorer-context-menu.jpg)
_Explorer Context Menu_

## 🔧 Snippets

| Prefix           | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `rimr`           | JavaScript/TypeScript: import react                              |
| `rfc`            | JavaScript/TypeScript: React functional component                |
| `rfce`           | JavaScript/TypeScript: React functional component with useEffect |
| `rfcs`           | JavaScript/TypeScript: React functional component with useState  |
| `rctx`           | JavaScript/TypeScript: React context with provider and hook      |
| `nxpg`           | NextJS page file                                                 |
| `nxlayout`       | NextJS layout                                                    |
| `nxerror`        | NextJS error                                                     |
| `nxloading`      | NextJS loading                                                   |
| `nxcomponent`    | React component                                                  |
| `nxcomponentcss` | React component CSS module                                       |
| `nxtest`         | React component test                                             |

## 🛠️ Installation

There are several ways to install.

- Install from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mikerheault.vscode-react-nextjs-generator).
- From the VS Code Extensions view (`Ctrl+Shift+X`) or (`Cmd+Shift+X`), search for `VSCode React NextJS Generator`.
- Run `ext install mikerheault.vscode-react-nextjs-generator` in the command palette (`Ctrl+Shift+P`) or (`Cmd+Shift+P`).

## ▶️ Demo

![Create React Component](https://raw.githubusercontent.com/mrheault/vscode-react-nextjs-generator/refs/heads/main/images/react-component.gif)
_Create React Component_

![Create Next Layout File](https://raw.githubusercontent.com/mrheault/vscode-react-nextjs-generator/refs/heads/main/images/layout-file.gif)
_Create Next Layout File_

![Snippet](https://raw.githubusercontent.com/mrheault/vscode-react-nextjs-generator/refs/heads/main/images/snippet.gif)
_Example Snippet_

## ⚙️ Configuration/Settings

<table>
  <thead>
    <tr>
      <th>Setting</th>
      <th>Description</th>
      <th>Type</th>
      <th>Default Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>reactNextjsGenerator.templates.page</code></td>
      <td>Template for Next.js page component</td>
      <td>string</td>
      <td>

```
import React from 'react';

export default async function Page({params,searchParams,}: {
params: { slug: string | string[] };
searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div>
    <h1>Page</h1>
    </div>
  );
};

export async function generateMetadata({
params,
searchParams,
}: {
params: { slug: string | string[] };
searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata | undefined> {
  return {};
}

```

</td>
</tr>
<tr>
<td><code>reactNextjsGenerator.templates.layout</code></td>
<td>Template for Next.js layout component</td>
<td>string</td>
<td>

```
import React from 'react';

export default async function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
  return (
    <div>
    <header>Header</header>
    <main>{children}</main>
    <footer>Footer</footer>
    </div>
  );
};
```

</td>
</tr>
<tr>
<td><code>reactNextjsGenerator.templates.error</code></td>
<td>Template for Next.js error component</td>
<td>string</td>
<td>

```
import React from 'react';

export default function Error() {
  return (
    <div>
    <h1>Error: Something went wrong</h1>
    </div>
  );
};
```

</td>
</tr>
<tr>
<td><code>reactNextjsGenerator.templates.loading</code></td>
<td>Template for Next.js loading component</td>
<td>string</td>
<td>

```
import React from 'react';

export default function Loading() {
  return (
    <div>
    <h1>Loading...</h1>
    </div>
  );
};

```

</td>
</tr>
<tr>
<td><code>reactNextjsGenerator.templates.reactComponent</code></td>
<td>Template for React component</td>
<td>string</td>
<td>

```
import React from 'react';
import styles from './{fileName}.module.css';

export type {fileName}Props = {{}};

export const {fileName}: React.FC<{fileName}Props> = () => {{
  return (
    <div className={styles.container}>
      {fileName} Component
    </div>
  );
}};
```

</td>
</tr>
<tr>
<td><code>reactNextjsGenerator.templates.reactComponentCss</code></td>
<td>Template for React component CSS module</td>
<td>string</td>
<td>
<pre><code>.container {
/_ Add your styles here _/
}</code></pre>
</td>
</tr>
<tr>
<td><code>reactNextjsGenerator.templates.reactComponentTest</code></td>
<td>Template for React component test file</td>
<td>string</td>
<td>

```
import React from 'react';
import { render } from '@testing-library/react';
import {fileName} from '../{fileName}';

test('renders {fileName} component', () => {{
  render(<{fileName} />);
}});

```

</td>
</tr>

  </tbody>
</table>

## 👨‍💻 Usage

1. **Generate a React Component:**

- Right-click on a folder in the Explorer.
- Select `React/Next Generator > Generate React Component`.
- Follow the prompts to create a new React component with SCSS module and test file.

2. **Generate a Next.js (Page, Loading, Layout, Error) file:**

- Right-click on a folder in the Explorer.
- Select `React/Next Generator > Generate Next.js {type} File`.
- Choose the desired file type (e.g., `Page`, `Loading`, `Layout`, `Error`).

3. **Use Snippets:**

- Open a JavaScript or TypeScript file.
- Type the snippet prefix (e.g., `rimr`, `rfc`, `nxpg`) and select the desired snippet from the suggestions.

## 🤝 Contributing

[Contributions are welcome!](https://github.com/mrheault/vscode-react-nextjs-generator/pulls)

## 📜 License

Licensed under the MIT License.

## 🚨 Support

For issues or feature requests, [file an issue](https://github.com/mrheault/vscode-react-nextjs-generator/issues).

## 📢 Release Notes

[Change log here](https://github.com/mrheault/vscode-react-nextjs-generator/blob/main/CHANGELOG.md)
