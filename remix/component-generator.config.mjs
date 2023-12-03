import { createConfig } from '@bad-hacking/generate-component';

export default createConfig({
  sourceBaseImportPrefix: '~/',
  sourceBaseDir: 'app',
  componentDirs: ['app/components'],
  createComponentIndexFile: true,
  createComponentsIndexFile: true,
  templates: {
    componentFile: ({
      componentName,
      componentPropsName,
      componentCssFileName,
    }) => `
      import React from 'react';

      type ${componentPropsName} = {
        children?: React.ReactNode;
      }

      export function ${componentName}(props: ${componentPropsName}) {
        return <div>${componentName}</div>;
      };
    `,

    componentTestFile: ({ componentName }) => `
      import { render } from '@testing-library/react';
      import { ${componentName} } from './${componentName}';

      describe('<${componentName} />', () => {
        it('should render', () => {
          const { getByText } = render(<${componentName} />);
          expect(getByText('${componentName}')).toBeInTheDocument();
        });
      });
    `,

    componentCssFileName: ({ componentName }) => `${componentName}.module.css`,

    componentCssFile: () => ``,

    componentIndexFile: ({ componentName }) => `
      export { ${componentName} } from './${componentName}';
    `,

    componentsIndexFile: ({ componentName, componentNestedImportPath }) => `
      export { ${componentName} } from '${componentNestedImportPath}';
    `,
  },
});
