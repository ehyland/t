import { createConfig } from "@bad-hacking/generate-component";

export default createConfig({
  sourceBaseImportPrefix: "~/",
  sourceBaseDir: "src",
  componentDirs: ["src/components"],
  createComponentIndexFile: true,
  createComponentsIndexFile: true,
  templates: {
    componentFile: ({ componentName, componentPropsName }) => `
      import { ReactNode, useState } from "react";

      type ${componentPropsName} = {
        children?: ReactNode;
      };
      
      export function ${componentName}(props: ${componentPropsName}) {
        const [count, setCount] = useState(0);
      
        return (
          <div>
            {props.children}
            <button
              type="button"
              className="text-white font-medium px-4 py-2 bg-gray-800 border-none rounded-md flex-grow-0"
              onClick={() => setCount((count) => count + 1)}
            >
              count is {count}
            </button>
          </div>
        );
      }
    `,

    componentTestFile: ({ componentName }) => `
      import {
        render,
        screen,
        userEvent,
        beforeEach,
        describe,
        expect,
        it,
      } from "~/test-utils";
      
      import { ${componentName} } from "./${componentName}";
      
      describe("<${componentName} />", () => {
        beforeEach(() => {
          render(<${componentName} />);
        });
      
        it("renders a button", () => {
          expect(screen.getByRole("button")).toHaveTextContent("count is 0");
        });
      
        describe("when the button is clicked", () => {
          beforeEach(async () => {
            await userEvent.click(screen.getByRole("button"));
          });
      
          it("increments the counter", () => {
            expect(screen.getByRole("button")).toHaveTextContent("count is 1");
          });
        });
      });
    `,

    componentCssFileName: ({ componentName }) => `${componentName}.module.css`,

    componentCssFile: () => `
      .container {
        position: relative;
      }
    `,

    componentIndexFile: ({ componentName }) => `
      export { ${componentName} } from './${componentName}';
    `,

    componentsIndexFile: ({ componentName, componentNestedImportPath }) => `
      export { ${componentName} } from '${componentNestedImportPath}';
    `,
  },
});
