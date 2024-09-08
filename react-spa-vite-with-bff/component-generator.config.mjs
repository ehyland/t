import { createConfig } from '@bad-hacking/generate-component';

export default createConfig({
  sourceBaseImportPrefix: '~/',
  sourceBaseDir: 'src/app',
  componentDirs: ['src/app/components'],
  createComponentIndexFile: false,
  createComponentsIndexFile: true,
  templates: {
    componentFile: ({ componentName, componentPropsName }) => `
      import React from 'react';

      type ${componentPropsName} = {
        children?: React.ReactNode
      }

      export function ${componentName}(props: ${componentPropsName}) {
        return <div>${componentName}</div>;
      };
    `,

    componentTestFile: ({ componentName }) => `
      import { describe, it, expect } from 'vitest';
      import { render } from '@testing-library/react';
      import { ${componentName} } from './${componentName}';

      describe('<${componentName} />', () => {
        it('should render', () => {
          const { getByText } = render(<${componentName} />);
          expect(getByText('${componentName}')).toBeInTheDocument();
        });
      });
    `,
  },
});
